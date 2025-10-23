import { cliente, admin } from './usuarios.js';

function validarUsuario(event){
    event.preventDefault();
    
    const usuarioIng = document.getElementById('floatingInput').value;
    const contrasenaUsua = document.getElementById('floatingPassword').value;
    const mensaje = document.querySelector('#mensaje');

    if((usuarioIng === cliente.Usuario) && (contrasenaUsua === cliente.Password)){
        mensaje.className = 'text-success p-3 mb-2 bg-success-subtle';
        mensaje.textContent = 'Bienvenido Cliente'; 
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    } else if((usuarioIng === admin.Usuario) && (contrasenaUsua === admin.Password)){
        mensaje.className = 'text-success p-3 mb-2 bg-success-subtle';
        mensaje.textContent = 'Bienvenido Administrador';
        
        setTimeout(() => {
            window.location.href = '../form_medicos.html';
        }, 2000);
    } else {
        mensaje.className = 'p-3 mb-2 bg-danger-subtle text-danger-emphasis';
        mensaje.textContent = 'Usuario o Contraseña incorrectos, intente nuevamente';
    }
}

document.getElementById('form_inicio').addEventListener('submit', validarUsuario);