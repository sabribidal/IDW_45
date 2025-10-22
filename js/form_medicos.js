const STORAGE_KEY = 'profesionales';
const card_medico = document.querySelector('#card_medico');

//crear una funcion para cargar los datos de los profesionales en el archivo equipo_medico.html
function cargarProfesionales() {
    const profesionales = obtenerProfesionales();
    card_medico.innerHTML = '';
    profesionales.forEach(profesional => {
        const card = document.createElement('div');
        card.classList.add('card', 'm-2');  
        card.style.width = '18rem;';
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

function generarNuevoId() {
    const profesionales = obtenerProfesionales();
    
    if (profesionales.length === 0) {
        return "1";
    }
    
    const idsNumericos = profesionales.map(p => parseInt(p.id));
    const maxId = Math.max(...idsNumericos);
    
    return String(maxId + 1);
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

function guardarProfesionales(profesionales) {
    const data = {
        profesionales: profesionales
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        
        reader.onerror = function(error) {
            reject(error);
        };
        
        reader.readAsDataURL(file);
    });
}

function obtenerObrasSocialesSeleccionadas() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const obrasSociales = [];
    
    checkboxes.forEach(checkbox => {
        obrasSociales.push(checkbox.value);
    });
    
    return obrasSociales;
}

function validarObrasSociales() {
    const obrasSociales = obtenerObrasSocialesSeleccionadas();
    const errorDiv = document.getElementById('osError');
    
    if (obrasSociales.length === 0) {
        errorDiv.style.display = 'block';
        return false;
    } else {
        errorDiv.style.display = 'none';
        return true;
    }
}

function limpiarFormulario() {
    document.getElementById('formMedico').reset();
    document.getElementById('formMedico').classList.remove('was-validated');
    document.getElementById('osError').style.display = 'none';
}

function agregarOtro() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalExito'));
    modal.hide();
    limpiarFormulario();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function verListaMedicos() {
    window.location.href = 'Institucion/equipo_medico.html';
}

document.getElementById('formMedico').addEventListener('submit', async function(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    
    const obrasSocialesValidas = validarObrasSociales();
    
    if (!form.checkValidity() || !obrasSocialesValidas) {
        form.classList.add('was-validated');
        return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const matricula = document.getElementById('matricula').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();
    const description = document.getElementById('description').value.trim();
    const obrasSociales = obtenerObrasSocialesSeleccionadas();
    const valorConsulta = parseFloat(document.getElementById('valorConsulta').value);
    
    const photoInput = document.getElementById('photo');
    const photoFile = photoInput.files[0];
    
    if (!photoFile) {
        alert('Por favor seleccione una fotografía');
        return;
    }

    try {
        const photoBase64 = await convertirImagenABase64(photoFile);
        
        const nuevoId = generarNuevoId();

        const nuevoMedico = {
            id: nuevoId,
            nombre: nombre,
            especialidad: especialidad,
            matricula: matricula,
            description: description,
            OS: obrasSociales,
            photo: photoBase64,
            valorConsulta: valorConsulta
        };

        const profesionales = obtenerProfesionales();

        profesionales.push(nuevoMedico);

        guardarProfesionales(profesionales);

        const modal = new bootstrap.Modal(document.getElementById('modalExito'));
        modal.show();
        
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        alert('Hubo un error al procesar la imagen. Por favor intente nuevamente.');
    }
});

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', validarObrasSociales);
});