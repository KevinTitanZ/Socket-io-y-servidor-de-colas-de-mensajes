// login.js
const form = document.getElementById('login-form');
const input = document.getElementById('nombre');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = (input.value || '').trim();
  if (!nombre) return;
  localStorage.setItem('quiz_nombre', nombre);
  // Ir a la app
  window.location.href = '/';
});

// Si ya hay nombre, ir directo
const ya = localStorage.getItem('quiz_nombre');
if (ya && ya.trim()) {
  window.location.href = '/';
}
