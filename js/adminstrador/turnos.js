let form = document.getElementById('fromturno')
let tabla = document.getElementById('turno')
let incorrecto = document.getElementById('incorrecto')
let frases = document.getElementById('alertaCampos')
const modalE = document.querySelector('#modalEliminar')
const modal = new bootstrap.Modal(modalE);
let turnoEditado=null
let idEliminar=null
let turnos=cargarTurno();

function cargarTurno(){
    const turnoJson=localStorage.getItem('turnos')
    return turnoJson ? JSON.parse(turnoJson):[]
}

function guardarLocalStorage(turnos){
    localStorage.setItem('turnos', JSON.stringify(turnos))
}

function guardarTurno(e){
    e.preventDefault();

    const paciente=document.getElementById('nombre').value.toUpperCase()
    const select=document.getElementById('seleccion')
    let medico = select.options[select.selectedIndex].text||'';
    let medValue=select.value
    const dia=document.getElementById('dia').value
    const hora=document.getElementById('hora').value
    const consulta=document.getElementById('obraSocial').value

    if (paciente === '' || medValue === '' || dia === '' || hora === '' || consulta === '') {
        incorrecto.style.display='inline'
        setTimeout(()=>{
            incorrecto.style.display='none'
        }, 4000);
        return
    }

    const fechaTurno=new Date(dia);
    const fechaHoy=new Date();
    fechaHoy.setHours(0,0,0,0)

    if(fechaTurno<fechaHoy){
        incorrecto.style.display='inline'
        frases.textContent='La fecha del turno debe ser posterior a hoy'
        setTimeout(()=>{
            incorrecto.style.display='none'
        }, 4000);
        return
    }

    if(turnoEditado){
        turnoEditado.nombre=paciente
        turnoEditado.medico=medico
        turnoEditado.medValue=medValue
        turnoEditado.fecha=dia
        turnoEditado.hora=hora
        turnoEditado.tipo=consulta
        alert('Turno actualizado')
        turnoEditado=null
        document.querySelector('button[type="submit"]').textContent = 'Guardar';
    } else{
        const nuevoTurno={
            id:String(turnos.length+1),
            nombre:paciente,
            medico:medico,
            medValue:medValue,
            fecha:dia,
            hora:hora,
            tipo:consulta
    }
    turnos.push(nuevoTurno);
    alert('Turno agregado') 
    }

    guardarLocalStorage(turnos)
    creartabla()
    form.reset();
}

async function creartabla(){
    let tr=''
    const medicos = await obtenerTodosmedicos()

    turnos.forEach(tur=>{
        const medicoData = medicos.find(m=>m.id === tur.medValue);

        let precio=0;
        let descuento=0;
        let precioDescuento=0;

        if (medicoData&&medicoData.OS){
            const tieneOS=medicoData.OS.some(os=> os.toLowerCase() === tur.tipo.toLowerCase())
            if(tieneOS){
                precio=medicoData.valorConsulta||100;
                descuento=precio*0.30;
                precioDescuento = precio-descuento;
            }
        }

        tr+=`<tr>
                <td class="fs-6">${tur.medico}</td>
                <td class="fs-6">${tur.nombre}</td>
                <td class="fs-6">${tur.tipo}</td>
                <td class="fs-6">${tur.fecha} - ${tur.hora}</td>
                <td>
                    ${precioDescuento > 0 ? 
                        `<span class="badge bg-success fs-6">$${precioDescuento.toFixed(2)} (30% desc.)</span>` 
                        : `<span class="badge bg-secondary fs-6">$${medicoData.valorConsulta.toFixed(2)}</span>`
                    }
                </td>
                <td>
                    <button class="btn btn-outline-danger" onclick="Eliminar('${tur.id}')">Eliminar</button>
                    <button class="btn btn-outline-success" onclick="Modificar('${tur.id}')">Modificar</button>
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
    if(idEliminar!==null){
        const index=turnos.findIndex(turno=>turno.id===idEliminar)
        if(index!==-1){
            turnos.splice(index,1);
            guardarLocalStorage(turnos)
            creartabla()
            modal.hide()
        }
        idEliminar=null
    }
})

function Modificar(id){
    turnoEditado=turnos.find(turno=>turno.id===id);
    if(!turnoEditado) return

    document.getElementById('nombre').value=turnoEditado.nombre||''
    document.getElementById('seleccion').value=turnoEditado.medValue||''
    console.log('medValue a asignar:', turnoEditado.medValue); 
    document.getElementById('dia').value=turnoEditado.fecha||''
    document.getElementById('hora').value=turnoEditado.hora||''
    document.getElementById('obraSocial').value=turnoEditado.tipo||''

    const btnSubmit = document.querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.textContent = 'Actualizar';

    if(form) form.scrollIntoView({behavior: 'smooth'});
}

function obtenerMedicosLocalStorage(){
    const medicosLS = localStorage.getItem('profesionales')
    if (!medicosLS) return [];
    const parsed = JSON.parse(medicosLS)

    if(parsed.profesionales&&Array.isArray(parsed.profesionales)){
        return parsed.profesionales
    }
    
}

async function cargarMedicosJSON() {
    try {
        const response = await fetch('/data/profesionales.json')
        const data = await response.json();
        return data.profesionales || [];
    } catch (error){
        console.error('Error al cargar profesionales', error)
        return []
    }
}

async function obtenerTodosmedicos(){
    const medicoJSON = await cargarMedicosJSON();
    const medicosLS = obtenerMedicosLocalStorage();

    return [...medicoJSON, ...medicosLS]
}

async function cargarSelect(){
    const select = document.getElementById('seleccion');
    const medicos = await obtenerTodosmedicos();

    medicos.forEach(med=>{
        const option = document.createElement('option')
        option.value=med.id;
        option.textContent=`${med.nombre} - ${med.especialidad}`;
        option.dataset.med=JSON.stringify(med);
        select.appendChild(option)
    })
}

function limpiarFormulario(){
    form.reset()
    turnoEditado=null
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
}

// Inicializar al cargar la página
window.addEventListener('DOMContentLoaded', function() {
    cargarSelect();
    creartabla();
});

// Hacer las funciones globales para que puedan ser llamadas desde el HTML
window.limpiarFormulario = limpiarFormulario;
//window.eliminarTurno = eliminarTurno;
form.addEventListener('submit', guardarTurno)