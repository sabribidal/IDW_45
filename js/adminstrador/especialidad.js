let form=document.getElementById('formEspecialidad');
let tabla=document.getElementById('espec')
let incorrecto=document.getElementById('incorrecto');
const modalE = document.querySelector('#modalEliminar')
const modal = new bootstrap.Modal(modalE);
let especialidadEditada=null
let idEliminar=null
let especialidades=cargarEspecialidades();

function cargarEspecialidades(){
    const especialidadJson = localStorage.getItem('especialidades')
    return especialidadJson ? JSON.parse(especialidadJson) : []
}

function guardarLocalStorage(especialidades){
    localStorage.setItem('especialidades', JSON.stringify(especialidades))
}

function guardarEspecialidad(e){
    e.preventDefault();

    let especialidad=document.getElementById('nombre').value
    let descripcion=document.getElementById('description').value
    let mayus=especialidad.toUpperCase()

    if(especialidad==='' && descripcion===''){
        incorrecto.style.display='inline'
        setTimeout(() => {
            incorrecto.style.display='none'
        }, 4000);
        return;
    }

    if (especialidadEditada){
        especialidadEditada.especialidad=mayus
        especialidadEditada.descripcion=descripcion
        alert('Especialidad actualizada correctamente')
        especialidadEditada = null
        document.querySelector('button[type="submit"]').textContent = 'Guardar';
    } else {
        const nuevaEspecialidad={
            id:String(especialidades.length+1),
            especialidad:mayus,
            descripcion:descripcion
        }
        especialidades.push(nuevaEspecialidad);
        alert('Especialidad agregada correctamente')
    }

    guardarLocalStorage(especialidades);

    creartabla()
    form.reset();
    
}

function creartabla(){
    let tr=''
    especialidades.forEach(esp =>{
        console.log(especialidades)
        tr+=            `<tr>
                            <td>${esp.id}</td>
                            <td>${esp.especialidad}</td>
                            <td>${esp.descripcion}</td>
                            <td>
                                <button class="btn btn-outline-danger" onclick="Eliminar('${esp.id}')">Eliminar</button>
                                <button class="btn btn-outline-success" onclick="Modificar('${esp.id}')">Modificar</button>
                            </td>
                        </tr>`
    })
    
    tabla.innerHTML=tr
}

function Eliminar(id){
    idEliminar=id;
    modal.show();
}

document.getElementById('aceptar').addEventListener('click', function(){
    if (idEliminar!==null){
        const index = especialidades.findIndex(esp => esp.id === idEliminar);
        if (index !== -1){
            especialidades.splice(index, 1);
            guardarLocalStorage(especialidades)
            creartabla();
            modal.hide();
        }
        idEliminar=null
    }
})

function Modificar(id){
    especialidadEditada = especialidades.find(esp => esp.id === id);
    if (!especialidadEditada) return

    document.getElementById('nombre').value = especialidadEditada.especialidad || '';
    document.getElementById('description').value = especialidadEditada.descripcion || '';

    const btnSubmit = document.querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.textContent = 'Actualizar';

    if(form) form.scrollIntoView({behavior: 'smooth'});
}

function limpiarFormulario(){
    form.reset()
    especialidadEditada=null
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
}

form.addEventListener('submit', guardarEspecialidad)

creartabla();