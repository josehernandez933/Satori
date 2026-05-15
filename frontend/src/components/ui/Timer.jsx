// =============================================
// SATORI - Componente Timer Circular
// SVG animado con cuenta regresiva visual
// =============================================

export default function Timer({ tiempoRestante, duracion, size = 120 }) {
  const radio       = 42;
  const circunf     = 2 * Math.PI * radio; // ≈ 264
  const porcentaje  = Math.max(0, tiempoRestante / duracion);
  const dashOffset  = circunf * (1 - porcentaje);

  // Color dinámico: verde → amarillo → rojo
  const color = porcentaje > 0.5
    ? '#10b981'
    : porcentaje > 0.25
      ? '#f59e0b'
      : '#ef4444';

  const urgente = tiempoRestante <= 5;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Anillo SVG */}
      <svg width={size} height={size} viewBox="0 0 100 100" className="timer-ring">
        {/* Fondo */}
        <circle cx="50" cy="50" r={radio} className="timer-ring-bg" strokeWidth="8" />
        {/* Progreso */}
        <circle
          cx="50" cy="50" r={radio}
          className="timer-ring-progress"
          strokeWidth="8"
          stroke={color}
          strokeDasharray={circunf}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
            transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease'
          }}
        />
      </svg>

      {/* Número central */}
      <div
        className="absolute font-display font-bold flex items-center justify-center"
        style={{
          fontSize: size * 0.28,
          color,
          textShadow: `0 0 10px ${color}`,
          animation: urgente ? 'bounce 0.5s ease infinite alternate' : 'none'
        }}
      >
        {tiempoRestante}
      </div>

      {/* Pulso urgente */}
      {urgente && (
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ border: `2px solid ${color}`, opacity: 0.4 }}
        />
      )}
    </div>
  );
}
