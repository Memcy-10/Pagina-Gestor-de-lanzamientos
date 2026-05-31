// =============================================================================
//  🚀  SPACEX FLIGHT CONTROL CENTER
// =============================================================================


// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 1 — ALMACÉN DE DATOS
// ─────────────────────────────────────────────────────────────────────────────

// Array principal donde se guardan todos los lanzamientos.
// Cada lanzamiento será un objeto con propiedades:
// id, nombre, tipo, fecha, objetivo y estado.
let lanzamientos = [];

// Variable que guarda el filtro actualmente activo.
// Por defecto se muestran todos los lanzamientos.
let filtroActivo = "todos";



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 2 — FUNCIONES UTILITARIAS
// ─────────────────────────────────────────────────────────────────────────────


// Genera un ID único usando la fecha actual en milisegundos.
// Ejemplo: SPX-175391391391
function generarID() {

    return "SPX-" + Date.now();
}


// Convierte una fecha a un formato más legible para mostrarla
// dentro de las tarjetas.
function formatearFecha(fecha) {

    // Creamos un objeto Date con la fecha recibida.
    const nuevaFecha = new Date(fecha);

    // Retornamos la fecha formateada.
    return nuevaFecha.toLocaleString("es-CO", {

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"

    });
}



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 3 — RENDERIZADO DE TARJETAS
// ─────────────────────────────────────────────────────────────────────────────


// Esta función dibuja todas las tarjetas en pantalla.
function renderizarTarjetas() {

    // Contenedor principal donde van las tarjetas.
    const grid = document.getElementById("grid-lanzamientos");

    // Estado vacío que aparece cuando no hay registros.
    const estadoVacio = document.getElementById("estado-vacio");

    // Texto que muestra cuántos registros son visibles.
    const contadorVisibles = document.getElementById("contador-visibles");

    // Contador de vuelos activos de la barra superior.
    const contadorLanzamientos = document.getElementById("contador-lanzamientos");


    // Limpiamos el grid para volver a renderizar todo.
    grid.innerHTML = "";

    // Contador de tarjetas visibles.
    let visibles = 0;


    // Si no existen lanzamientos mostramos el estado vacío.
    if (lanzamientos.length === 0) {

        grid.appendChild(estadoVacio);

        contadorVisibles.textContent = "0 REGISTROS";

        contadorLanzamientos.textContent = "0";

        return;
    }


    // Recorremos todos los lanzamientos.
    lanzamientos.forEach((lanzamiento) => {


        // Si el filtro activo NO coincide con el estado
        // ignoramos esa tarjeta.
        if (
            filtroActivo !== "todos" &&
            lanzamiento.estado !== filtroActivo
        ) {
            return;
        }

        visibles++;


        // Creamos la tarjeta.
        const tarjeta = document.createElement("article");


        // Asignamos clases CSS dinámicamente.
        tarjeta.className =
            `organism-launch-card organism-launch-card--${lanzamiento.estado}`;


        // Guardamos información en atributos data.
        tarjeta.dataset.id = lanzamiento.id;
        tarjeta.dataset.tipo = lanzamiento.tipo;
        tarjeta.dataset.estado = lanzamiento.estado;


        // Estructura HTML interna de la tarjeta.
        tarjeta.innerHTML = `

            <div class="molecule-card-header">

                <span class="molecule-card-header__id atom-mono">
                    ${lanzamiento.id}
                </span>

                <span class="atom-badge atom-badge--${lanzamiento.estado}">
                    ${lanzamiento.estado.toUpperCase()}
                </span>

            </div>


            <div class="molecule-card-body">

                <div class="molecule-card-body__name">
                    ${lanzamiento.nombre}
                </div>

                <div class="molecule-card-body__type">
                    ${lanzamiento.tipo}
                </div>

                <div class="molecule-card-body__objective">
                    ${lanzamiento.objetivo}
                </div>

                <div class="molecule-card-body__date atom-mono">
                    ${formatearFecha(lanzamiento.fecha)}
                </div>

            </div>


            <div class="molecule-card-footer">

                <button
                    class="atom-btn atom-btn--secondary atom-btn--sm"
                    data-action="editar"
                    data-id="${lanzamiento.id}"
                >
                    EDITAR
                </button>


                <button
                    class="atom-btn atom-btn--danger atom-btn--sm"
                    data-action="cancelar"
                    data-id="${lanzamiento.id}"
                >
                    CANCELAR
                </button>

            </div>
        `;


        // Activamos animaciones hover.
        activarHover(tarjeta);


        // Escuchamos clicks dentro de la tarjeta.
        tarjeta.addEventListener("click", manejarAccionesTarjeta);


        // Insertamos la tarjeta en el grid.
        grid.appendChild(tarjeta);
    });


    // Si no hay tarjetas visibles por el filtro,
    // mostramos el estado vacío.
    if (visibles === 0) {

        grid.appendChild(estadoVacio);
    }


    // Actualizamos contadores.
    contadorVisibles.textContent = `${visibles} REGISTROS`;

    contadorLanzamientos.textContent = lanzamientos.length;
}




// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 4 — ANIMACIONES DE TARJETAS (HOVER)
// ─────────────────────────────────────────────────────────────────────────────


// Activa una animación cuando el mouse entra o sale.
function activarHover(tarjeta) {


    // Cuando el mouse entra.
    tarjeta.addEventListener("mouseover", () => {

        tarjeta.classList.add("hover-active");
    });


    // Cuando el mouse sale.
    tarjeta.addEventListener("mouseout", () => {

        tarjeta.classList.remove("hover-active");
    });
}




// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 5 — FORMULARIO: REGISTRO Y EDICIÓN
// ─────────────────────────────────────────────────────────────────────────────


// Maneja el submit del formulario.
function manejarFormulario(event) {

    // Evita que el formulario recargue la página.
    event.preventDefault();


    // Capturamos valores de los inputs.
    const nombre =
        document.getElementById("input-nombre-serie").value.trim();

    const tipo =
        document.getElementById("select-tipo-cohete").value;

    const fecha =
        document.getElementById("input-fecha-lanzamiento").value;

    const objetivo =
        document.getElementById("input-objetivo-mision").value.trim();

    const idEdicion =
        document.getElementById("input-id-edicion").value;


    // Validamos campos vacíos.
    if (!nombre || !tipo || !fecha || !objetivo) {

        alert("Todos los campos son obligatorios");

        return;
    }


    // Si existe un ID significa que estamos editando.
    if (idEdicion) {


        // Buscamos el lanzamiento.
        const lanzamiento =
            lanzamientos.find(l => l.id === idEdicion);


        // Actualizamos propiedades.
        lanzamiento.nombre = nombre;

        lanzamiento.tipo = tipo;

        lanzamiento.fecha = fecha;

        lanzamiento.objetivo = objetivo;


        // Salimos del modo edición.
        salirModoEdicion();

    } else {


        // Creamos un nuevo objeto lanzamiento.
        const nuevoLanzamiento = {

            id: generarID(),

            nombre,

            tipo,

            fecha,

            objetivo,

            estado: "pendiente"
        };


        // Lo agregamos al array.
        lanzamientos.push(nuevoLanzamiento);
    }


    // Limpiamos el formulario.
    document.getElementById("form-lanzamiento").reset();


    // Actualizamos la interfaz.
    renderizarTarjetas();

    actualizarEstadisticas();
}




// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 6 — CAMBIOS DE ESTADO
// ─────────────────────────────────────────────────────────────────────────────


// Detecta qué botón fue presionado dentro de una tarjeta.
function manejarAccionesTarjeta(event) {

    // Acción almacenada en data-action.
    const accion = event.target.dataset.action;

    // ID almacenado en data-id.
    const id = event.target.dataset.id;


    // Si no se hizo click en un botón salimos.
    if (!accion) return;


    // Si se presionó editar.
    if (accion === "editar") {

        cargarModoEdicion(id);
    }


    // Si se presionó cancelar.
    if (accion === "cancelar") {

        cancelarLanzamiento(id);
    }
}


// Carga la información de un lanzamiento en el formulario.
function cargarModoEdicion(id) {

    // Buscamos el lanzamiento.
    const lanzamiento =
        lanzamientos.find(l => l.id === id);


    // Insertamos valores en inputs.
    document.getElementById("input-nombre-serie").value =
        lanzamiento.nombre;

    document.getElementById("select-tipo-cohete").value =
        lanzamiento.tipo;

    document.getElementById("input-fecha-lanzamiento").value =
        lanzamiento.fecha;

    document.getElementById("input-objetivo-mision").value =
        lanzamiento.objetivo;


    // Guardamos el ID del registro editado.
    document.getElementById("input-id-edicion").value =
        lanzamiento.id;


    // Mostramos botón cancelar edición.
    document.getElementById("btn-cancelar-edicion").style.display =
        "block";


    // Cambiamos texto del botón principal.
    document.getElementById("btn-registrar").textContent =
        "GUARDAR CAMBIOS";
}


