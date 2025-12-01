
// Función para cargar los datos desde el archivo JSON
async function cargarDatos() {
  try {
    const response = await fetch('ADJUNTOS/metadata.json');
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    // Antes de convertir a JSON, lo leo como texto
    const text = await response.text();

    // Intento parsear como JSON
    try {
      const data = JSON.parse(text);
      return data;
    } catch (e) {
      console.error("El archivo recibido no es JSON válido. Contenido recibido:", text);
      throw new Error("El archivo no es JSON válido.");
    }

  } catch (error) {
    document.getElementById('error-message').style.display = 'block';
    console.error('Error al cargar el archivo JSON:', error);
  }
}

async function unirPDFs(pdfCompletoURL, pdfFirmadoURL) {
  const { PDFDocument } = PDFLib;

  try {
    const completoBytes = await fetch(pdfCompletoURL).then(res => res.arrayBuffer());
    const firmadoBytes = await fetch(pdfFirmadoURL).then(res => res.arrayBuffer());

    const pdfCompleto = await PDFDocument.load(completoBytes);
    const pdfFirmado = await PDFDocument.load(firmadoBytes);

    const pdfFinal = await PDFDocument.create();

    // 1) Copiar solo la primera hoja del PDF firmado
    const [paginaFirmada] = await pdfFinal.copyPages(pdfFirmado, [0]);
    pdfFinal.addPage(paginaFirmada);

    // 2) Copiar TODAS las páginas del PDF completo EXCEPTO la primera
    const indicesRestantes = pdfCompleto.getPageIndices().slice(1); // <-- quitar página 0

    const paginasRestantes = await pdfFinal.copyPages(pdfCompleto, indicesRestantes);
    paginasRestantes.forEach(p => pdfFinal.addPage(p));

    const pdfFinalBytes = await pdfFinal.save();
    return URL.createObjectURL(new Blob([pdfFinalBytes], { type: 'application/pdf' }));
  } catch (e) {
    console.error("Error uniendo PDFs:", e);
    return pdfCompletoURL; // fallback
  }
}

// Función para mostrar los datos en la tabla
async function mostrarInventarios() {
  const data = await cargarDatos();
  if (!data) return;

  const datosGenerales = data.datosGenerales;
  const inventariosData = data.expedientes;

  // Llenar los datos generales
  document.getElementById('especialidad').textContent = datosGenerales.especialidad;
  document.getElementById('anio').textContent = datosGenerales.anio;
  document.getElementById('sede').textContent = datosGenerales.sede;
  document.getElementById('nro_fojas').textContent = datosGenerales.total_fojas;
  document.getElementById('tipoDoc').textContent = datosGenerales.tipoDoc;
  document.getElementById('nro_expedientes').textContent = datosGenerales.cantidad_expedientes;
  document.getElementById('serieDoc').textContent = datosGenerales.serieDoc;
  document.getElementById('volumen').textContent = datosGenerales.volumen;


  const tbody = document.getElementById('expedientes');
  tbody.innerHTML = "";

  inventariosData.forEach((item) => {
    const row = document.createElement('tr');

    const fechaInicial = new Date(item.fecha_inicial).toLocaleDateString('es-ES');
    const fechaFinal = new Date(item.fecha_final).toLocaleDateString('es-ES');

    row.innerHTML = `
      <td>${item.nro_expediente}</td>
      <td>${fechaInicial}</td>
      <td>${fechaFinal}</td>
      <td>${item.juzgado_origen}</td>
      <td><a href="#" class="ver-pdf" data-expediente="${item.nro_expediente}">Ver PDF</a></td>
    `;

    tbody.appendChild(row);
  });

  // 🔹 Event delegation: manejar clicks en "Ver PDF"
  tbody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("ver-pdf")) {
      e.preventDefault();
      const nro = e.target.dataset.expediente;

      const pdfRoute = `ADJUNTOS/MICROFORMAS/EXPEDIENTES/${nro}.pdf`;
      const pdfFirmadoRoute = `ADJUNTOS/MICROFORMAS/FIRMADOS/${nro}.pdf`;

      e.target.textContent = "Cargando...";

      const pdfUnidoURL = await unirPDFs(pdfRoute, pdfFirmadoRoute);

      window.open(pdfUnidoURL, "_blank");

      e.target.textContent = "Ver PDF";
    }
  });
}

// Llamar a la función para mostrar los datos al cargar la página
document.addEventListener('DOMContentLoaded', mostrarInventarios);

// Función de búsqueda (queda igual)
function buscarEnObjeto() {
  var input = document.getElementById("buscar").value.toLowerCase();
  var table = document.getElementById("expedientes");
  var tr = table.getElementsByTagName("tr");
  var noResults = document.getElementById("no-results");
  var foundAny = false;

  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName("td");
    var found = false;
    for (var j = 0; j < td.length; j++) {
      if (td[j] && td[j].innerHTML.toLowerCase().indexOf(input) > -1) {
        found = true;
        break;
      }
    }
    tr[i].style.display = found ? "" : "none";
    if (found) foundAny = true;
  }

  noResults.style.display = foundAny ? "none" : "block";
}