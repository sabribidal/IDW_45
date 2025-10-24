
const tabla=document.getElementById('tabla_medico')
const profesionales = [];
let medicoEditando = null;
const modalE = document.querySelector('#modalEliminar')
const modal = new bootstrap.Modal(modalE);
let idEliminar=null

async function cargarMedicos() {
    try{
        const response = await fetch('../data/profesionales.json')
        const data = await response.json()
        profesionales.push(...data.profesionales);
        creartabla();
    } catch (e){
        console.error(e);
    }
}

function creartabla(){
    let tr=''
    profesionales.forEach(medico =>{
        console.log(medico.id)
        tr+=`<tr>
                            <td>${medico.nombre}</td>
                            <td>${medico.matricula}</td>
                            <td>${medico.especialidad}</td>
                            <td>${medico.description}</td>
                            <td>${medico.OS.join(', ')}</td>
                            <td>${medico.valorConsulta}</td>
                            <td><button class="btn btn-outline-danger" onclick="Eliminar('${medico.id}')">Eliminar</button></td>
                            <td><button class="btn btn-outline-success" onclick="Modificar('${medico.id}')">Modificar</button></td>
                        </tr>`
    })
    tabla.innerHTML=tr
}

document.getElementById('aceptar').addEventListener('click', function() {
    if (idEliminar !== null){
        const index = profesionales.findIndex(medico => medico.id === idEliminar)
        if (index !== -1) {
            profesionales.splice(index, 1);
            guardarProfesionales(profesionales)
            creartabla();
            modal.hide();
        }
        idEliminar = null
    }
});

function Eliminar(id) {
    idEliminar = id
    modal.show();
}

function Modificar(id) {
    medicoEditando = profesionales.find(medico => medico.id === id);
    
    if (medicoEditando) {
        document.getElementById('nombre').value = medicoEditando.nombre;
        document.getElementById('matricula').value = medicoEditando.matricula;
        document.getElementById('especialidad').value = medicoEditando.especialidad;
        document.getElementById('description').value = medicoEditando.description;
        document.getElementById('valorConsulta').value = medicoEditando.valorConsulta;
        
        const checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = medicoEditando.OS.includes(checkbox.value);
        });
        
        document.querySelector('button[type="submit"]').textContent = 'Actualizar';
        
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    }
}

function guardarMedico(e){
    e.preventDefault();

    const nom = document.getElementById('nombre').value;
    const mat = document.getElementById('matricula').value;
    const esp = document.getElementById('especialidad').value;
    const desc = document.getElementById('description').value;
    const OS = document.querySelectorAll('.form-check-input[type="checkbox"]');
    const valor = document.getElementById('valorConsulta').value;

    const osSeleccionadas = [];
    OS.forEach(cb => {
        if (cb.checked) {
            osSeleccionadas.push(cb.value);
        }
    }); 

    if (medicoEditando) {
        medicoEditando.nombre = nom;
        medicoEditando.matricula = mat;
        medicoEditando.especialidad = esp;
        medicoEditando.description = desc;
        medicoEditando.OS = osSeleccionadas;
        medicoEditando.valorConsulta = valor;
        
        medicoEditando = null;
        document.querySelector('button[type="submit"]').textContent = 'Guardar';
    } else {
        const nuevoMedico = {
            id: String(profesionales.length + 1),
            nombre: nom,
            matricula: mat,
            especialidad: esp,
            description: desc,
            OS: osSeleccionadas,
            valorConsulta: valor
        };
        profesionales.push(nuevoMedico);
    }
    guardarProfesionales(profesionales)
    creartabla();
    document.getElementById('formMedico').reset();
    alert(medicoEditando ? 'Médico actualizado correctamente' : 'Médico agregado correctamente');
}

function limpiarFormulario() {
    document.getElementById('formMedico').reset();
    medicoEditando = null;
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
}

document.getElementById('formMedico').addEventListener('submit', guardarMedico)
document.addEventListener('DOMContentLoaded', cargarMedicos)