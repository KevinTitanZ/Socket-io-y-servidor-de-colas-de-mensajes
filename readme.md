# 📚 Implementación de Aplicación en Tiempo Real con Socket.io – “Quiz Rápido: El Duelo de Conocimiento”

## **Introducción**
En la era de la conectividad, las aplicaciones en tiempo real permiten la interacción instantánea entre múltiples usuarios, lo que potencia experiencias colaborativas, competitivas y dinámicas. El presente proyecto, titulado **“Quiz Rápido: El Duelo de Conocimiento”**, tiene como finalidad implementar una aplicación web de preguntas y respuestas en tiempo real utilizando **Socket.io**, tecnología que facilita la comunicación bidireccional entre cliente y servidor.  
A través de esta implementación, se busca que un usuario con el rol de “docente” pueda publicar preguntas que serán respondidas por múltiples “estudiantes”, premiando al primero que acierte con la respuesta correcta. Esta dinámica promueve la rapidez, la concentración y el aprendizaje interactivo.

---

## **Objetivos**
### **Objetivo General**
Desarrollar una aplicación web en tiempo real que permita la interacción entre un docente y múltiples estudiantes mediante preguntas y respuestas, utilizando **Node.js**, **Express** y **Socket.io**.

### **Objetivos Específicos**
- Implementar comunicación bidireccional entre cliente y servidor mediante eventos de Socket.io.
- Diseñar una interfaz diferenciada para docente y estudiantes.
- Sincronizar el estado de la aplicación (pregunta activa, ganador de la ronda) en tiempo real.
- Aplicar el concepto de **broadcasting** para actualizar la información simultáneamente en todos los clientes conectados.
- Manejar correctamente la lógica para determinar el ganador de cada ronda.

---

## **Desarrollo**

### **1. Conceptos Breves**
- **Socket.io:** Biblioteca que permite comunicación bidireccional en tiempo real entre cliente y servidor mediante WebSockets.
- **Broadcasting:** Envío de mensajes o eventos a todos los clientes conectados desde el servidor.
- **Node.js + Express:** Plataforma y framework utilizados para construir el backend y servir los archivos estáticos.
- **Cliente-Servidor:** Arquitectura donde el servidor gestiona la lógica y los clientes muestran y envían datos.

---

### **2. Procedimientos**
**Estructura del Proyecto:**
```
/public
   index.html
   client.js
server.js
package.json
```

**Fase 1 – Configuración Inicial:**
1. Crear la carpeta del proyecto.
2. Inicializar Node.js:
   ```bash
   npm init -y
   ```
3. Instalar dependencias:
   ```bash
   npm install express socket.io
   ```

**Fase 2 – Backend con Node.js y Socket.io:**
- Configurar **server.js** para:
  - Servir archivos estáticos de `/public`.
  - Inicializar Socket.io sobre el servidor HTTP.
  - Manejar eventos:
    - `usuario:conectado`
    - `pregunta:nueva`
    - `respuesta:enviada`
    - `ronda:terminada`

**Fase 3 – Frontend HTML, CSS y JavaScript:**
- `index.html` con campos para nombre de usuario, pregunta, opciones de respuesta y área de mensajes.
- `client.js` con:
  - Conexión al servidor (`io()`).
  - Eventos para mostrar preguntas.
  - Envío y verificación de respuestas.
  - Mostrar ganador en pantalla.

---

### **3. Comandos para Ejecución**
```bash
# Clonar el repositorio
git clone https://github.com/KevinTitanZ/Socket-io-y-servidor-de-colas-de-mensajes.git

# Entrar al proyecto
cd Socket-io-y-servidor-de-colas-de-mensajes

# Instalar dependencias
npm install

# Ejecutar el servidor
node server.js
```
Luego, abrir el navegador en:  
```
http://localhost:3000
```

### **4. Imagenes**

- Ejecucion del servidor en el puerto 3000
![Ejecucion del servidor en el puerto 3000](/imagenes/ejecucionServer.jpg)

- Nos redirige a login.html para verificar si somos estudiantes o docentes. (registramos con docente)
![Login del docente](/imagenes/loginQuizDocente.jpg)

- En caso de ser docente, nos registramos como tal. Luego se mostrará un apartado donde se podrán redactar preguntas, establecer una única respuesta y publicarlas para que estén disponibles a todos los demás usuarios registrados como estudiantes.
![Dashboard de Docente para publicar](/imagenes/dashboardDocente.jpg)

- Publicacion de pregunta por el Docente
![Publicacion de pregunta por el Docente](/imagenes/publicacionPreguntaDocente.jpg)

- Al registrarse como estudiante, solo es necesario ingresar el nombre para comenzar a participar en el quiz creado por el docente. Por ejemplo, el estudiante 'Kevin' puede responder la pregunta previamente formulada por el docente.
![Dashboard del estudiante](/imagenes/dashboardQuizEstudiante.jpg)

- Una vez que el estudiante responde correctamente y es el primero en hacerlo antes que los demás, aparecerá un mensaje indicando que hay un ganador. En caso contrario, no se mostrará ningún mensaje de ganador.
![Realizado con Exito el Quiz por el estudiante](/imagenes/quizCompletadoEstudiante.jpg)

---

## **Conclusiones**
- **Socket.io** permite implementar de forma sencilla una comunicación en tiempo real entre múltiples clientes, sincronizando datos de manera instantánea.
- La separación de roles (docente/estudiante) es clave para el flujo del juego, y puede gestionarse fácilmente mediante lógica en el cliente y el servidor.
- La aplicación demuestra el poder del broadcasting para mantener a todos los clientes sincronizados.
- El manejo de estados (`rondaActiva`, `respuestaCorrectaActual`) es fundamental para controlar el flujo del juego y evitar conflictos.

---

## **Recomendaciones**
1. Implementar un sistema de puntajes acumulativos para aumentar la competitividad.
2. Añadir autenticación para evitar que un estudiante pueda entrar como docente.
3. Mejorar la interfaz con estilos CSS para mayor usabilidad.
4. Implementar persistencia de preguntas y puntajes mediante una base de datos.
5. Optimizar la lógica para manejar desconexiones y reconexiones de clientes.
