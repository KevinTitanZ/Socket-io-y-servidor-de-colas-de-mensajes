// client.js
const socket = io();

// --- DOM refs ---
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

// --- Nombre de usuario ---
let nombre = localStorage.getItem('quiz_nombre');
if (!nombre) {
  nombre = prompt('Ingresa tu nombre (usa "docente" si eres profesor):') || 'Anónimo';
  nombre = nombre.trim();
  localStorage.setItem('quiz_nombre', nombre);
}
yo.textContent = `Conectado como: ${nombre}`;

// Mostrar/ocultar panel del docente
const esDocente = nombre.toLowerCase() === 'docente';
if (esDocente) {
  panelDocente.classList.remove('oculto');
} else {
  panelDocente.classList.add('oculto');
}

socket.emit('usuario:conectado', nombre);

// --- Helpers UI ---
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

// --- Eventos de servidor ---
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

// --- Docente: publicar pregunta ---
if (esDocente) {
  formDocente.addEventListener('submit', (e) => {
    e.preventDefault();
    const pregunta = docPregunta.value.trim();
    const respuesta = docRespuesta.value.trim();
    if (!pregunta || !respuesta) return;
    socket.emit('pregunta:nueva', { pregunta, respuesta });
    docPregunta.value = '';
    docRespuesta.value = '';
  });

  btnReiniciar.addEventListener('click', () => {
    socket.emit('ronda:reiniciar');
  });
}

// --- Estudiante: enviar respuesta ---
formRespuesta.addEventListener('submit', (e) => {
  e.preventDefault();
  const r = miRespuesta.value.trim();
  if (!r) return;
  // Enviar y deshabilitar para evitar spam local
  socket.emit('respuesta:enviada', r);
  miRespuesta.disabled = true;
  btnEnviar.disabled = true;
});
