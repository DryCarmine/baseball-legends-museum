document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // INICIO DE LA APLICACIÓN
    // =========================================================

    cargarVista('menu');

    // Configurar navegación inferior
    document.querySelectorAll('.bottom-nav .nav-item[data-vista]').forEach(button => {
        button.addEventListener('click', (e) => {
            const vista = e.currentTarget.getAttribute('data-vista');
            cargarVista(vista);
        });
    });

    // Botón superior "Volver"
    const btnBack = document.getElementById('btn-back');

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            cargarVista('menu');
        });
    }

    // Botón de configuración
    const btnConfig = document.getElementById('btn-config');

    if (btnConfig) {
        btnConfig.addEventListener('click', () => {
            cargarVista('config');
        });
    }

    // Botón AR
    const btnAr = document.getElementById('btn-ar');

    if (btnAr) {
        btnAr.addEventListener('click', () => {
            abrirAR();
        });
    }
});


// =========================================================
// SISTEMA CENTRAL DE VISTAS
// =========================================================

async function cargarVista(vista) {

    const ruta = `views/${vista}.html`;

    try {

        const response = await fetch(ruta);

        if (!response.ok) {
            throw new Error(
                `No se encontró el archivo: ${ruta} (Código: ${response.status})`
            );
        }

        const html = await response.text();

        document.getElementById('app-content').innerHTML = html;


        // -----------------------------------------------------
        // Inicialización específica de cada vista
        // -----------------------------------------------------

        if (vista === 'config') {
            inicializarConfiguracion();
        }

        if (vista === 'menu') {
            initLogoFromStorage();
        }


        // -----------------------------------------------------
        // Navegación inferior
        // -----------------------------------------------------

        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeBtn = document.querySelector(
            `.bottom-nav .nav-item[data-vista="${vista}"]`
        );

        if (activeBtn) {
            activeBtn.classList.add('active');
        }


        // -----------------------------------------------------
        // Botón volver
        // -----------------------------------------------------

        const btnBack = document.getElementById('btn-back');

        if (btnBack) {

            if (vista === 'menu') {
                btnBack.classList.add('hidden');
            } else {
                btnBack.classList.remove('hidden');
            }

        }


        // -----------------------------------------------------
        // Trivia
        // -----------------------------------------------------

        if (
            vista === 'trivia' &&
            typeof cargarTrivia === 'function'
        ) {
            cargarTrivia();
        }


    } catch (error) {

        console.warn("Aviso de navegación:", error.message);

        document.getElementById('app-content').innerHTML = `
            <div style="
                padding: 40px 20px;
                text-align: center;
                color: #fff;
            ">

                <div style="
                    font-size: 48px;
                    margin-bottom: 10px;
                ">
                    🚧
                </div>

                <h3 style="margin-bottom: 10px;">
                    Sección en Desarrollo
                </h3>

                <p style="
                    opacity: 0.8;
                    font-size: 14px;
                    margin-bottom: 20px;
                ">
                    El archivo
                    <strong>views/${vista}.html</strong>
                    aún no ha sido creado.
                </p>

                <button
                    id="btn-volver-inicio"
                    style="
                        padding: 10px 20px;
                        background: #e63946;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    "
                >
                    Volver al Inicio
                </button>

            </div>
        `;

        document
            .getElementById('btn-volver-inicio')
            .addEventListener('click', () => {
                cargarVista('menu');
            });
    }
}


// =========================================================
// CONFIGURACIÓN / PERSONALIZACIÓN
// =========================================================

function inicializarConfiguracion() {

    // Verificar que teams.js esté disponible
    if (
        typeof MLB_TEAMS === 'undefined' ||
        !Array.isArray(MLB_TEAMS)
    ) {

        console.error(
            'MLB_TEAMS no está disponible. Verifica que teams.js se cargue antes de app.js.'
        );

        return;
    }


    // Renderizar los equipos
    renderizarEquipos();


    // Mostrar el equipo actualmente guardado
    actualizarEquipoSeleccionado();
}


// =========================================================
// GENERAR EQUIPOS
// =========================================================

function renderizarEquipos() {

    const contenedor = document.getElementById('team-logo-grid');

    if (!contenedor) {
        console.warn(
            'No se encontró #team-logo-grid en la vista de configuración.'
        );

        return;
    }


    // Limpiar el contenedor
    contenedor.innerHTML = '';


    // ---------------------------------------------------------
    // Separar por liga
    // ---------------------------------------------------------

    const ligaAmericana = MLB_TEAMS.filter(
        team => team.league === 'American'
    );

    const ligaNacional = MLB_TEAMS.filter(
        team => team.league === 'National'
    );


    // Crear sección Americana
    crearSeccionLiga(
        contenedor,
        'LIGA AMERICANA',
        ligaAmericana
    );


    // Crear sección Nacional
    crearSeccionLiga(
        contenedor,
        'LIGA NACIONAL',
        ligaNacional
    );
}


// =========================================================
// CREAR SECCIÓN DE UNA LIGA
// =========================================================

