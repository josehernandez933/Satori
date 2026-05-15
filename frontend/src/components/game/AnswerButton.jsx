// =============================================
// SATORI - Botones de Respuesta A/B/C/D
// Con colores neon, animaciones y estados
// =============================================

const LETRAS = {
  a: { label: 'A', clase: 'answer-a', emoji: '🔷' },
  b: { label: 'B', clase: 'answer-b', emoji: '🔵' },
  c: { label: 'C', clase: 'answer-c', emoji: '🟢' },
  d: { label: 'D', clase: 'answer-d', emoji: '🔴' },
};

export default function AnswerButton({
  letra,           // 'a' | 'b' | 'c' | 'd'
  texto,           // Texto de la opción
  onClick,
  seleccionada,    // Esta fue la elegida por el jugador
  correcta,        // Esta es la correcta (post-respuesta)
  incorrecta,      // Esta fue incorrecta (atenuar)
  deshabilitada,   // Tiempo agotado o ya respondió
  mostrarResultado // Si mostrar colores de resultado
}) {
  const config = LETRAS[letra];

  // Determinar clase de estado
  let claseEstado = config.clase;
  if (mostrarResultado) {
    if (correcta) claseEstado = 'answer-correct';
    else if (seleccionada && !correcta) claseEstado = 'answer-wrong';
    else claseEstado += ' answer-wrong';
  } else if (seleccionada) {
    claseEstado += ' answer-selected';
  }

  return (
    <button
      className={`answer-btn ${claseEstado}`}
      onClick={() => !deshabilitada && onClick?.(letra)}
      disabled={deshabilitada}
      style={{
        animationDelay: `${['a', 'b', 'c', 'd'].indexOf(letra) * 0.1}s`,
        animation: !mostrarResultado ? 'slide-in-up 0.4s ease forwards' : 'none'
      }}
    >
      {/* Badge de letra */}
      <span
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-base"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        {config.label}
      </span>

      {/* Texto de la opción */}
      <span className="flex-1 text-left leading-snug">{texto}</span>

      {/* Icono de resultado */}
      {mostrarResultado && (
        <span className="flex-shrink-0 text-xl">
          {correcta ? '✅' : seleccionada ? '❌' : ''}
        </span>
      )}

      {/* Checkmark si seleccionada */}
      {!mostrarResultado && seleccionada && (
        <span className="flex-shrink-0 text-yellow-300 text-xl">✓</span>
      )}
    </button>
  );
}
