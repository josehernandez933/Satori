// =============================================
// SATORI - Crear/Editar Cuestionario
// CRUD completo de preguntas con estructura a/b/c/d
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { quizzesAPI, questionsAPI } from '../services/api';

// Pregunta vacía con estructura a/b/c/d
const PREGUNTA_VACIA = {
  pregunta: '',
  opciones: { a: '', b: '', c: '', d: '' },
  correcta: 'a',
  retroalimentacion: '',
  categoria: ''
};

const COLORES_OPCION = { a: '#7c3aed', b: '#0891b2', c: '#059669', d: '#dc2626' };

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe, es edición
  const { usuario } = useAuth();
  const esEdicion = Boolean(id);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [config, setConfig] = useState({
    tiempoPorPregunta: 30,
    mostrarRanking: true,
    sonidos: true,
  });
  const [preguntaEditando, setPreguntaEditando] = useState(null); // índice o null
  const [preguntaTemp, setPreguntaTemp] = useState({ ...PREGUNTA_VACIA });
  const [cargando, setCargando] = useState(false);
  const [bancoVisible, setBancoVisible] = useState(false);
  const [bancoPreguntasDisp, setBancoPreguntasDisp] = useState([]);

  // Si es edición, cargar datos del quiz
  useEffect(() => {
    if (esEdicion) {
      quizzesAPI.getById(id).then(quiz => {
        setTitulo(quiz.titulo);
        setDescripcion(quiz.descripcion || '');
        setPreguntas(quiz.preguntas || []);
        setConfig(quiz.configuracion || config);
      }).catch(() => toast.error('Error al cargar el cuestionario'));
    }
  }, [id]);

  // Cargar banco de preguntas
  const cargarBanco = async () => {
    try {
      const data = await questionsAPI.getAll();
      setBancoPreguntasDisp(data);
      setBancoVisible(true);
    } catch {
      toast.error('Error al cargar el banco');
    }
  };

  // Agregar pregunta del banco al cuestionario
  const agregarDelBanco = (pregunta) => {
    const yaExiste = preguntas.find(p => p.pregunta === pregunta.pregunta);
    if (yaExiste) { toast.error('Esta pregunta ya está en el cuestionario'); return; }
    setPreguntas(prev => [...prev, {
      pregunta: pregunta.pregunta,
      opciones: pregunta.opciones,
      correcta: pregunta.correcta,
      retroalimentacion: pregunta.retroalimentacion,
      categoria: pregunta.categoria
    }]);
    toast.success('Pregunta agregada ✅');
  };

  // Abrir editor de nueva pregunta
  const nuevaPregunta = () => {
    setPreguntaTemp({ ...PREGUNTA_VACIA });
    setPreguntaEditando('nueva');
  };

  // Abrir editor de pregunta existente
  const editarPregunta = (idx) => {
    setPreguntaTemp({ ...preguntas[idx] });
    setPreguntaEditando(idx);
  };

  // Guardar pregunta editada/nueva
  const guardarPregunta = () => {
    const { pregunta, opciones, correcta } = preguntaTemp;
    if (!pregunta.trim()) return toast.error('Escribe el enunciado de la pregunta');
    if (!opciones.a || !opciones.b || !opciones.c || !opciones.d)
      return toast.error('Completa las 4 opciones (A, B, C, D)');

    if (preguntaEditando === 'nueva') {
      setPreguntas(prev => [...prev, { ...preguntaTemp }]);
    } else {
      setPreguntas(prev => prev.map((p, i) => i === preguntaEditando ? { ...preguntaTemp } : p));
    }
    setPreguntaEditando(null);
    toast.success(preguntaEditando === 'nueva' ? 'Pregunta agregada ✅' : 'Pregunta actualizada ✅');
  };

  const eliminarPregunta = (idx) => {
    setPreguntas(prev => prev.filter((_, i) => i !== idx));
    toast.success('Pregunta eliminada');
  };

  const moverPregunta = (idx, dir) => {
    const nuevas = [...preguntas];
    const destino = idx + dir;
    if (destino < 0 || destino >= nuevas.length) return;
    [nuevas[idx], nuevas[destino]] = [nuevas[destino], nuevas[idx]];
    setPreguntas(nuevas);
  };

  // Guardar cuestionario completo
  const guardarQuiz = async () => {
    if (!titulo.trim()) return toast.error('El título es obligatorio');
    if (preguntas.length === 0) return toast.error('Agrega al menos una pregunta');
    setCargando(true);
    try {
      const payload = { titulo, descripcion, docenteId: usuario._id, preguntas, configuracion: config };
      if (esEdicion) {
        await quizzesAPI.update(id, payload);
        toast.success('Cuestionario actualizado ✅');
      } else {
        await quizzesAPI.create(payload);
        toast.success('Cuestionario guardado ✅');
      }
      navigate('/dashboard');
    } catch {
      toast.error('Error al guardar el cuestionario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="glass border-b border-purple-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline text-sm px-3 py-1.5">
            ← Volver
          </button>
          <h1 className="font-display font-bold text-lg gradient-text">
            {esEdicion ? '✏️ Editar Cuestionario' : '➕ Nuevo Cuestionario'}
          </h1>
        </div>
        <button onClick={guardarQuiz} disabled={cargando} className="btn btn-primary text-sm">
          {cargando ? '💾 Guardando...' : '💾 Guardar'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── Info básica ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h2 className="font-display font-semibold text-purple-300 text-sm mb-4">INFORMACIÓN BÁSICA</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Título del cuestionario *</label>
              <input value={titulo} onChange={e => setTitulo(e.target.value)}
                placeholder="Ej: Fundamentos de Redes - Módulo 1"
                className="input text-base font-semibold" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Descripción (opcional)</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}
                placeholder="Describe el contenido del cuestionario..."
                className="input resize-none h-20 text-sm" />
            </div>
          </div>
        </motion.div>

        {/* ── Configuración ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h2 className="font-display font-semibold text-purple-300 text-sm mb-4">⚙️ CONFIGURACIÓN</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">⏱ Tiempo por pregunta</label>
              <select value={config.tiempoPorPregunta}
                onChange={e => setConfig(p => ({ ...p, tiempoPorPregunta: Number(e.target.value) }))}
                className="input">
                {[10, 15, 20, 30, 45, 60, 90].map(t => (
                  <option key={t} value={t}>{t} segundos</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="ranking" checked={config.mostrarRanking}
                onChange={e => setConfig(p => ({ ...p, mostrarRanking: e.target.checked }))}
                className="w-4 h-4 accent-purple-500" />
              <label htmlFor="ranking" className="text-gray-300 text-sm cursor-pointer">🏆 Mostrar Ranking</label>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="sonidos" checked={config.sonidos}
                onChange={e => setConfig(p => ({ ...p, sonidos: e.target.checked }))}
                className="w-4 h-4 accent-purple-500" />
              <label htmlFor="sonidos" className="text-gray-300 text-sm cursor-pointer">🔊 Sonidos</label>
            </div>
          </div>
        </motion.div>

        {/* ── Preguntas ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-purple-300 text-sm">
              ❓ PREGUNTAS ({preguntas.length})
            </h2>
            <div className="flex gap-2">
              <button onClick={cargarBanco} className="btn btn-outline text-xs px-3 py-1.5">
                🗃️ Del banco
              </button>
              <button onClick={nuevaPregunta} className="btn btn-primary text-xs px-3 py-1.5">
                ➕ Nueva
              </button>
            </div>
          </div>

          {preguntas.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <div className="text-4xl mb-3">❓</div>
              <p className="text-sm">Agrega preguntas desde el banco o crea las tuyas</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {preguntas.map((p, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="font-display text-purple-400 font-bold w-6 text-center flex-shrink-0">{idx + 1}</span>
                  <span className="flex-1 text-sm text-gray-300 truncate">{p.pregunta}</span>
                  {p.categoria && <span className="badge badge-purple text-xs flex-shrink-0">{p.categoria}</span>}
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => moverPregunta(idx, -1)} disabled={idx === 0}
                      className="w-6 h-6 rounded text-gray-400 hover:text-white disabled:opacity-30 text-xs">↑</button>
                    <button onClick={() => moverPregunta(idx, 1)} disabled={idx === preguntas.length - 1}
                      className="w-6 h-6 rounded text-gray-400 hover:text-white disabled:opacity-30 text-xs">↓</button>
                    <button onClick={() => editarPregunta(idx)}
                      className="w-6 h-6 rounded text-cyan-400 hover:text-cyan-300 text-xs">✏️</button>
                    <button onClick={() => eliminarPregunta(idx)}
                      className="w-6 h-6 rounded text-red-400 hover:text-red-300 text-xs">🗑️</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Modal Editor de Pregunta ── */}
      <AnimatePresence>
        {preguntaEditando !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            >
              <h3 className="font-display font-bold text-lg gradient-text mb-5">
                {preguntaEditando === 'nueva' ? 'Nueva Pregunta' : 'Editar Pregunta'}
              </h3>

              <div className="flex flex-col gap-4">
                {/* Enunciado */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Enunciado de la pregunta *</label>
                  <textarea
                    value={preguntaTemp.pregunta}
                    onChange={e => setPreguntaTemp(p => ({ ...p, pregunta: e.target.value }))}
                    placeholder="¿Cuántas capas tiene el modelo OSI?"
                    className="input resize-none h-20"
                  />
                </div>

                {/* Opciones A/B/C/D */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Opciones de respuesta *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['a', 'b', 'c', 'd'].map(letra => (
                      <div key={letra} className="relative">
                        <div
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white z-10"
                          style={{ background: COLORES_OPCION[letra] }}
                        >{letra.toUpperCase()}</div>
                        <input
                          value={preguntaTemp.opciones[letra]}
                          onChange={e => setPreguntaTemp(p => ({
                            ...p,
                            opciones: { ...p.opciones, [letra]: e.target.value }
                          }))}
                          placeholder={`Opción ${letra.toUpperCase()}`}
                          className="input pl-12"
                          style={preguntaTemp.correcta === letra
                            ? { borderColor: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.3)' }
                            : {}}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Respuesta correcta */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Respuesta correcta *</label>
                  <div className="flex gap-2">
                    {['a', 'b', 'c', 'd'].map(letra => (
                      <button
                        key={letra}
                        type="button"
                        onClick={() => setPreguntaTemp(p => ({ ...p, correcta: letra }))}
                        className={`flex-1 py-2.5 rounded-xl font-display font-bold text-base transition-all ${preguntaTemp.correcta === letra
                            ? 'text-white scale-105'
                            : 'text-gray-400 opacity-50 hover:opacity-75'
                          }`}
                        style={{
                          background: preguntaTemp.correcta === letra ? COLORES_OPCION[letra] : 'rgba(255,255,255,0.07)',
                          boxShadow: preguntaTemp.correcta === letra ? `0 0 15px ${COLORES_OPCION[letra]}66` : 'none'
                        }}
                      >
                        {letra.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Retroalimentación */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Retroalimentación (opcional)</label>
                  <input
                    value={preguntaTemp.retroalimentacion}
                    onChange={e => setPreguntaTemp(p => ({ ...p, retroalimentacion: e.target.value }))}
                    placeholder="Explicación de la respuesta correcta..."
                    className="input"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Categoría (opcional)</label>
                  <input
                    value={preguntaTemp.categoria}
                    onChange={e => setPreguntaTemp(p => ({ ...p, categoria: e.target.value }))}
                    placeholder="Ej: Modelo OSI, TCP/IP, Seguridad..."
                    className="input"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setPreguntaEditando(null)} className="btn btn-outline flex-1">
                  Cancelar
                </button>
                <button onClick={guardarPregunta} className="btn btn-primary flex-1">
                  ✅ Guardar Pregunta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Banco de Preguntas ── */}
      <AnimatePresence>
        {bancoVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="card w-full max-w-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                <h3 className="font-display font-bold gradient-text">🗃️ Banco de Preguntas</h3>
                <button onClick={() => setBancoVisible(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
                {bancoPreguntasDisp.map((p, i) => (
                  <div key={i}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-purple-500/10"
                    style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">{p.pregunta}</p>
                      {p.categoria && <span className="badge badge-purple text-xs mt-1">{p.categoria}</span>}
                    </div>
                    <button onClick={() => agregarDelBanco(p)} className="btn btn-primary text-xs px-3 py-1.5 flex-shrink-0">
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
