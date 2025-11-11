let fechaActual = new Date();
let diaSeleccionado = null;
let turnos = [];

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const diasSemanaCorto = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


function cargarTurnos() {
    const turnosJson = localStorage.getItem('turnos');
    turnos = turnosJson ? JSON.parse(turnosJson) : [];
}

// Obtener turnos para una fecha específica
function obtenerTurnosPorFecha(fecha) {
    const fechaStr = fecha.toISOString().split('T')[0];
    return turnos.filter(turno => turno.fecha === fechaStr)
                .sort((a, b) => a.hora.localeCompare(b.hora));
}

function obtenerInicioSemana(fecha) {
    const dia = new Date(fecha);
    const diaSemana = dia.getDay();
    const diff = dia.getDate() - diaSemana;
    return new Date(dia.setDate(diff));
}

function renderizarSemana() {
    const inicioSemana = obtenerInicioSemana(fechaActual);
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(finSemana.getDate() + 6);
    
    document.getElementById('tituloSemana').textContent = 
        `Semana del ${inicioSemana.getDate()} al ${finSemana.getDate()}`;
    
    document.getElementById('rangoFechas').textContent = 
        `${meses[inicioSemana.getMonth()]} ${inicioSemana.getFullYear()}`;
    
    const grid = document.getElementById('semanaGrid');
    grid.innerHTML = '';
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(dia.getDate() + i);
        
        const esHoy = dia.getTime() === hoy.getTime();
        const esSeleccionado = diaSeleccionado && dia.getTime() === diaSeleccionado.getTime();
        
        const turnosDia = obtenerTurnosPorFecha(dia);
        const cantidadTurnos = turnosDia.length;
        
        const diaCard = document.createElement('div');
        diaCard.className = `dia-card ${esHoy ? 'hoy' : ''} ${esSeleccionado ? 'seleccionado' : ''}`;
        diaCard.onclick = () => seleccionarDia(dia);
        
        let turnosHTML = '';
        if (cantidadTurnos > 0) {
            turnosHTML = '<div class="turnos-lista">';
            turnosDia.slice(0, 3).forEach(turno => {
                turnosHTML += `<div class="turno-item">${turno.hora} - ${turno.nombre}</div>`;
            });
            if (cantidadTurnos > 3) {
                turnosHTML += `<div class="turno-item">+${cantidadTurnos - 3} más...</div>`;
            }
            turnosHTML += '</div>';
        }
        
        diaCard.innerHTML = `
            <div class="dia-nombre">${diasSemanaCorto[dia.getDay()]}</div>
            <div class="dia-numero">${dia.getDate()}</div>
            <div class="dia-mes">${meses[dia.getMonth()].substring(0, 3)}</div>
            <div class="turnos-count">${cantidadTurnos} turno${cantidadTurnos !== 1 ? 's' : ''}</div>
            ${turnosHTML}
        `;
        
        grid.appendChild(diaCard);
    }
}

function seleccionarDia(fecha) {
    diaSeleccionado = fecha;
    renderizarSemana();
    mostrarDetalleTurnos(fecha);
}

function mostrarDetalleTurnos(fecha) {
    const turnosDia = obtenerTurnosPorFecha(fecha);
    const detalle = document.getElementById('detalleTurnos');
    
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    
    if (turnosDia.length === 0) {
        detalle.innerHTML = `
            <h3>${fechaFormateada}</h3>
            <div class="sin-turnos">
                <p>No hay turnos programados para este día</p>
            </div>
        `;
        return;
    }
    
    let turnosHTML = `<h3>${fechaFormateada} - ${turnosDia.length} turno${turnosDia.length !== 1 ? 's' : ''}</h3>`;
    
    turnosDia.forEach(turno => {
        turnosHTML += `
            <div class="turno-detalle-card">
                <div class="turno-hora">${turno.hora}</div>
                <div class="turno-paciente">Paciente: ${turno.nombre}</div>
                <div class="turno-medico">Médico: ${turno.medico}</div>
                <div class="turno-tipo">Normal/Obra Social: ${turno.tipo}</div>
            </div>
        `;
    });
    
    detalle.innerHTML = turnosHTML;
}

function cambiarSemana(direccion) {
    fechaActual.setDate(fechaActual.getDate() + (direccion * 7));
    renderizarSemana();
}

function irHoy() {
    fechaActual = new Date();
    diaSeleccionado = null;
    renderizarSemana();
}

window.addEventListener('DOMContentLoaded', function() {
    cargarTurnos();
    renderizarSemana();
});

window.addEventListener('storage', function(e) {
    if (e.key === 'turnos') {
        cargarTurnos();
        renderizarSemana();
        if (diaSeleccionado) {
            mostrarDetalleTurnos(diaSeleccionado);
        }
    }
});