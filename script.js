let modoAdmin = false;

// Función para cargar los datos desde clubes.json
async function cargarClubes() {
  const response = await fetch("clubes.json");
  const clubes = await response.json();
  mostrarTabla(clubes);
}

// Función para mostrar la tabla ordenada
function mostrarTabla(clubes) {
  const tabla = document.getElementById("tabla-clubes");
  tabla.innerHTML = ""; // Limpiar tabla

  // Ordenar por puntos (descendente)
  clubes.sort((a, b) => b.puntos - a.puntos);

  // Encabezado
  const encabezado = document.createElement("tr");
  encabezado.innerHTML = `
    <th>Posición</th>
    <th>Club</th>
    <th>Puntos</th>
  `;
  tabla.appendChild(encabezado);

  // Filas
  clubes.forEach((club, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${club.nombre}</td>
      <td contenteditable="${modoAdmin}" 
          oninput="actualizarPuntos(${index}, this.innerText)">
          ${club.puntos}</td>
    `;
    tabla.appendChild(fila);
  });

  // Guardar en global para actualizar si hay cambios
  window.clubesActuales = clubes;
}

// Función que se llama al editar un punto
function actualizarPuntos(index, nuevoValor) {
  const puntos = parseInt(nuevoValor.trim());
  if (!isNaN(puntos)) {
    window.clubesActuales[index].puntos = puntos;
    guardarClubes(window.clubesActuales);
  }
}

// Guardar cambios si estás en entorno local o Netlify Function
function guardarClubes(clubes) {
  if (!modoAdmin) return;

  fetch("guardar-clubes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clubes)
  })
    .then(res => {
      if (res.ok) {
        console.log("Cambios guardados correctamente");
        cargarClubes(); // Recargar para reordenar
      } else {
        alert("Error al guardar. Verifica conexión con backend o función Netlify.");
      }
    })
    .catch(err => {
      console.error("Error al guardar:", err);
    });
}

// Activar modo Admin
function activarModoAdmin() {
  const contraseña = prompt("Ingresa la contraseña:");
  if (contraseña === "copatintal2025") {
    modoAdmin = true;
    mostrarTabla(window.clubesActuales); // Recargar tabla editable
    document.getElementById("btnAdmin").style.display = "none";
  } else {
    alert("Contraseña incorrecta.");
  }
}

window.onload = cargarClubes;
async function guardarClubes(clubes) {
  const response = await fetch('/.netlify/functions/guardar-clubes', {
    method: 'POST',
    body: JSON.stringify(clubes),
  });

  const result = await response.json();
  alert(result.message || 'Guardado');
}
