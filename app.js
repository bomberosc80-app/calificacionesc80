let jefes = {};
let jefeActivo = null;
let personalActivo = [];
let nombresPersonal = {}; // Mapa de ID a nombre

// Cargar CSV de personal desde GitHub
async function cargarPersonal() {
  try {
    const response = await fetch('https://bomberosc80-app.github.io/calificacionesc80/personal.csv');
    let texto = await response.text();
    texto = texto.replace(/^\uFEFF/, ''); // eliminar BOM si existe
    const lineas = texto.trim().split('\n').slice(1); // saltear encabezado

    lineas.forEach(linea => {
      const [id, nombre] = linea.split(',');
      nombresPersonal[id.trim()] = nombre.trim();
    });

    console.log('Personal cargado:', nombresPersonal);
  } catch (e) {
    console.error('Error cargando personal.csv:', e);
  }
}


// Cargar CSV desde GitHub y parsear

async function cargarJefes() {
  try {
    const response = await fetch('https://bomberosc80-app.github.io/calificacionesc80/jefes.csv');
    let texto = await response.text();
    texto = texto.replace(/^\uFEFF/, ''); // eliminar BOM si existe
    const lineas = texto.trim().split('\n').slice(1);

    lineas.forEach(linea => {
      const [usuario, clave, personal, area, nombre] = linea.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
jefes[usuario] = {
  clave: clave,
  personal: personal.replace(/\"/g, '').split(','),
  area: (area || '').trim(),
  nombre: (nombre || '').trim()
};

    });

    console.log('Jefes cargados:', jefes);
  } catch (e) {
    console.error('Error cargando jefes.csv:', e);
  }
}


// Validar login
document.getElementById('btnLogin').addEventListener('click', () => {
  const usuario = document.getElementById('usuario').value.trim();
  const clave = document.getElementById('clave').value.trim();

  if (jefes[usuario] && jefes[usuario].clave === clave) {
    jefeActivo = usuario;
    personalActivo = jefes[usuario].personal;
    document.getElementById('loginDiv').style.display = 'none';
    document.getElementById('formDiv').style.display = 'block';
    mostrarFormulario();
    personalActivo.forEach(id => {
  const nombre = nombresPersonal[id.trim()] || 'Nombre desconocido';
  const div = document.createElement('div');
  div.innerHTML = `
    <h3>${id} - ${nombre}</h3>
    <label>Calificación (Depto Personal):</label>
    <textarea id="nota-${id}" rows="2" placeholder="Ej: 10"></textarea>
    <hr>
  `;
  contenedor.appendChild(div);
});

  } else {
    document.getElementById('loginMsg').textContent = 'Usuario o clave incorrecta';
  }
});

// Mostrar formulario de calificaciones
function mostrarFormulario() {
  const contenedor = document.getElementById('formDiv');
  contenedor.innerHTML = '';

  personalActivo.forEach(id => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3> ${id}</h3>
      <textarea id="nota-${id}" rows="2" placeholder="Ej: 10"></textarea>
      <hr>
    `;
    contenedor.appendChild(div);
  });

  // Selección mes y botón
  const footer = document.createElement('div');
  footer.innerHTML = `
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
    <button id="btnEnviar">Enviar por WhatsApp</button>
  `;
  contenedor.appendChild(footer);

  document.getElementById('btnEnviar').addEventListener('click', enviarWhatsApp);
}

// Generar y enviar mensaje por WhatsApp
function enviarWhatsApp() {
  const mes = document.getElementById('mes').value;
  if (!mes) {
    alert('Por favor seleccioná un mes.');
    return;
  }

let jefe = jefes[jefeActivo];
let mensaje = `📋 Calificaciones - ${mes}\n👨‍💼 Jefe: ${jefe.nombre} (${jefeActivo})\n🏢 area: ${jefe.area}\n\n`;

  personalActivo.forEach(id => {
    const nota = document.getElementById(`nota-${id}`).value.trim();
    mensaje += `👨‍🚒 ${id}: ${nota}\n`;
  });

  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Iniciar carga de datos
window.onload = cargarJefes;
window.onload = async () => {
  await cargarPersonal();
  await cargarJefes();
};

