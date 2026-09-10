/*
 * Baseball Legends Museum
 * Módulo de Realidad Aumentada
 *
 * Primera prueba:
 * Arizona Diamondbacks
 * Marcador + modelo GLB
 */

window.ARModule = (() => {

    let scene = null;
    let target = null;
    let startButton = null;
    let statusLabel = null;
    let instructions = null;

    let arSystem = null;
    let arStarted = false;


    // =========================================================
    // INICIALIZAR AR
    // =========================================================

    async function init() {

        scene = document.getElementById('ar-scene');
        target = document.getElementById('arizona-target');

        startButton = document.getElementById('btn-start-ar');
        statusLabel = document.getElementById('ar-status');
        instructions = document.getElementById('ar-instructions');


        if (!scene) {
            console.error('No se encontró #ar-scene');
            return;
        }

        if (!target) {
            console.error('No se encontró #arizona-target');
            return;
        }


        actualizarEstado(
            'Preparando experiencia AR...',
            'waiting'
        );


        // Esperar a que A-Frame termine de preparar la escena
        await esperarEscena(scene);


        arSystem =
            scene.systems &&
            scene.systems['mindar-image-system'];


        if (!arSystem) {

            actualizarEstado(
                'Error al cargar MindAR',
                'error'
            );

            console.error(
                'No se encontró mindar-image-system.'
            );

            return;
        }


        configurarEventos();


        actualizarEstado(
            'Cámara detenida',
            'waiting'
        );


        if (startButton) {

            startButton.disabled = false;

            startButton.addEventListener(
                'click',
                iniciarCamara
            );

        }

    }


    // =========================================================
    // ESPERAR ESCENA A-FRAME
    // =========================================================

    function esperarEscena(sceneElement) {

        return new Promise(resolve => {

            if (sceneElement.hasLoaded) {

                resolve();

                return;

            }


            sceneElement.addEventListener(
                'loaded',
                () => resolve(),
                { once: true }
            );

        });

    }


    // =========================================================
    // INICIAR CÁMARA
    // =========================================================

    async function iniciarCamara() {

        if (arStarted) {
            return;
        }


        if (!arSystem) {

            actualizarEstado(
                'AR no disponible',
                'error'
            );

            return;
        }


        if (!navigator.mediaDevices) {

            actualizarEstado(
                'La cámara no está disponible en este navegador',
                'error'
            );

            return;
        }


        try {

            if (startButton) {

                startButton.disabled = true;

                startButton.textContent =
                    'INICIANDO...';

            }


            actualizarEstado(
                'Solicitando acceso a cámara...',
                'loading'
            );


            await arSystem.start();


            arStarted = true;


            actualizarEstado(
                'Buscando marcador...',
                'searching'
            );


            if (startButton) {

                startButton.textContent =
                    'CÁMARA ACTIVA';

                startButton.classList.add(
                    'active'
                );

            }


        } catch (error) {

            console.error(
                'Error al iniciar MindAR:',
                error
            );


            actualizarEstado(
                'No se pudo iniciar la cámara',
                'error'
            );


            if (startButton) {

                startButton.disabled = false;

                startButton.textContent =
                    'ACTIVAR CÁMARA';

            }

        }

    }


    // =========================================================
    // EVENTOS DE MINDAR
    // =========================================================

    function configurarEventos() {

        if (!target) {
            return;
        }


        // Marcador encontrado
        target.addEventListener(
            'targetFound',
            () => {

                actualizarEstado(
                    'Marcador detectado',
                    'found'
                );


                if (instructions) {

                    instructions.classList.add(
                        'hidden'
                    );

                }


                console.log(
                    'Marcador Arizona detectado.'
                );

            }
        );


        // Marcador perdido
        target.addEventListener(
            'targetLost',
            () => {

                actualizarEstado(
                    'Buscando marcador...',
                    'searching'
                );


                if (instructions) {

                    instructions.classList.remove(
                        'hidden'
                    );

                }


                console.log(
                    'Marcador Arizona perdido.'
                );

            }
        );


        // MindAR listo
        scene.addEventListener(
            'arReady',
            () => {

                console.log(
                    'MindAR está listo.'
                );

            }
        );


        // Error interno de MindAR
        scene.addEventListener(
            'arError',
            event => {

                console.error(
                    'Error de MindAR:',
                    event
                );


                actualizarEstado(
                    'Error en la experiencia AR',
                    'error'
                );

            }
        );


        // Modelo cargado
        const model =
            document.getElementById(
                'arizona-3d-model'
            );


        if (model) {

            model.addEventListener(
                'model-loaded',
                () => {

                    console.log(
                        'Modelo ArizonaDiamonds.glb cargado.'
                    );

                }
            );


            model.addEventListener(
                'model-error',
                event => {

                    console.error(
                        'Error al cargar el modelo:',
                        event
                    );


                    actualizarEstado(
                        'Error al cargar el modelo 3D',
                        'error'
                    );

                }
            );

        }

    }


    // =========================================================
    // DETENER AR
    // =========================================================

    function stop() {

        if (!arSystem) {
            limpiarReferencias();
            return;
        }


        try {

            if (arStarted) {

                arSystem.stop();

            }

        } catch (error) {

            console.warn(
                'No se pudo detener MindAR correctamente:',
                error
            );

        }


        arStarted = false;

        limpiarReferencias();

    }


    // =========================================================
    // ESTADO VISUAL
    // =========================================================

    function actualizarEstado(
        texto,
        estado = ''
    ) {

        if (!statusLabel) {
            return;
        }


        statusLabel.textContent = texto;


        statusLabel.classList.remove(
            'waiting',
            'loading',
            'searching',
            'found',
            'error'
        );


        if (estado) {

            statusLabel.classList.add(
                estado
            );

        }

    }


    // =========================================================
    // LIMPIEZA
    // =========================================================

    function limpiarReferencias() {

        scene = null;
        target = null;
        startButton = null;
        statusLabel = null;
        instructions = null;
        arSystem = null;

    }


    // =========================================================
    // API PÚBLICA
    // =========================================================

    return {

        init,
        stop

    };

})();