function crearSeccionLiga(contenedor, titulo, equipos) {

    const seccion = document.createElement('section');

    seccion.className = 'team-league-section';


    // Título de la liga
    const encabezado = document.createElement('h3');

    encabezado.className = 'team-league-title';

    encabezado.textContent = titulo;


    // Grid
    const grid = document.createElement('div');

    grid.className = 'team-grid';


    // Crear cada equipo
    equipos.forEach(team => {

        const boton = document.createElement('button');

        boton.type = 'button';

        boton.className = 'team-option';

        boton.dataset.teamId = team.id;


        // Logo
        const imagen = document.createElement('img');

        imagen.src = team.logo;

        imagen.alt = `Logo de ${team.name}`;

        imagen.loading = 'lazy';


        // Nombre
        const nombre = document.createElement('span');

        nombre.textContent = team.name;


        // Construcción
        boton.appendChild(imagen);

        boton.appendChild(nombre);


        // Evento
        boton.addEventListener('click', () => {

            seleccionarEquipo(team);

        });


        grid.appendChild(boton);

    });


    seccion.appendChild(encabezado);

    seccion.appendChild(grid);

    contenedor.appendChild(seccion);
}


// =========================================================
// SELECCIONAR EQUIPO
// =========================================================

function seleccionarEquipo(team) {

    if (!team) {
        return;
    }


    // ---------------------------------------------------------
    // Guardar información
    // ---------------------------------------------------------

    try {

        localStorage.setItem(
            'favoriteTeam',
            team.id
        );

        localStorage.setItem(
            'favoriteTeamName',
            team.name
        );

        localStorage.setItem(
            'mainTeamLogo',
            team.logo
        );

    } catch (error) {

        console.warn(
            'No se pudo guardar el equipo favorito.',
            error
        );

    }


    // ---------------------------------------------------------
    // Actualizar selección visual
    // ---------------------------------------------------------

    document
        .querySelectorAll('.team-option')
        .forEach(button => {

            button.classList.remove('selected');

        });


    const botonSeleccionado = document.querySelector(
        `.team-option[data-team-id="${team.id}"]`
    );

    if (botonSeleccionado) {

        botonSeleccionado.classList.add('selected');

    }


    // ---------------------------------------------------------
    // Actualizar tarjeta superior
    // ---------------------------------------------------------

    actualizarEquipoSeleccionado();


    // ---------------------------------------------------------
    // Actualizar logo si el elemento existe
    // ---------------------------------------------------------

    const logoPrincipal = document.getElementById(
        'main-team-logo'
    );

    if (logoPrincipal) {

        logoPrincipal.src = team.logo;

    }
}


// =========================================================
// MOSTRAR EQUIPO SELECCIONADO
// =========================================================

function actualizarEquipoSeleccionado() {

    const teamId = localStorage.getItem(
        'favoriteTeam'
    );

    const team = MLB_TEAMS.find(
        item => item.id === teamId
    );


    // No hay equipo seleccionado
    if (!team) {

        const nombre = document.getElementById(
            'selected-team-name'
        );

        if (nombre) {
            nombre.textContent = 'Selecciona un equipo';
        }

        return;
    }


    // Nombre
    const nombre = document.getElementById(
        'selected-team-name'
    );

    if (nombre) {

        nombre.textContent = team.name;

    }


    // Logo
    const logo = document.getElementById(
        'selected-team-logo'
    );

    if (logo) {

        logo.src = team.logo;

        logo.alt = `Logo de ${team.name}`;

    }


    // ID
    const id = document.getElementById(
        'selected-team-id'
    );

    if (id) {

        id.textContent = team.id;

    }


    // Marcar equipo seleccionado
    document
        .querySelectorAll('.team-option')
        .forEach(button => {

            button.classList.toggle(
                'selected',
                button.dataset.teamId === team.id
            );

        });
}


// =========================================================
// LOGO DEL MENÚ PRINCIPAL
// =========================================================

function initLogoFromStorage() {

    const logo = localStorage.getItem(
        'mainTeamLogo'
    );

    const img = document.getElementById(
        'main-team-logo'
    );


    if (img && logo) {

        img.src = logo;

    }
}


// =========================================================
// CAMBIAR LOGO PRINCIPAL
// =========================================================

function setMainTeamLogo(logoPath) {

    if (!logoPath) {
        return;
    }


    try {

        localStorage.setItem(
            'mainTeamLogo',
            logoPath
        );

    } catch (error) {

        console.warn(
            'No se pudo guardar el logo en localStorage.',
            error
        );

    }


    const img = document.getElementById(
        'main-team-logo'
    );

    if (img) {

        img.src = logoPath;

    }
}


// =========================================================
// REALIDAD AUMENTADA
// =========================================================

function abrirAR() {

    document.getElementById('app-content').innerHTML = `

        <div style="
            padding: 20px;
            text-align: center;
            color: #fff;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        ">

            <h3>
                Cámara / Entorno AR Activo
            </h3>

            <p>
                Espacio reservado para el visor de Realidad Aumentada.
            </p>

            <button
                id="btn-cerrar-ar"
                style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #333;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                "
            >
                Cerrar AR
            </button>

        </div>
    `;


    document
        .getElementById('btn-cerrar-ar')
        .addEventListener('click', () => {

            cargarVista('menu');

        });


    document
        .querySelectorAll('.bottom-nav .nav-item')
        .forEach(item => {

            item.classList.remove('active');

        });


    document
        .getElementById('btn-back')
        .classList.remove('hidden');
}