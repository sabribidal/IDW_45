async function buscarRolUsuario(idusuario){
    try {
        const response = await fetch(`https://dummyjson.com/users/${idusuario}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },            
        });
        const data = await response.json();
        console.log(data);
        return data.role || 'admin'; // Asignar rol si está disponible
    } catch (error) {
        console.error('Error al buscar el rol del usuario:', error);
        return 'cliente'; // Valor por defecto en caso de error
    }
}

async function validarUsuario(event){
    event.preventDefault();
    
    const usuarioIng = document.getElementById('floatingInput').value;
    const contrasenaUsua = document.getElementById('floatingPassword').value;
    const mensaje = document.querySelector('#mensaje');

    try {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usuarioIng,
                password: contrasenaUsua,
                expiresInMins: 30,
            }),
           // credentials: 'include'
        });
        
        const data = await response.json();
        console.log(data);

        //if (response.ok && data.token) 
        if (response.ok) {
            const idusuario = data.id;
            const rol = await buscarRolUsuario(idusuario);

            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('token', data.accessToken);
            sessionStorage.setItem('idusuario', data.id);
            sessionStorage.setItem('rol', rol || 'admin'); // Asignar rol si está disponible
            

            mensaje.className = 'text-success p-3 mb-2 bg-success-subtle';
            mensaje.textContent = `Bienvenido ${data.username}`;

            localStorage.setItem('sesion', JSON.stringify({
                    tipo: rol || 'admin',
                    usuario:usuarioIng,
                    tiempo: new Date().getTime()
            }));

            // Redirigir según el rol del usuario
            if (rol === 'admin') {
                setTimeout(() => {
                    window.location.href = './form_medicos.html';
                }, 2000);
            } else {
                setTimeout(() => {
                    window.location.href = './Institucion/equipo_medico.html';
                }, 2000);   
            }
            
            console.log('Login exitoso:');
            return {
                success: true,
                message: 'Login exitoso',
                id: data.id,
                usuario: data.username,
                nombre: data.firstName,
                apellido: data.lastName,
                token: data.accessToken,
                role: rol
            };
        } else {
            mensaje.className = 'p-3 mb-2 bg-danger-subtle text-danger-emphasis';
            mensaje.textContent = 'Usuario o Contraseña incorrectos, intente nuevamente';
            console.error('Error de login:', data);
            return {
                success: false,
            };
        }
    } catch (error) {
        mensaje.className = 'p-3 mb-2 bg-danger-subtle text-danger-emphasis';
        mensaje.textContent = 'Usuario o Contraseña incorrectos, intente nuevamente';
        console.error('Error de login:', error);
        return {
            success: false,
        };
    }   
}

function cerrarSesionLogin(){
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('idusuario');
    localStorage.removeItem('sesion');
    window.location.href='../index.html';
}

export {cerrarSesionLogin}

// document.getElementById('form_inicio').addEventListener('submit', validarUsuario);
document.addEventListener('DOMContentLoaded', () =>{
    const formInicio = document.getElementById('form_inicio');
    if (formInicio){
        formInicio.addEventListener('submit', validarUsuario);
    }
    const Cerrarusuarios = document.getElementById('btnCerrarSesion');
    if (Cerrarusuarios){
        Cerrarusuarios.addEventListener('click', cerrarSesionLogin)
    }
});