let jefes = {};
let jefeActivo = null;
let personalActivo = [];

// Cargar CSV desde GitHub y parsear
tasync function cargarJefes() {
  try {
    const response = await fetch('https://bomberosc80-app.github.io/calificacionesc80/jefes.csv');
    let texto = await response.text();
    texto = texto.replace(/^\uFEFF/, ''); // eliminar BOM si existe
    const lineas = texto.trim().split('\n').slice(1);

    lineas.forEach(linea => {
      const [usuario, clave, personal] = linea.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      jefes[usuario] = {
        clave: clave,
        personal: personal.replace(/\"/g, '').split(',')
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
      <h3>Bombero ${id}</h3>
      <label>Calificación (Depto Personal):</label>
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

  let mensaje = `📋 Calificaciones - ${mes}\n👨‍💼 Jefe: ${jefeActivo}\n\n`;
  personalActivo.forEach(id => {
    const nota = document.getElementById(`nota-${id}`).value.trim();
    mensaje += `👨‍🚒 ${id}: ${nota}\n`;
  });

  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Iniciar carga de datos
window.onload = cargarJefes;
