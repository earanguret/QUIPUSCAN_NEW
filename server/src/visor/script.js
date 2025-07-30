// Función para cargar los datos desde el archivo JSON
async function cargarDatos() {
  try {
    const response = await fetch('ADJUNTOS/metadata.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    document.getElementById('error-message').style.display = 'block';
    console.error('Error al cargar el archivo JSON:', error);
  }
}

// Función para mostrar los datos en la tabla
async function mostrarInventarios() {
  const data = await cargarDatos();
  if (!data) return; // Si no se pudieron cargar los datos, salir de la función

  const datosGenerales = data.datosGenerales;
  const inventariosData = data.expedientes;

  // Para llenar los datos generales
  document.getElementById('especialidad').textContent = datosGenerales.especialidad;
  document.getElementById('anio').textContent = datosGenerales.anio;
  document.getElementById('sede').textContent = datosGenerales.sede;
  document.getElementById('nro_fojas').textContent = datosGenerales.total_fojas ;
  document.getElementById('tipoDoc').textContent = datosGenerales.tipoDoc;
  document.getElementById('nro_expedientes').textContent = datosGenerales.cantidad_expedientes;
  document.getElementById('serieDoc').textContent = datosGenerales.serieDoc;
  // document.getElementById('lote').textContent = datosGenerales.lote;
  document.getElementById('volumen').textContent = datosGenerales.volumen;

  const tbody = document.getElementById('inventarios');
  inventariosData.forEach((item, index) => {
    const pdfRoute = `ADJUNTOS/MICROFORMAS/${item.nro_expediente}.pdf`;
    const row = document.createElement('tr');
    
    // Convertir las fechas a formato legible
    const fechaInicial = new Date(item.fecha_inicial).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    const fechaFinal = new Date(item.fecha_final).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    // Generar la fila de la tabla con los datos formateados
    row.innerHTML = `
      <td>${item.nro_expediente}</td>
      <td>${fechaInicial}</td>
      <td>${fechaFinal}</td>
      <td>${item.juzgado_origen}</td>
      <td><a href="${pdfRoute}" target="_blank">Ver PDF</a></td>
    `;
  
    tbody.appendChild(row);
  });
}

// Llamar a la función para mostrar los datos al cargar la página
document.addEventListener('DOMContentLoaded', mostrarInventarios);

// Función para editar un inventario (puedes personalizarla según tus necesidades)
function editarInventario(index) {
  const item = inventariosData[index];
  // Lógica para editar el inventario
  console.log('Editar inventario:', item);
}

function buscarEnObjeto() {
  var input = document.getElementById("buscar").value.toLowerCase();
  var table = document.getElementById("inventarios");
  var tr = table.getElementsByTagName("tr");
  var noResults = document.getElementById("no-results");
  var foundAny = false;

  for (var i = 0; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName("td");
    var found = false;
    for (var j = 0; j < td.length; j++) {
      if (td[j]) {
        if (td[j].innerHTML.toLowerCase().indexOf(input) > -1) {
          found = true;
          break;
        }
      }
    }
    if (found) {
      tr[i].style.display = "";
      foundAny = true;
    } else {
      tr[i].style.display = "none";
    }
  }

  if (foundAny) {
    noResults.style.display = "none";
  } else {
    noResults.style.display = "block";
  }
}
