// public/client.js

// Conexión con el servidor de sockets
const socket = io();

// -------------------------
//        DOM Refs
// -------------------------
const yo = document.getElementById('yo');
const panelDocente = document.getElementById('panel-docente');
const formDocente = document.getElementById('form-docente');
const docPregunta = document.getElementById('doc-pregunta');
const docRespuesta = document.getElementById('doc-respuesta');
const btnReiniciar = document.getElementById('btn-reiniciar');

const preguntaBox = document.getElementById('pregunta');
const estadoBox = document.getElementById('estado');

const panelEstudiante = document.getElementById('panel-estudiante');
const formRespuesta = document.getElementById('form-respuesta');
const miRespuesta = document.getElementById('mi-respuesta');
const btnEnviar = document.getElementById('btn-enviar');

const panelGanador = document.getElementById('panel-ganador');
const ganadorMsg = document.getElementById('ganador-msg');

const btnLogout = document.getElementById('btn-logout');

// -------------------------
//   Nombre desde el login
// -------------------------
let nombre = localStorage.getItem('quiz_nombre');
if (!nombre || !nombre.trim()) {
  // Si no hay nombre guardado, redirige al login
  window.location.href = '/login.html';
}
nombre = nombre.trim();

// Mostrar nombre en UI
yo.textContent = `Conectado como: ${nombre}`;

// ¿Es docente?
const esDocente = nombre.toLowerCase() === 'docente';
if (esDocente) {
  panelDocente.classList.remove('oculto');
} else {
  panelDocente.classList.add('oculto');
}

// Informar al servidor quién soy
socket.emit('usuario:conectado', nombre);

// -------------------------
//       Helpers de UI
// -------------------------
function activarRondaUI(estaActiva) {
  if (estaActiva) {
    estadoBox.textContent = 'Ronda activa: ¡responde rápido!';
    miRespuesta.disabled = false;
    btnEnviar.disabled = false;
    panelGanador.classList.add('oculto');
    ganadorMsg.textContent = '';
  } else {
    estadoBox.textContent = 'Ronda inactiva';
    miRespuesta.disabled = true;
    btnEnviar.disabled = true;
  }
}

function limpiarRespuestaLocal() {
  miRespuesta.value = '';
}

// -------------------------
//   Eventos desde servidor
// -------------------------
socket.on('estado:sync', ({ pregunta, rondaActiva }) => {
  if (pregunta) {
    preguntaBox.textContent = pregunta;
  } else {
    preguntaBox.textContent = 'Aún no hay pregunta publicada';
  }
  activarRondaUI(!!rondaActiva);
});

socket.on('pregunta:publicada', (pregunta) => {
  preguntaBox.textContent = pregunta;
  panelGanador.classList.add('oculto');
  ganadorMsg.textContent = '';
  activarRondaUI(true);
  limpiarRespuestaLocal();
});

socket.on('ronda:terminada', ({ ganador }) => {
  activarRondaUI(false);
  panelGanador.classList.remove('oculto');
  ganadorMsg.textContent = `¡${ganador} ha ganado la ronda! 🎉`;
});

socket.on('ronda:reiniciada', () => {
  preguntaBox.textContent = 'Aún no hay pregunta publicada';
  panelGanador.classList.add('oculto');
  ganadorMsg.textContent = '';
  activarRondaUI(false);
  limpiarRespuestaLocal();
});

// -------------------------
//      Acciones Docente
// -------------------------
if (esDocente) {
  formDocente?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pregunta = docPregunta.value.trim();
    const respuesta = docRespuesta.value.trim();
    if (!pregunta || !respuesta) return;

    // Enviar nueva pregunta (respuesta se guarda sólo en servidor)
    socket.emit('pregunta:nueva', { pregunta, respuesta });

    // Limpiar campos
    docPregunta.value = '';
    docRespuesta.value = '';
  });

  btnReiniciar?.addEventListener('click', () => {
    socket.emit('ronda:reiniciar');
  });
}

// -------------------------
//     Acciones Estudiante
// -------------------------
formRespuesta.addEventListener('submit', (e) => {
  e.preventDefault();
  const r = miRespuesta.value.trim();
  if (!r) return;

  // Enviar y bloquear para evitar spam local hasta que termine la ronda
  socket.emit('respuesta:enviada', r);
  miRespuesta.disabled = true;
  btnEnviar.disabled = true;
});

// -------------------------
//     Cambiar de usuario
// -------------------------
btnLogout?.addEventListener('click', () => {
  localStorage.removeItem('quiz_nombre');
  window.location.href = '/login.html';
});
