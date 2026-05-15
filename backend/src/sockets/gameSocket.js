// =============================================
// SATORI - Lógica del Juego en Tiempo Real
// Socket.io - GameSocket con Mongoose
// =============================================

const { v4: uuidv4 } = require('uuid');
const Quiz = require('../models/Quiz');
const Game = require('../models/Game');

// Almacén de salas activas en memoria
const salas = {}; // { codigoSala: { ...datosPartida } }

// Genera código de sala aleatorio de 6 caracteres
function generarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Fórmula de puntos: más rápido = más puntos
function calcularPuntos(tiempoRespuesta, tiempoLimite) {
  const basePoints = 1000;
  const factor = tiempoRespuesta / tiempoLimite;
  return Math.max(100, Math.round(basePoints * (1 - factor * 0.7)));
}

// Mezclar array (Fisher-Yates) para preguntas aleatorias
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

module.exports = function(io) {

  io.on('connection', (socket) => {
    console.log(`🔌 Conectado: ${socket.id}`);

    // ----------------------------------------
    // DOCENTE: Crear sala de juego
    // ----------------------------------------
    socket.on('crear-sala', async ({ quizId, docenteId, docenteNombre }) => {
      try {
        const quiz = await Quiz.findOne({ id: quizId });
        if (!quiz) {
          socket.emit('error-sala', { mensaje: 'Cuestionario no encontrado' });
          return;
        }

        const quizClonado = JSON.parse(JSON.stringify(quiz));
        quizClonado.preguntas = shuffleArray(quizClonado.preguntas);

        const codigo = generarCodigo();
        const sala = {
          id: uuidv4(),
          codigo,
          quizId,
          docenteId,
          docenteNombre,
          quiz: quizClonado,
          jugadores: [],
          estado: 'esperando', // esperando | jugando | finalizado
          preguntaActual: -1,
          iniciada: false,
          creadaEn: new Date().toISOString()
        };

        salas[codigo] = sala;
        socket.join(codigo);
        socket.salaActual = codigo;
        socket.esDocente = true;

        console.log(`🎮 Sala creada: ${codigo} | Quiz: ${quiz.titulo}`);
        socket.emit('sala-creada', { codigo, sala });
      } catch (error) {
        console.error('Error al crear sala:', error);
        socket.emit('error-sala', { mensaje: 'Error al cargar el cuestionario' });
      }
    });

    // ----------------------------------------
    // ESTUDIANTE: Unirse a sala con código
    // ----------------------------------------
    socket.on('unirse-sala', ({ codigo, nombreJugador, avatar }) => {
      const codigoUpper = codigo.toUpperCase();
      const sala = salas[codigoUpper];

      if (!sala) {
        socket.emit('error-sala', { mensaje: 'Código de sala inválido o sala no existe' });
        return;
      }
      if (sala.estado === 'finalizado') {
        socket.emit('error-sala', { mensaje: 'Esta partida ya finalizó' });
        return;
      }
      if (sala.estado === 'jugando') {
        socket.emit('error-sala', { mensaje: 'La partida ya comenzó' });
        return;
      }

      // Verificar nombre duplicado
      const nombreDuplicado = sala.jugadores.find(j => j.nombre === nombreJugador);
      if (nombreDuplicado) {
        socket.emit('error-sala', { mensaje: 'Ese nombre ya está en uso en esta sala' });
        return;
      }

      const jugador = {
        id: socket.id,
        nombre: nombreJugador,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${nombreJugador}`,
        puntos: 0,
        respuestas: [],
        conectado: true
      };

      sala.jugadores.push(jugador);
      socket.join(codigoUpper);
      socket.salaActual = codigoUpper;
      socket.nombreJugador = nombreJugador;

      console.log(`👤 ${nombreJugador} se unió a sala ${codigoUpper}`);

      // Notificar al jugador que entró
      socket.emit('unido-sala', { sala: { ...sala, quiz: { titulo: sala.quiz.titulo } }, jugador });

      // Notificar a todos en la sala (incluyendo docente)
      io.to(codigoUpper).emit('jugador-unido', { jugadores: sala.jugadores });
    });

    // ----------------------------------------
    // DOCENTE: Iniciar partida
    // ----------------------------------------
    socket.on('iniciar-partida', ({ codigo }) => {
      const sala = salas[codigo];
      if (!sala) return;
      if (sala.jugadores.length === 0) {
        socket.emit('error-sala', { mensaje: 'No hay jugadores en la sala' });
        return;
      }

      sala.estado = 'jugando';
      sala.iniciada = true;
      sala.preguntaActual = -1;

      console.log(`▶️  Partida iniciada en sala ${codigo}`);
      io.to(codigo).emit('partida-iniciando', { cuenta: 3 });

      // Countdown de 3 segundos y luego primera pregunta
      setTimeout(() => enviarPregunta(codigo, io, sala), 3500);
    });

    // ----------------------------------------
    // ESTUDIANTE: Responder pregunta
    // ----------------------------------------
    socket.on('responder', ({ codigo, respuesta, tiempoRespuesta }) => {
      const sala = salas[codigo];
      if (!sala || sala.estado !== 'jugando') return;

      const jugador = sala.jugadores.find(j => j.id === socket.id);
      if (!jugador) return;

      const preguntaIdx = sala.preguntaActual;
      const pregunta = sala.quiz.preguntas[preguntaIdx];
      if (!pregunta) return;

      // Verificar si ya respondió esta pregunta
      const yaRespondio = jugador.respuestas.find(r => r.preguntaIdx === preguntaIdx);
      if (yaRespondio) return;

      const esCorrecta = respuesta === pregunta.correcta;
      const tiempoLimite = sala.quiz.configuracion?.tiempoPorPregunta || 30;
      
      // Gana puntos si es correcta, pierde 200 si es incorrecta
      const puntos = esCorrecta ? calcularPuntos(tiempoRespuesta, tiempoLimite) : -200;

      // Registrar respuesta
      const registro = {
        preguntaIdx,
        respuesta,
        esCorrecta,
        tiempoRespuesta,
        puntos,
        timestamp: Date.now()
      };

      jugador.respuestas.push(registro);
      jugador.puntos += puntos;

      if (esCorrecta) {
        jugador.respuestasCorrectas = (jugador.respuestasCorrectas || 0) + 1;
      }

      console.log(`📝 ${jugador.nombre} respondió: ${respuesta} (${esCorrecta ? '✅' : '❌'}) +${puntos}pts`);

      // Confirmar al jugador su respuesta
      socket.emit('respuesta-confirmada', {
        esCorrecta,
        respuestaCorrecta: pregunta.correcta,
        puntos,
        puntosTotal: jugador.puntos
      });

      // Verificar si todos respondieron
      const totalJugadores = sala.jugadores.filter(j => j.conectado).length;
      const respondieron = sala.jugadores.filter(j =>
        j.respuestas.find(r => r.preguntaIdx === preguntaIdx)
      ).length;

      if (respondieron >= totalJugadores) {
        // Todos respondieron, cancelar timer y mostrar resultados
        if (sala.timerPregunta) {
          clearTimeout(sala.timerPregunta);
          sala.timerPregunta = null;
        }
        mostrarResultadoPregunta(codigo, io, sala);
      }
    });

    // ----------------------------------------
    // DOCENTE: Forzar fin del tiempo y mostrar resultados
    // ----------------------------------------
    socket.on('forzar-resultados', ({ codigo }) => {
      const sala = salas[codigo];
      if (!sala || sala.estado !== 'jugando') return;

      if (sala.timerPregunta) {
        clearTimeout(sala.timerPregunta);
        sala.timerPregunta = null;
      }
      mostrarResultadoPregunta(codigo, io, sala);
    });

    // ----------------------------------------
    // DOCENTE: Avanzar manualmente a siguiente pregunta
    // ----------------------------------------
    socket.on('siguiente-pregunta', ({ codigo }) => {
      const sala = salas[codigo];
      if (!sala) return;
      enviarPregunta(codigo, io, sala);
    });

    // ----------------------------------------
    // DOCENTE: Finalizar partida manualmente
    // ----------------------------------------
    socket.on('finalizar-partida', ({ codigo }) => {
      const sala = salas[codigo];
      if (!sala) return;
      finalizarPartida(codigo, io, sala);
    });

    // ----------------------------------------
    // Desconexión de jugador
    // ----------------------------------------
    socket.on('disconnect', () => {
      const codigo = socket.salaActual;
      if (!codigo) return;

      const sala = salas[codigo];
      if (!sala) return;

      const jugador = sala.jugadores.find(j => j.id === socket.id);
      if (jugador) {
        jugador.conectado = false;
        console.log(`🔴 ${jugador.nombre} se desconectó de sala ${codigo}`);
        io.to(codigo).emit('jugador-desconectado', {
          jugadorId: socket.id,
          nombre: jugador.nombre,
          jugadores: sala.jugadores.filter(j => j.conectado)
        });
      }
    });
  });

  // ----------------------------------------
  // Función: Enviar pregunta a la sala
  // ----------------------------------------
  function enviarPregunta(codigo, io, sala) {
    sala.preguntaActual++;
    const preguntas = sala.quiz.preguntas;

    // Si ya no hay más preguntas, finalizar
    if (sala.preguntaActual >= preguntas.length) {
      mostrarResultadoPregunta(codigo, io, sala);
      setTimeout(() => finalizarPartida(codigo, io, sala), 5000);
      return;
    }

    const pregunta = preguntas[sala.preguntaActual];
    const tiempoLimite = sala.quiz.configuracion?.tiempoPorPregunta || 30;

    console.log(`❓ Pregunta ${sala.preguntaActual + 1}/${preguntas.length} en sala ${codigo}`);

    // Enviar pregunta SIN revelar la respuesta correcta
    io.to(codigo).emit('nueva-pregunta', {
      preguntaIdx: sala.preguntaActual,
      totalPreguntas: preguntas.length,
      pregunta: pregunta.pregunta,
      opciones: pregunta.opciones,
      tiempoLimite,
      categoria: pregunta.categoria || ''
    });

    // Timer para cuando se acaba el tiempo
    sala.timerPregunta = setTimeout(() => {
      mostrarResultadoPregunta(codigo, io, sala);
    }, (tiempoLimite + 1) * 1000);
  }

  // ----------------------------------------
  // Función: Mostrar resultado de una pregunta
  // ----------------------------------------
  function mostrarResultadoPregunta(codigo, io, sala) {
    const preguntaIdx = sala.preguntaActual;
    const preguntas = sala.quiz.preguntas;

    if (preguntaIdx >= preguntas.length) return;

    const pregunta = preguntas[preguntaIdx];

    // Calcular estadísticas de la pregunta
    const respuestas = sala.jugadores.map(j => {
      const r = j.respuestas.find(r => r.preguntaIdx === preguntaIdx);
      return r ? r.respuesta : null;
    }).filter(Boolean);

    const totalRespondieron = respuestas.length;
    const acertaron = respuestas.filter(r => r === pregunta.correcta).length;
    const porcentajeAcierto = totalRespondieron > 0
      ? Math.round((acertaron / sala.jugadores.length) * 100)
      : 0;

    // Top 3 más rápidos que acertaron en esta pregunta
    const top3Rapidos = sala.jugadores
      .filter(j => j.respuestas.find(r => r.preguntaIdx === preguntaIdx && r.esCorrecta))
      .sort((a, b) => {
        const ra = a.respuestas.find(r => r.preguntaIdx === preguntaIdx);
        const rb = b.respuestas.find(r => r.preguntaIdx === preguntaIdx);
        return ra.tiempoRespuesta - rb.tiempoRespuesta;
      })
      .slice(0, 3)
      .map(j => {
        const r = j.respuestas.find(r => r.preguntaIdx === preguntaIdx);
        return { nombre: j.nombre, avatar: j.avatar, tiempo: r.tiempoRespuesta, puntos: r.puntos };
      });

    // Ranking actualizado
    const ranking = [...sala.jugadores]
      .sort((a, b) => b.puntos - a.puntos)
      .map((j, idx) => ({
        posicion: idx + 1,
        nombre: j.nombre,
        avatar: j.avatar,
        puntos: j.puntos
      }));

    io.to(codigo).emit('resultado-pregunta', {
      respuestaCorrecta: pregunta.correcta,
      retroalimentacion: pregunta.retroalimentacion,
      porcentajeAcierto,
      top3Rapidos,
      ranking
    });
  }

  // ----------------------------------------
  // Función: Finalizar partida completa
  // ----------------------------------------
  async function finalizarPartida(codigo, io, sala) {
    sala.estado = 'finalizado';

    const podio = [...sala.jugadores]
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 3)
      .map((j, idx) => ({
        posicion: idx + 1,
        nombre: j.nombre,
        avatar: j.avatar,
        puntos: j.puntos
      }));

    const rankingFinal = [...sala.jugadores]
      .sort((a, b) => b.puntos - a.puntos)
      .map((j, idx) => ({ posicion: idx + 1, ...j }));

    // Formatear jugadores para Mongoose
    const jugadoresParaBD = sala.jugadores.map(j => ({
      id: j.id,
      nombre: j.nombre,
      avatar: j.avatar,
      puntos: j.puntos,
      respuestasCorrectas: j.respuestasCorrectas || 0,
      estado: j.conectado ? 'activo' : 'desconectado'
    }));

    // Guardar partida en la base de datos MongoDB
    try {
      const registroPartida = new Game({
        id: sala.id,
        pin: codigo,
        quizId: sala.quizId,
        docenteId: sala.docenteId,
        jugadores: jugadoresParaBD,
        estado: 'terminado',
        iniciadoEn: sala.creadaEn,
        finalizadoEn: new Date()
      });

      await registroPartida.save();
      console.log(`🏆 Partida finalizada en sala ${codigo}. Ganador: ${podio[0]?.nombre}`);
    } catch (error) {
      console.error('Error guardando historial de partida:', error);
    }

    io.to(codigo).emit('partida-finalizada', { podio, rankingFinal });

    // Limpiar sala de memoria después de 10 min
    setTimeout(() => { delete salas[codigo]; }, 600000);
  }
};
