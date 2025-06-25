
let datos = JSON.parse(localStorage.getItem("bomberosData")) || { usuarios: {} };
let usuarioActual = null;

function guardarDatos() {
  localStorage.setItem("bomberosData", JSON.stringify(datos));
}

function login() {
  const u = document.getElementById("usuario").value.trim();
  const c = document.getElementById("clave").value.trim();
  if (datos.usuarios[u] && datos.usuarios[u].clave === c) {
    usuarioActual = u;
    document.getElementById("login-form").style.display = "none";
    document.getElementById("nombre-usuario").innerText = u;
    if (u.toLowerCase() === "admin") {
      document.getElementById("admin-panel").style.display = "block";
    }
    document.getElementById("user-panel").style.display = "block";
    mostrarCalificaciones(u);
  } else {
    alert("Usuario o clave incorrectos.");
  }
}

function crearUsuario() {
  const u = document.getElementById("nuevo-usuario").value.trim();
  const c = document.getElementById("nueva-clave").value.trim();
  if (u && c) {
    if (datos.usuarios[u]) return alert("El usuario ya existe.");
    datos.usuarios[u] = { clave: c, calificaciones: {} };
    guardarDatos();
    alert("Usuario creado.");
  }
}

function cargarCSV() {
  const archivo = document.getElementById("archivo-csv").files[0];
  if (!archivo) return alert("Selecciona un archivo CSV.");
  const reader = new FileReader();
  reader.onload = function (e) {
    const lineas = e.target.result.split(/\r?\n/);
    const encabezado = lineas[0].split(",");
    for (let i = 1; i < lineas.length; i++) {
      const celdas = lineas[i].split(",");
      const usuario = celdas[0];
      const mes = celdas[1];
      if (!usuario || !mes) continue;
      if (!datos.usuarios[usuario]) datos.usuarios[usuario] = { clave: "1234", calificaciones: {} };
      const categorias = {};
      for (let j = 2; j < encabezado.length; j++) {
        categorias[encabezado[j]] = parseInt(celdas[j]) || 0;
      }
      datos.usuarios[usuario].calificaciones[mes] = categorias;
    }
    guardarDatos();
    alert("Datos cargados.");
    if (usuarioActual) mostrarCalificaciones(usuarioActual);
  };
  reader.readAsText(archivo);
}

function mostrarCalificaciones(usuarioId) {
  const user = datos.usuarios[usuarioId];
  const calif = user.calificaciones || {};
  const meses = Object.keys(calif).sort();
  if (meses.length === 0) {
    document.getElementById("tabla-calificaciones").innerHTML = "<p>No hay calificaciones aún.</p>";
    return;
  }
  let html = '<label for="select-mes">Ver calificaciones de: </label><select id="select-mes"><option value="ANUAL">Resumen Anual</option>';
  meses.forEach(m => html += `<option value="${m}">${m}</option>`);
  html += "</select><br><br>";
  document.getElementById("selector-mes").innerHTML = html;
  document.getElementById("select-mes").addEventListener("change", () => {
    renderCalificaciones(usuarioId, document.getElementById("select-mes").value);
  });
  renderCalificaciones(usuarioId, "ANUAL");
}

function renderCalificaciones(usuarioId, mesSeleccionado) {
  const user = datos.usuarios[usuarioId];
  const calif = user.calificaciones || {};
  const meses = Object.keys(calif).sort();
  if (meses.length === 0) return;
  const categorias = Object.keys(calif[meses[0]]);
  let html = "<table><thead><tr><th>Mes</th>";
  categorias.forEach(cat => html += `<th>${cat}</th>`);
  html += "</tr></thead><tbody>";
  const totales = Object.fromEntries(categorias.map(c => [c, 0]));
  const mostrar = mesSeleccionado === "ANUAL" ? meses : [mesSeleccionado];
  mostrar.forEach(m => {
    html += `<tr><td>${m}</td>`;
    categorias.forEach(cat => {
      const val = calif[m]?.[cat] ?? 0;
      html += `<td>${val}</td>`;
      totales[cat] += val;
    });
    html += "</tr>";
  });
  if (mesSeleccionado === "ANUAL" && meses.length > 1) {
    html += "<tr><th>Total</th>";
    categorias.forEach(cat => html += `<th>${totales[cat]}</th>`);
    html += "</tr>";
  }
  html += "</tbody></table>";
  document.getElementById("tabla-meses").innerHTML = html;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(r => {
      console.log("SW registrado", r);
    });
  });
}
