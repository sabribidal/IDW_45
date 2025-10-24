import { cliente, admin } from './usuarios.js';

function validarUsuario(event){
    event.preventDefault();
    
    const usuarioIng = document.getElementById('floatingInput').value;
    const contrasenaUsua = document.getElementById('floatingPassword').value;
    const mensaje = document.querySelector('#mensaje');
    const carga = document.querySelector('#carga')

    if((usuarioIng === cliente.Usuario) && (contrasenaUsua === cliente.Password)){
        mensaje.className = 'text-success p-3 mb-2 bg-success-subtle fs-3 text-center';
        mensaje.textContent = 'Bienvenido Cliente'; 
        carga.innerHTML=`<button class="btn btn-info" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            <span role="status">Espere unos segundos...</span>
                            </button>`
        
        localStorage.setItem('sesion', JSON.stringify({
            tipo:'cliente',
            usuario:usuarioIng,
            tiempo: new Date().getTime()
        }));

        setTimeout(() => {

            window.location.href = '../Institucion/equipo_medico.html';
        }, 2000);
    } else if((usuarioIng === admin.Usuario) && (contrasenaUsua === admin.Password)){
        mensaje.className = 'text-success p-3 mb-2 bg-success-subtle fs-3 text-center';
        mensaje.textContent = 'Bienvenido Administrador';
        carga.innerHTML=`<button class="btn btn-info" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            <span role="status">Espere unos segundos...</span>
                        </button>`
        
                localStorage.setItem('sesion', JSON.stringify({
            tipo:'admin',
            usuario:usuarioIng,
            tiempo: new Date().getTime()
        }));

        setTimeout(() => {
            window.location.href = '../form_medicos.html';
        }, 2000);
    } else {
        mensaje.className = 'p-3 mb-2 bg-danger-subtle text-danger-emphasis';
        mensaje.textContent = 'Usuario o Contraseña incorrectos, intente nuevamente';
    }
}

function mostrarBotonCerrar(){
    const boton = document.getElementById('btnCerrarSesion');
    const sesion = localStorage.getItem('sesion');

    if (boton){
        if(sesion){
            boton.style.display='block';
        } else {
            boton.style.display='none'
        }
    }
}

function verificarSesion() {
    const sesion = localStorage.getItem('sesionUsuario');
    if (sesion) {
        const datos = JSON.parse(sesion);
        // Redirigir según el tipo de usuario
        if (datos.tipo === 'admin') {
            window.location.href = '../form_medicos.html';
        } else if (datos.tipo === 'cliente') {
            window.location.href = '../Institucion/equipo_medico.html';
        }
    }
}

function cerrarSesion(){
    localStorage.removeItem('sesion');
    window.location.href='../index.html';
}


// document.getElementById('form_inicio').addEventListener('submit', validarUsuario);
document.addEventListener('DOMContentLoaded', () =>{
    const formInicio = document.getElementById('form_inicio');
    if (formInicio){
        formInicio.addEventListener('submit', validarUsuario);
    }
    const Cerrarusuarios = document.getElementById('btnCerrarSesion');
    if (Cerrarusuarios){
        Cerrarusuarios.addEventListener('click', cerrarSesion)
    }
    mostrarBotonCerrar();
});


export {cerrarSesion, mostrarBotonCerrar}