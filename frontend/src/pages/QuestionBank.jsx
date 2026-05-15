// =============================================
// SATORI - Banco de Preguntas
// Gestión del banco global con CRUD
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { questionsAPI } from '../services/api';

const PREGUNTA_VACIA = {
  pregunta: '', opciones: { a: '', b: '', c: '', d: '' },
  correcta: 'a', retroalimentacion: '', categoria: ''
};
const COLORES = { a: '#7c3aed', b: '#0891b2', c: '#059669', d: '#dc2626' };
const CATEGORIAS = ['Todas', 'Modelo OSI', 'TCP/IP', 'Protocolos', 'Direccionamiento IP', 'Dispositivos de Red', 'Seguridad de Redes', 'Topologías de Red', 'Conceptos Generales', 'Personalizada'];

export default function QuestionBank() {
  const navigate = useNavigate();
  const [preguntas, setPreguntas]     = useState([]);
  const [filtro, setFiltro]           = useState('Todas');
  const [busqueda, setBusqueda]       = useState('');
  const [cargando, setCargando]       = useState(true);
  const [modalEditar, setModalEditar] = useState(null); // null | 'nueva' | id
  const [form, setForm]               = useState({ ...PREGUNTA_VACIA });

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await questionsAPI.getAll();
      setPreguntas(data);
    } catch { toast.error('Error al cargar preguntas'); }
    finally { setCargando(false); }
  };

  const preguntasFiltradas = preguntas.filter(p => {
    const matchCat = filtro === 'Todas' || p.categoria === filtro;
    const matchBus = p.pregunta.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchBus;
  });

  const abrirNueva = () => {
    setForm({ ...PREGUNTA_VACIA });
    setModalEditar('nueva');
  };

  const abrirEditar = (p) => {
    setForm({ ...p });
    setModalEditar(p.id);
  };

  const guardar = async () => {
    if (!form.pregunta.trim()) return toast.error('Escribe el enunciado');
    if (!form.opciones.a || !form.opciones.b || !form.opciones.c || !form.opciones.d)
      return toast.error('Completa las 4 opciones');
    try {
      if (modalEditar === 'nueva') {
        const nueva = await questionsAPI.create(form);
        setPreguntas(prev => [...prev, nueva]);
        toast.success('Pregunta creada ✅');
      } else {
        const actualizada = await questionsAPI.update(modalEditar, form);
        setPreguntas(prev => prev.map(p => p.id === modalEditar ? actualizada : p));
        toast.success('Pregunta actualizada ✅');
      }
      setModalEditar(null);
    } catch (e) { toast.error(e.message || 'Error al guardar'); }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    try {
      await questionsAPI.delete(id);
      setPreguntas(prev => prev.filter(p => p.id !== id));
      toast.success('Pregunta eliminada');
    } catch (e) { toast.error(e.message || 'No se puede eliminar una pregunta predeterminada'); }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <div className="glass border-b border-purple-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline text-sm px-3 py-1.5">← Volver</button>
          <h1 className="font-display font-bold text-lg gradient-text">🗃️ Banco de Preguntas</h1>
        </div>
        <button onClick={abrirNueva} className="btn btn-primary text-sm">➕ Nueva Pregunta</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', valor: preguntas.length, color: '#a855f7' },
            { label: 'Predeterminadas', valor: preguntas.filter(p => !p.esPersonalizada).length, color: '#06b6d4' },
            { label: 'Personalizadas', valor: preguntas.filter(p => p.esPersonalizada).length, color: '#10b981' },
            { label: 'Categorías', valor: new Set(preguntas.map(p => p.categoria)).size, color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="card p-3 text-center">
              <div className="font-display font-bold text-xl" style={{ color: s.color }}>{s.valor}</div>
              <div className="text-gray-400 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar pregunta..."
            className="input flex-1" />
          <select value={filtro} onChange={e => setFiltro(e.target.value)} className="input sm:w-56">
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Lista */}
        {cargando ? (
          <div className="text-center py-16 text-gray-500">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            Cargando banco...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-gray-500 text-sm">{preguntasFiltradas.length} preguntas encontradas</p>
            {preguntasFiltradas.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-4 flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {p.categoria && <span className="badge badge-purple text-xs">{p.categoria}</span>}
                    {p.esPersonalizada && <span className="badge badge-green text-xs">Personalizada</span>}
                  </div>
                  <p className="text-gray-200 text-sm font-medium">{p.pregunta}</p>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {['a','b','c','d'].map(l => (
                      <div key={l} className="flex items-center gap-1.5 text-xs">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-white font-bold flex-shrink-0 text-xs"
                          style={{ background: p.correcta === l ? '#10b981' : COLORES[l], opacity: p.correcta === l ? 1 : 0.6 }}>
                          {l.toUpperCase()}
                        </span>
                        <span className={p.correcta === l ? 'text-green-400 font-semibold' : 'text-gray-400'}>
                          {p.opciones[l]}
                        </span>
                      </div>
                    ))}
                  </div>
                  {p.retroalimentacion && (
                    <p className="text-cyan-400/70 text-xs mt-2 italic">💡 {p.retroalimentacion}</p>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 justify-end">
                  <button onClick={() => abrirEditar(p)} className="btn btn-outline text-xs px-3 py-1.5">✏️ Editar</button>
                  {p.esPersonalizada && (
                    <button onClick={() => eliminar(p.id)} className="btn btn-danger text-xs px-3 py-1.5">🗑️ Eliminar</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      <AnimatePresence>
        {modalEditar !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
              <h3 className="font-display font-bold text-lg gradient-text mb-5">
                {modalEditar === 'nueva' ? '➕ Nueva Pregunta' : '✏️ Editar Pregunta'}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Enunciado *</label>
                  <textarea value={form.pregunta}
                    onChange={e => setForm(p => ({ ...p, pregunta: e.target.value }))}
                    className="input resize-none h-20" placeholder="¿Cuál es...?" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Opciones A/B/C/D *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['a','b','c','d'].map(l => (
                      <div key={l} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center font-bold text-white text-xs"
                          style={{ background: COLORES[l] }}>{l.toUpperCase()}</div>
                        <input value={form.opciones[l]}
                          onChange={e => setForm(p => ({ ...p, opciones: { ...p.opciones, [l]: e.target.value } }))}
                          placeholder={`Opción ${l.toUpperCase()}`} className="input pl-11 text-sm"
                          style={form.correcta === l ? { borderColor: '#10b981' } : {}} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Respuesta correcta *</label>
                  <div className="flex gap-2">
                    {['a','b','c','d'].map(l => (
                      <button key={l} type="button"
                        onClick={() => setForm(p => ({ ...p, correcta: l }))}
                        className="flex-1 py-2 rounded-lg font-display font-bold transition-all"
                        style={{
                          background: form.correcta === l ? COLORES[l] : 'rgba(255,255,255,0.07)',
                          color: form.correcta === l ? 'white' : '#9ca3af',
                          boxShadow: form.correcta === l ? `0 0 12px ${COLORES[l]}66` : 'none'
                        }}>
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Retroalimentación</label>
                  <input value={form.retroalimentacion}
                    onChange={e => setForm(p => ({ ...p, retroalimentacion: e.target.value }))}
                    className="input text-sm" placeholder="Explicación de la respuesta..." />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Categoría</label>
                  <select value={form.categoria}
                    onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}
                    className="input text-sm">
                    {CATEGORIAS.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setModalEditar(null)} className="btn btn-outline flex-1">Cancelar</button>
                <button onClick={guardar} className="btn btn-primary flex-1">✅ Guardar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
