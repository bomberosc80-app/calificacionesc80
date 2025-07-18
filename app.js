let jefes = {};
let jefeActivo = null;
let personalActivo = [];

// Cargar CSV desde GitHub y parsear
async function cargarJefes() {
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
    mostrarFormulario();
  } else {
    alert("Usuario o clave incorrecta");
  }
}

// Mostrar formulario para el personal a cargo
function mostrarFormulario() {
  const contenedor = document.getElementById("formulario");
  contenedor.innerHTML = "";

  personalActivo.forEach(id => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${id}</h3>
      <label>Calificación (Depto Personal):</label>
      <input type="text" id="nota-${id}" placeholder="Ej: 10">
      <hr>
    `;
    contenedor.appendChild(div);
  });

  // Selección de mes y botón
  const selectorMes = `
    <label>Mes:</label>
    <select id="mes">
      <option value="">-- Elegir --</option>
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
  contenedor.innerHTML += selectorMes;
}

// Enviar por WhatsApp
function enviarWhatsApp() {
  const mes = document.getElementById("mes").value;
  if (!mes) {
    alert("Seleccioná el mes antes de enviar.");
    return;
  }

  let mensaje = `📋 Calificaciones - ${mes}\nJefe: ${jefeActivo}\n\n`;

  personalActivo.forEach(id => {
    const nota = document.getElementById(`nota-${id}`).value.trim();
    mensaje += `👨‍🚒 ${id}: ${nota}\n`;
  });

  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// Iniciar carga CSV al comienzo
window.onload = () => {
  cargarJefes();
};
