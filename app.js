let jefes = {};
let jefeActivo = null;
let personalActivo = [];

// Cargar CSV desde GitHub
async function cargarJefes() {
  const texto = (await response.text()).replace(/^\uFEFF/, '');
  const response = await fetch("https://bomberosc80-app.github.io/calificacionesc80/jefes.csv");
  const texto = await response.text();
  const lineas = texto.trim().split("\n").slice(1); // Ignora encabezado

  lineas.forEach(linea => {
    const [usuario, clave, personal] = linea.split(",");
    jefes[usuario] = {
      clave: clave,
      personal: personal.replace(/"/g, "").split(",")
    };
  });
}

// Validar login
function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (jefes[usuario] && jefes[usuario].clave === clave) {
    jefeActivo = usuario;
    personalActivo = jefes[usuario].personal;
    document.getElementById("login").style.display = "none";
    document.getElementById("formulario").style.display = "block";
    mostrarFormulario();
  } else {
    alert("Usuario o clave incorrectos");
  }
}

// Mostrar formulario de calificaciones
function mostrarFormulario() {
  const contenedor = document.getElementById("formulario");
  contenedor.innerHTML = "";

  personalActivo.forEach(id => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${id}</h3>
      <label>Calificación:</label>
      <input type="text" id="nota-${id}" placeholder="Ej: 10">
      <hr>
    `;
    contenedor.appendChild(div);
  });

  contenedor.innerHTML += `
    <label for="mes">Mes:</label>
    <select id="mes">
      <option value="">-- Elegí el mes --</option>
      <option value="Enero">Enero</option>
      <option value="Febrero">Febrero</option>
      <option value="Marzo">Marzo</option>
      <option value="Abril">Abril</option>
      <option value="Mayo">Mayo</option>
      <option value="Junio">Junio</option>
      <option value="Julio">Julio</option>
      <option value="Agosto">Agosto</option>
      <option value="Septiembre">Septiembre</option>
      <option value="Octubre">Octubre</option>
      <option value="Noviembre">Noviembre</option>
      <option value="Diciembre">Diciembre</option>
    </select>
    <br><br>
    <button onclick="enviarWhatsApp()">Enviar por WhatsApp</button>
  `;
}

// Generar y enviar mensaje
function enviarWhatsApp() {
  const mes = document.getElementById("mes").value;
  if (!mes) {
    alert("Por favor seleccioná un mes.");
    return;
  }

  let mensaje = `📋 Calificaciones - ${mes}\n👨‍💼 Jefe: ${jefeActivo}\n\n`;

  personalActivo.forEach(id => {
    const nota = document.getElementById(`nota-${id}`).value.trim();
    mensaje += `👨‍🚒 ${id}: ${nota}\n`;
  });

  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// Iniciar
window.onload = cargarJefes;
