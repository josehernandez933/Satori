// =============================================
// SATORI - Servicio API
// Comunicación con el backend Express
// =============================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_BASE = `${BACKEND_URL}/api`;

// Helper para hacer peticiones
async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la petición');
  return data;
}

// --- AUTH ---
export const authAPI = {
  login:    (email, password)    => request('/auth/login',    { method: 'POST', body: { email, password } }),
  register: (nombre, email, password, rol) => request('/auth/register', { method: 'POST', body: { nombre, email, password, rol } }),
};

// --- CUESTIONARIOS ---
export const quizzesAPI = {
  getAll:  (docenteId)  => request(`/quizzes?docenteId=${docenteId}`),
  getById: (id)         => request(`/quizzes/${id}`),
  create:  (data)       => request('/quizzes',      { method: 'POST',   body: data }),
  update:  (id, data)   => request(`/quizzes/${id}`, { method: 'PUT',    body: data }),
  delete:  (id)         => request(`/quizzes/${id}`, { method: 'DELETE' }),
};

// --- PREGUNTAS ---
export const questionsAPI = {
  getAll:  (categoria) => request(`/questions${categoria ? `?categoria=${categoria}` : ''}`),
  create:  (data)      => request('/questions',      { method: 'POST',   body: data }),
  update:  (id, data)  => request(`/questions/${id}`, { method: 'PUT',    body: data }),
  delete:  (id)        => request(`/questions/${id}`, { method: 'DELETE' }),
};

// --- PARTIDAS ---
export const gamesAPI = {
  getAll: (docenteId) => request(`/games?docenteId=${docenteId}`),
  getById: (id)       => request(`/games/${id}`),
  delete: (id)        => request(`/games/${id}`, { method: 'DELETE' }),
};
