async function cargarClubes() {
  const response = await fetch("clubes.json");
  const data = await response.json();
  const tbody = document.querySelector("#tablaClubes tbody");
  tbody.innerHTML = "";

  data.forEach((club, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><input type="text" value="${club.club}" disabled></td>
      <td><input type="number" value="${club.oro}" disabled></td>
      <td><input type="number" value="${club.plata}" disabled></td>
      <td><input type="number" value="${club.bronce}" disabled></td>
    `;
    tbody.appendChild(row);
  });
}

cargarClubes();

function enableEditing() {
  const pass = document.getElementById("adminPass").value;
  if (pass !== "copatintal2025") {
    alert("Contraseña incorrecta");
    return;
  }

  const inputs = document.querySelectorAll("#tablaClubes input");
  inputs.forEach(input => input.disabled = false);
}

async function guardarDatos() {
  const pass = document.getElementById("adminPass").value;
  if (pass !== "copatintal2025") {
    alert("Contraseña incorrecta");
    return;
  }

  const filas = document.querySelectorAll("#tablaClubes tbody tr");
  const datos = [];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("input");
    datos.push({
      club: celdas[0].value,
      oro: parseInt(celdas[1].value),
      plata: parseInt(celdas[2].value),
      bronce: parseInt(celdas[3].value)
    });
  });

  const response = await fetch("/.netlify/functions/guardarClubes", {
    method: "POST",
    body: JSON.stringify(datos),
    headers: { "Content-Type": "application/json" }
  });

  const result = await response.text();
  alert(result);
}
