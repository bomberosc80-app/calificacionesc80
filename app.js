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
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  if (jefes[user] && jefes[user].password === pass) {
    jefeActual = jefes[user];
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
    document.getElementById("welcomeTitle").innerText = `Bienvenido, ${jefeActual.nombre}`;
    mostrarPersonal();
    error.innerText = "";
  } else {
    error.innerText = "Usuario o contraseña incorrectos";
  }
}

function mostrarPersonal() {
  const contenedor = document.getElementById("personalContainer");
  contenedor.innerHTML = "";

  jefeActual.personal.forEach(nombre => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${nombre}</h4>
      <label>Puntaje: <input type="number" min="0" max="10" /></label>
    `;
    contenedor.appendChild(div);
  });
}

function logout() {
  document.getElementById("mainContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("loginError").innerText = "";
}
