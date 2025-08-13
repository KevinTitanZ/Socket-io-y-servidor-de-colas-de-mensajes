// server.js
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// ---- Estado del juego en el servidor ----
let preguntaActual = null;
let respuestaCorrectaActual = null; // en minúsculas y sin espacios
let rondaActiva = false;

// Mapa para saber quién es quién
const usuarios = new Map(); // socket.id -> nombre

io.on('connection', (socket) => {
  // Registro del usuario con su nombre
  socket.on('usuario:conectado', (nombre) => {
    const limpio = String(nombre || 'Anónimo').trim();
    usuarios.set(socket.id, limpio);

    // Al conectarse alguien nuevo, le mandamos el estado actual
    socket.emit('estado:sync', {
      pregunta: preguntaActual,
      rondaActiva,
    });
  });

  // Solo el docente debe poder publicar la pregunta
  socket.on('pregunta:nueva', (payload) => {
    const nombre = (usuarios.get(socket.id) || '').toLowerCase();
    if (nombre !== 'docente') return; // seguridad simple

    const { pregunta, respuesta } = payload || {};
    if (!pregunta || !respuesta) return;

    preguntaActual = String(pregunta).trim();
    respuestaCorrectaActual = String(respuesta).trim().toLowerCase();
    rondaActiva = true;

    // Publicar la pregunta (sin la respuesta) a todos
    io.emit('pregunta:publicada', preguntaActual);
  });

  // Respuesta de un estudiante
  socket.on('respuesta:enviada', (respuesta) => {
    if (!rondaActiva) return;
    const resp = String(respuesta || '').trim().toLowerCase();
    if (!resp) return;

    if (resp === respuestaCorrectaActual) {
      rondaActiva = false;
      const ganador = usuarios.get(socket.id) || 'Anónimo';
      io.emit('ronda:terminada', { ganador });
    }
  });

  // Reiniciar ronda (solo docente)
  socket.on('ronda:reiniciar', () => {
    const nombre = (usuarios.get(socket.id) || '').toLowerCase();
    if (nombre !== 'docente') return;

    preguntaActual = null;
    respuestaCorrectaActual = null;
    rondaActiva = false;
    io.emit('ronda:reiniciada');
  });

  socket.on('disconnect', () => {
    usuarios.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor listo: http://localhost:${PORT}`);
});
