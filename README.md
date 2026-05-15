// =============================================
// SATORI - README de Instalación y Uso
// =============================================

# SATORI — Plataforma Educativa Interactiva

> Sistema de quizzes en tiempo real estilo Kahoot con estética futurista japonesa/anime.
> Diseñado para educación tecnológica y cursos de redes.

---

## 🚀 Requisitos

- Node.js v24+ (ubicado en `Desktop/node-v24.15.0-win-x64/node-v24.15.0-win-x64/`)
- npm 11+

---

## ⚙️ Instalación y Arranque

### 1. Terminal 1 — Backend

```powershell
# Ir al backend
cd C:\Users\Biblioteca01\Desktop\satori\backend

# Agregar Node al PATH de la sesión
$env:PATH = "C:\Users\Biblioteca01\Desktop\node-v24.15.0-win-x64\node-v24.15.0-win-x64;$env:PATH"

# Iniciar servidor
& "C:\Users\Biblioteca01\Desktop\node-v24.15.0-win-x64\node-v24.15.0-win-x64\node.exe" src/app.js
```

El servidor arranca en: **http://localhost:3001**

### 2. Terminal 2 — Frontend

```powershell
# Ir al frontend
cd C:\Users\Biblioteca01\Desktop\satori\frontend

# Agregar Node al PATH
$env:PATH = "C:\Users\Biblioteca01\Desktop\node-v24.15.0-win-x64\node-v24.15.0-win-x64;$env:PATH"

# Iniciar Vite
& "C:\Users\Biblioteca01\Desktop\node-v24.15.0-win-x64\node-v24.15.0-win-x64\npm.cmd" run dev
```

El frontend arranca en: **http://localhost:5173**

---

## 📁 Estructura del Proyecto

```
satori/
├── backend/
│   ├── src/
│   │   ├── app.js              ← Servidor principal
│   │   ├── routes/
│   │   │   ├── auth.js         ← Login/Registro
│   │   │   ├── quizzes.js      ← CRUD cuestionarios
│   │   │   ├── games.js        ← Historial
│   │   │   └── questions.js    ← Banco de preguntas
│   │   ├── sockets/
│   │   │   └── gameSocket.js   ← Lógica en tiempo real
│   │   └── data/
│   │       └── networkQuestions.js ← 35 preguntas de redes
│   ├── db.json                 ← Base de datos (se crea automáticamente)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/              ← 12 vistas
    │   ├── components/         ← Componentes reutilizables
    │   ├── context/            ← Auth + Game context
    │   ├── hooks/              ← useSocket, useTimer, useSound
    │   └── services/           ← API calls
    └── package.json
```

---

## 🎮 Flujo de Uso

### Como Docente:
1. Registrarse como **Docente** en `/registro`
2. Crear un cuestionario en el **Dashboard**
3. Agregar preguntas (del banco o propias)
4. Presionar **▶ Iniciar** → Se genera código + QR
5. Compartir código/QR con estudiantes
6. En Sala de Espera: esperar jugadores y presionar **Iniciar Partida**
7. Controlar el flujo con botón **Siguiente**

### Como Estudiante:
1. Ir a `/unirse` o escanear el QR
2. Ingresar el código de sala
3. Elegir nombre y avatar
4. Esperar en la sala y responder preguntas
5. Ver el podio final

---

## 🗃️ Base de Datos (db.json)

Se crea automáticamente al iniciar el backend. Contiene:
- `users` — Usuarios registrados
- `quizzes` — Cuestionarios creados
- `questions` — Banco de preguntas (35 predeterminadas + personalizadas)
- `games` — Historial de partidas

> **Backup**: Copia el archivo `backend/db.json` para guardar todos los datos.

---

## 🌐 Publicar en Internet (Railway/Render)

### Backend en Railway:
1. Subir carpeta `backend/` a GitHub
2. Conectar en railway.app
3. Variable: `PORT=3001`

### Frontend en Netlify/Vercel:
1. Cambiar en `src/hooks/useSocket.js`:
   ```js
   socketInstance = io('https://tu-backend.railway.app', ...)
   ```
2. Cambiar en `src/services/api.js`:
   ```js
   const API_BASE = 'https://tu-backend.railway.app/api'
   ```

---

## 🎨 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite + TailwindCSS v4 |
| Animaciones | Framer Motion |
| Tiempo real | Socket.io |
| Backend | Node.js + Express |
| Base de datos | LowDB (archivo JSON) |
| QR | qrcode.react |
| Confetti | canvas-confetti |
| Sonidos | Web Audio API |

---

## ❓ Banco de Preguntas — Categorías

- **Modelo OSI** (5 preguntas)
- **TCP/IP** (5 preguntas)
- **Protocolos** (6 preguntas)
- **Direccionamiento IP** (5 preguntas)
- **Dispositivos de Red** (4 preguntas)
- **Seguridad de Redes** (4 preguntas)
- **Topologías de Red** (3 preguntas)
- **Conceptos Generales** (3 preguntas)

**Total: 35 preguntas predeterminadas**

---

*SATORI © 2025 — Plataforma Educativa Interactiva*
