let form=document.getElementById('formObra');
let tabla=document.getElementById('obra')
let incorrecto=document.getElementById('incorrecto');
const modalE = document.querySelector('#modalEliminar')
const modal = new bootstrap.Modal(modalE);
let obraSocialEditada=null
let idEliminar=null
let obraSociales=cargarObrasociales();

function cargarObrasociales(){
    const obrasJson=localStorage.getItem('obras sociales')
    return obrasJson ? JSON.parse(obrasJson):[]
}

function guardarLocalStorage(obraSociales){
    localStorage.setItem('obras sociales', JSON.stringify(obraSociales))
}

function guardarObrasocial(e){
    e.preventDefault();

    let obra=document.getElementById('nombre').value
    let descripcion=document.getElementById('description').value
    let mayus=obra.toUpperCase()

    if(obra===''||descripcion===''){
        incorrecto.style.display='inline'
        setTimeout(()=>{
            incorrecto.style.display='none'
        }, 4000); 
        return;
    }

    if(obraSocialEditada){
        obraSocialEditada.obraSocial=mayus
        obraSocialEditada.descripcion=descripcion
        alert('Obra Social actualizada correctamente')
        obraSocialEditada=null
        document.querySelector('button[type="submit"]').textContent = 'Guardar';
    } else {
        const nuevaObraSocial={
            id:String(obraSociales.length+1),
            obraSocial:mayus,
            descripcion:descripcion
        }
        obraSociales.push(nuevaObraSocial);
        alert('Obra Social agregada correctamente')
    }

    guardarLocalStorage(obraSociales)
    creartabla()
    form.reset();
}

function creartabla(){
    let tr=''
    obraSociales.forEach(obra => {
        tr+=`<tr>
                <td>${obra.id}</td>
                <td>${obra.obraSocial}</td>
                <td>${obra.descripcion}</td>
                <td>
                    <button class="btn btn-outline-danger" onclick="Eliminar('${obra.id}')">Eliminar</button>
                    <button class="btn btn-outline-success" onclick="Modificar('${obra.id}')">Modificar</button>
                </td>
            </tr>`
    });

    tabla.innerHTML=tr
}

function Eliminar(id){
    idEliminar=id;
    modal.show();
}

document.getElementById('aceptar').addEventListener('click', function(){
    if(idEliminar!==null){
        const index = obraSociales.findIndex(obra=>obra.id===idEliminar);
        if(index!==-1){
            obraSociales.splice(index,1);
            guardarLocalStorage(obraSociales)
            creartabla();
            modal.hide();
        }
        idEliminar=null
    }
})

function Modificar(id){
    obraSocialEditada=obraSociales.find(obra => obra.id===id);
    if(!obraSocialEditada) return

    document.getElementById('nombre').value=obraSocialEditada.obraSocial||'';
    document.getElementById('description').value=obraSocialEditada.descripcion||'';

        const btnSubmit = document.querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.textContent = 'Actualizar';

    if(form) form.scrollIntoView({behavior: 'smooth'});
}


function limpiarFormulario(){
    form.reset()
    obraSocialEditada=null
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
}

form.addEventListener('submit', guardarObrasocial)

creartabla();