// Sale del modo edición.
function salirModoEdicion() {

    // Limpiamos ID oculto.
    document.getElementById("input-id-edicion").value = "";


    // Ocultamos botón cancelar.
    document.getElementById("btn-cancelar-edicion").style.display =
        "none";


    // Restauramos texto original.
    document.getElementById("btn-registrar").innerHTML =
        "▶ REGISTRAR LANZAMIENTO";


    // Limpiamos formulario.
    document.getElementById("form-lanzamiento").reset();
}


// Cambia el estado de un lanzamiento a cancelado.
function cancelarLanzamiento(id) {

    const lanzamiento =
        lanzamientos.find(l => l.id === id);


    lanzamiento.estado = "cancelado";


    renderizarTarjetas();

    actualizarEstadisticas();
}




// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 7 — FILTRADO POR ESTADO
// ─────────────────────────────────────────────────────────────────────────────


// Filtra tarjetas según el botón presionado.
function aplicarFiltro(event) {

    // Seleccionamos todos los botones filtro.
    const botones =
        document.querySelectorAll(".atom-btn--filter");


    // Quitamos la clase activa a todos.
    botones.forEach((boton) => {

        boton.classList.remove("atom-btn--filter-active");
    });


    // Activamos el botón actual.
    event.target.classList.add("atom-btn--filter-active");


    // Guardamos el filtro.
    filtroActivo = event.target.dataset.filter;


    // Volvemos a renderizar.
    renderizarTarjetas();
}




// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 8 — RELOJ Y MONITOREO AUTOMÁTICO
// ─────────────────────────────────────────────────────────────────────────────


// Actualiza el reloj UTC.
function actualizarReloj() {

    const reloj =
        document.getElementById("reloj-principal");


    const ahora = new Date();


    // Extraemos horas, minutos y segundos UTC.
    const horas =
        String(ahora.getUTCHours()).padStart(2, "0");

    const minutos =
        String(ahora.getUTCMinutes()).padStart(2, "0");

    const segundos =
        String(ahora.getUTCSeconds()).padStart(2, "0");


    // Mostramos el reloj.
    reloj.textContent =
        `${horas}:${minutos}:${segundos}Z`;
}


// Detecta lanzamientos cuya fecha ya pasó.
function monitorearLanzamientos() {

    const ahora = new Date();


    // Recorremos todos los lanzamientos.
    lanzamientos.forEach((lanzamiento) => {


        // Si está pendiente y la fecha ya pasó,
        // se cambia automáticamente a lanzado.
        if (

            lanzamiento.estado === "pendiente" &&

            new Date(lanzamiento.fecha) <= ahora
        ) {

            lanzamiento.estado = "lanzado";
        }
    });


    // Actualizamos interfaz.
    renderizarTarjetas();

    actualizarEstadisticas();
}




// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 9 — ESTADÍSTICAS
// ─────────────────────────────────────────────────────────────────────────────


// Cuenta registros por estado.
function actualizarEstadisticas() {

    let pendientes = 0;

    let lanzados = 0;

    let cancelados = 0;


    // Recorremos todos los lanzamientos.
    lanzamientos.forEach((lanzamiento) => {


        if (lanzamiento.estado === "pendiente") {

            pendientes++;
        }


        if (lanzamiento.estado === "lanzado") {

            lanzados++;
        }


        if (lanzamiento.estado === "cancelado") {

            cancelados++;
        }
    });


    // Actualizamos los elementos HTML.
    document.getElementById("stat-pendientes").textContent =
        pendientes;

    document.getElementById("stat-lanzados").textContent =
        lanzados;

    document.getElementById("stat-cancelados").textContent =
        cancelados;

    document.getElementById("stat-total").textContent =
        lanzamientos.length;
}




// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 10 — INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────────────────────


// Esperamos a que cargue completamente el HTML.
document.addEventListener("DOMContentLoaded", () => {


    // Capturamos formulario.
    const formulario =
        document.getElementById("form-lanzamiento");


    // Evento submit del formulario.
    formulario.addEventListener("submit", manejarFormulario);


    // Evento click de filtros.
    document
        .getElementById("grupo-filtros")
        .addEventListener("click", aplicarFiltro);


    // Evento botón cancelar edición.
    document
        .getElementById("btn-cancelar-edicion")
        .addEventListener("click", salirModoEdicion);


    // Ocultamos botón cancelar inicialmente.
    document.getElementById("btn-cancelar-edicion").style.display =
        "none";


    // Actualizamos reloj inmediatamente.
    actualizarReloj();


    // Ejecutamos reloj y monitoreo cada segundo.
    setInterval(() => {

        actualizarReloj();

        monitorearLanzamientos();

    }, 1000);


    // Primer renderizado.
    renderizarTarjetas();

    actualizarEstadisticas();
});