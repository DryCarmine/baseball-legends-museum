document.addEventListener("DOMContentLoaded", () => {
    // Cargar la vista de inicio por defecto desde la carpeta views/
    cargarVista('menu');

    // Inicializar logo guardado (si existe)
    initLogoFromStorage();

    // Configurar eventos de la barra de navegación inferior
    document.querySelectorAll('.bottom-nav .nav-item[data-vista]').forEach(button => {
        button.addEventListener('click', (e) => {
            const vista = e.currentTarget.getAttribute('data-vista');
            cargarVista(vista);
        });
    });

    // Botón Superior "Volver"
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            cargarVista('menu');
        });
    }

    // Botón de AR central
    const btnAr = document.getElementById('btn-ar');
    if (btnAr) {
        btnAr.addEventListener('click', () => {
            abrirAR();
        });
    }
    // Botón de configuración
const btnConfig = document.getElementById('btn-config');

if (btnConfig) {
    btnConfig.addEventListener('click', () => {
        cargarVista('config');
    });
}
});

// Función central de enrutamiento SPA
async function cargarVista(vista) {
    // Apunta de forma directa y limpia a la carpeta views/ para cualquier sección
    const ruta = `views/${vista}.html`;

    try {
        const response = await fetch(ruta);
        
        if (!response.ok) {
            throw new Error(`No se encontró el archivo: ${ruta} (Código: ${response.status})`);
        }
        
        const html = await response.text();
        document.getElementById('app-content').innerHTML = html;

        // Enlazar listeners específicos de la vista (p.ej. configuración)
        if (typeof attachConfigListeners === 'function') attachConfigListeners();

        // Actualizar la clase 'active' para que el botón actual brille y los demás se apaguen
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`.bottom-nav .nav-item[data-vista="${vista}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Controlar visibilidad del botón "Volver" superior
        const btnBack = document.getElementById('btn-back');
        if (vista === 'menu') {
            btnBack.classList.add('hidden');
        } else {
            btnBack.classList.remove('hidden');
        }

        // Si se carga la trivia, inicializar su lógica automáticamente
        if (vista === 'trivia' && typeof cargarTrivia === 'function') {
            cargarTrivia();
        }

    } catch (error) {
        console.warn("Aviso de navegación:", error.message);
        document.getElementById('app-content').innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: #fff;">
                <div style="font-size: 48px; margin-bottom: 10px;">🚧</div>
                <h3 style="margin-bottom: 10px;">Sección en Desarrollo</h3>
                <p style="opacity: 0.8; font-size: 14px; margin-bottom: 20px;">El archivo <strong>views/${vista}.html</strong> aún no ha sido creado.</p>
                <button id="btn-volver-inicio" style="padding: 10px 20px; background: #e63946; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Volver al Inicio</button>
            </div>
        `;
        
        document.getElementById('btn-volver-inicio').addEventListener('click', () => {
            cargarVista('menu');
        });
    }
}

// Función exclusiva para AR
function abrirAR() {
    document.getElementById('app-content').innerHTML = `
        <div style="padding: 20px; text-align: center; color: #fff; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h3>Cámara / Entorno AR Activo</h3>
            <p>Espacio reservado para el visor de Realidad Aumentada.</p>
            <button id="btn-cerrar-ar" style="margin-top: 20px; padding: 10px 20px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar AR</button>
        </div>
    `;
    
    document.getElementById('btn-cerrar-ar').addEventListener('click', () => {
        cargarVista('menu');
    });

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('btn-back').classList.remove('hidden');
}

// Manejo de logo principal con persistencia en localStorage
function initLogoFromStorage() {
    const logo = localStorage.getItem('mainTeamLogo');
    const img = document.getElementById('main-team-logo');
    if (img && logo) img.src = logo;
}

function setMainTeamLogo(logoPath) {
    try {
        localStorage.setItem('mainTeamLogo', logoPath);
    } catch (e) {
        console.warn('No se pudo guardar en localStorage', e);
    }
    const img = document.getElementById('main-team-logo');
    if (img) img.src = logoPath;
}

function attachConfigListeners() {
    document.querySelectorAll('.logo-option[data-logo]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const logo = e.currentTarget.getAttribute('data-logo');
            if (logo) setMainTeamLogo(logo);
        });
    });
}