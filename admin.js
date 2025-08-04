let modoAdmin = false;
const password = "copatintal2025"; // Contraseña para activar edición

// Calcular puntaje total
function calcularPuntaje(club) {
  return (club.oro * 3) + (club.plata * 2) + (club.bronce * 1);
}

// Cargar datos desde clubes.json
async function cargarClubes() {
  const res = await fetch("clubes.json");
  const clubes = await res.json();
  mostrarTabla(clubes);
}

// Mostrar la tabla ordenada por puntaje
function mostrarTabla(clubes) {
  const tabla = document.getElementById("tabla-clubes");
  tabla.innerHTML = "";

  // Ordenar por puntaje descendente
  clubes.sort((a, b) => calcularPuntaje(b) - calcularPuntaje(a));

  clubes.forEach((club, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td contenteditable="${modoAdmin}">${club.nombre}</td>
      <td contenteditable="${modoAdmin}">${club.oro}</td>
      <td contenteditable="${modoAdmin}">${club.plata}</td>
      <td contenteditable="${modoAdmin}">${club.bronce}</td>
      <td>${calcularPuntaje(club)}</td>
      <td>${index + 1}</td> <!-- posición -->
    `;

    tabla.appendChild(row);
  });
}

// Activar modo edición
function activarModoAdmin() {
  const clave = prompt("Introduce la contraseña de administrador:");
  if (clave === password) {
    modoAdmin = true;
    document.getElementById("btn-guardar").style.display = "inline";
    cargarClubes();
  } else {
    alert("Contraseña incorrecta.");
  }
}

// Guardar los cambios usando Netlify Function
async function guardarCambios() {
  const tabla = document.getElementById("tabla-clubes");
  const filas = tabla.querySelectorAll("tr");
  const nuevosClubes = [];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");
    if (celdas.length >= 4) {
      nuevosClubes.push({
        nombre: celdas[0].innerText.trim(),
        oro: parseInt(celdas[1].innerText.trim()) || 0,
        plata: parseInt(celdas[2].innerText.trim()) || 0,
        bronce: parseInt(celdas[3].innerText.trim()) || 0
      });
    }
  });

  const res = await fetch("/.netlify/functions/updateClubes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevosClubes)
  });

  if (res.ok) {
    alert("Cambios guardados correctamente.");
    modoAdmin = false;
    document.getElementById("btn-guardar").style.display = "none";
    cargarClubes();
  } else {
    alert("Error al guardar.");
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarClubes();
});
