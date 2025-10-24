const STORAGE_KEY = 'profesionales';
const card_medico = document.getElementById('card_medico');

// Función para inicializar los datos desde el JSON
async function inicializarDatos() {
    const data = localStorage.getItem(STORAGE_KEY);
    
    // Si no hay datos en localStorage, cargar desde el JSON
    if (!data) {
        try {
            const response = await fetch('../data/profesionales.json');
            const jsonData = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData));
            console.log('Datos cargados desde JSON al localStorage');
        } catch (error) {
            console.error('Error al cargar el archivo JSON:', error);
        }
    }
}


//crear una funcion para cargar los datos de los profesionales en el archivo equipo_medico.html
function cargarProfesionales() {
    const profesionales = obtenerProfesionales();
    card_medico.innerHTML = '';

    if (profesionales.length === 0) {
        card_medico.innerHTML = '<p class="text-center">No hay profesionales disponibles.</p>';
        return;
    }

    profesionales.forEach(profesional => {
        const card = document.createElement('div');
        const valorConsultaNumerico = parseFloat(profesional.valorConsulta);
    const valorFormateado = isNaN(valorConsultaNumerico) ? 'N/A' : valorConsultaNumerico.toFixed(2);
        card.classList.add('card', 'm-2');  
        card.style.width = '18rem';
        card.innerHTML = `
            <img src="${profesional.photo}" class="card-img-top" alt="Foto de ${profesional.nombre}">
            <div class="card-body">
                <h5 class="card-title">${profesional.nombre}</h5>
                <p class="card-text"><strong>Especialidad:</strong> ${profesional.especialidad}</p>
                <p class="card-text"><strong>Matrícula:</strong> ${profesional.matricula}</p>
                <p class="card-text">${profesional.description}</p>
                <p class="card-text"><strong>Obras Sociales:</strong> ${profesional.OS.join(', ')}</p>
                <p class="card-text"><strong>Valor Consulta:</strong> $${profesional.valorConsulta.toFixed(2)}</p>
            </div>
        `;
        card_medico.appendChild(card);
    });
}


function obtenerProfesionales() {
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
        return [];
    }
    
    try {
        const parsed = JSON.parse(data);
        return parsed.profesionales || [];
    } catch (error) {
        console.error('Error al parsear datos:', error);
        return [];
    }
}

function verListaMedicos() {
    window.location.href = 'Institucion/equipo_medico.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    await inicializarDatos();
    cargarProfesionales();
});


function guardarProfesionales(profesionales) {
    const data = {
        profesionales: profesionales
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}