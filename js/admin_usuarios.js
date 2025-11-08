const API_URL = 'https://dummyjson.com/users';

function verificarSesion() {
    const sesion = localStorage.getItem('sesion');
    
    if (!sesion) {
        alert('Debe iniciar sesión para acceder a esta página');
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const datosSesion = JSON.parse(sesion);
        
        if (datosSesion.tipo !== 'admin') {
            alert('No tiene permisos para acceder a esta página');
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        window.location.href = 'login.html';
        return false;
    }
}

async function obtenerUsuarios() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }
        
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function crearFilaUsuario(usuario) {
    const tr = document.createElement('tr');
    
    const generoES = usuario.gender === 'male' ? 'Masculino' : 'Femenino';
    
    const rolES = usuario.role === 'admin' ? 'Administrador' : 'Usuario';
    
    const ubicacion = `${usuario.address.city}, ${usuario.address.country}`;
    
    tr.innerHTML = `
        <td>${usuario.firstName} ${usuario.lastName}</td>
        <td>${usuario.email}</td>
        <td>${usuario.phone}</td>
        <td>${usuario.age}</td>
        <td>${generoES}</td>
        <td>${ubicacion}</td>
        <td>
            <span class="badge ${usuario.role === 'admin' ? 'bg-success' : 'bg-secondary'}">
                ${rolES}
            </span>
        </td>
    `;
    
    return tr;
}

function mostrarUsuarios(usuarios) {
    const tablaBody = document.getElementById('tablaUsuarios');
    const loading = document.getElementById('loading');
    const tablaContainer = document.getElementById('tablaContainer');
    const totalUsuarios = document.getElementById('totalUsuarios');
    
    tablaBody.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const fila = crearFilaUsuario(usuario);
        tablaBody.appendChild(fila);
    });
    
    totalUsuarios.textContent = usuarios.length;
    
    loading.classList.add('d-none');
    tablaContainer.classList.remove('d-none');
}

function mostrarError() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    
    loading.classList.add('d-none');
    errorMessage.classList.remove('d-none');
}

async function inicializar() {
    if (!verificarSesion()) {
        return;
    }
    
    try {
        const usuarios = await obtenerUsuarios();
        
        mostrarUsuarios(usuarios);
    } catch (error) {
        mostrarError();
    }
}

document.addEventListener('DOMContentLoaded', inicializar);