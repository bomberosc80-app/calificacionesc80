// Jefes y su personal
const jefes = {
  jefe1: {
    password: "clave1",
    nombre: "Jefe Juan",
    personal: ["Bombero A", "Bombero B", "Bombero C"]
  },
  jefe2: {
    password: "clave2",
    nombre: "Jefa Marta",
    personal: ["Bombero D", "Bombero E"]
  }
};

let jefeActual = null;

function login() {
  const usuarioInput = document.getElementById("usuario").value.trim();
  const claveInput = document.getElementById("clave").value.trim();

 const user = jefes[usuarioInput];

if (user && user.password === claveInput) {
  jefeActual = user;
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
  mostrarPersonal();
} else {
  alert("Usuario o contraseña inválido");
}
}

function mostrarPersonal() {
  const contenedor = document.getElementById("personalContainer");
  contenedor.innerHTML = "";

  jefeActual.personal.forEach(nombre => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="persona">
        <h4>${nombre}</h4>
        <label>Ropería: <input type="number" class="input" data-nombre="${nombre}" data-cat="Ropería" min="0" max="10" /></label>
        <label>Instrucción: <input type="number" class="input" data-nombre="${nombre}" data-cat="Instrucción" min="0" max="10" /></label>
        <label>Guardia: <input type="number" class="input" data-nombre="${nombre}" data-cat="Guardia" min="0" max="10" /></label>
      </div>
      <hr/>
    `;
    contenedor.appendChild(div);
  });

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Exportar calificaciones";
  exportBtn.onclick = exportarCSV;
  contenedor.appendChild(exportBtn);
}

function exportarCSV() {
  const inputs = document.querySelectorAll(".input");
  const datos = {};

  // Agrupar calificaciones por persona
  inputs.forEach(input => {
    const nombre = input.dataset.nombre;
    const categoria = input.dataset.cat;
    const valor = input.value || "0";

    if (!datos[nombre]) {
      datos[nombre] = {};
    }
    datos[nombre][categoria] = valor;
  });

  // Crear CSV
  let csv = "Nombre,Ropería,Instrucción,Guardia\n";
  for (const nombre in datos) {
    const cal = datos[nombre];
    csv += `${nombre},${cal["Ropería"] || 0},${cal["Instrucción"] || 0},${cal["Guardia"] || 0}\n`;
  }

  // Descargar CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", `calificaciones_${jefeActual.nombre}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function logout() {
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("loginError").innerText = "";
}
