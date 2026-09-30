const PREGUNTAS_POR_PARTIDA = 5;
const PUNTOS_POR_RESPUESTA = 10;
const TRIVIA_BEST_KEY = "mlbTriviaBestScore";

let preguntasPartida = [];
let preguntaActualIndex = 0;
let puntajeActual = 0;
let respuestasCorrectas = 0;
let triviaBloqueada = false;


/**
 * Entero aleatorio entre 0 y maxExclusive - 1.
 * Se usa crypto cuando el navegador lo soporta.
 */
function obtenerEnteroAleatorio(maxExclusive) {

    if (maxExclusive <= 0) {
        return 0;
    }

    if (
        window.crypto &&
        window.crypto.getRandomValues
    ) {

        const limite =
            Math.floor(
                0x100000000 /
                maxExclusive
            ) * maxExclusive;

        const valores =
            new Uint32Array(1);

        do {

            window.crypto
                .getRandomValues(
                    valores
                );

        } while (
            valores[0] >= limite
        );

        return (
            valores[0] %
            maxExclusive
        );
    }

    return Math.floor(
        Math.random() *
        maxExclusive
    );
}


/**
 * Fisher-Yates.
 */
function mezclarArreglo(arreglo) {

    const copia =
        [...arreglo];

    for (
        let i = copia.length - 1;
        i > 0;
        i--
    ) {

        const j =
            obtenerEnteroAleatorio(
                i + 1
            );

        [
            copia[i],
            copia[j]
        ] = [
            copia[j],
            copia[i]
        ];
    }

    return copia;
}


/**
 * Mezcla las opciones y conserva la respuesta correcta.
 */
function prepararPregunta(item) {

    const opcionesOriginales =
        item.opciones ||
        item.options ||
        item.choices ||
        [];

    const valorCorrecto =
        item.correcta !== undefined
            ? item.correcta
            : item.correct !== undefined
                ? item.correct
                : item.answer !== undefined
                    ? item.answer
                    : item.respuesta !== undefined
                        ? item.respuesta
                        : null;

    let indiceCorrectoOriginal =
        -1;

    if (
        typeof valorCorrecto ===
        "number"
    ) {

        indiceCorrectoOriginal =
            valorCorrecto;

    } else if (
        typeof valorCorrecto ===
        "string"
    ) {

        indiceCorrectoOriginal =
            opcionesOriginales
                .findIndex(
                    opcion =>
                        opcion ===
                        valorCorrecto
                );
    }

    if (
        !Array.isArray(
            opcionesOriginales
        ) ||
        opcionesOriginales.length < 2 ||
        indiceCorrectoOriginal < 0 ||
        indiceCorrectoOriginal >=
            opcionesOriginales.length
    ) {

        return null;
    }

    const opcionesConIndice =
        opcionesOriginales.map(
            (texto, indice) => ({
                texto,
                indiceOriginal: indice
            })
        );

    const opcionesMezcladas =
        mezclarArreglo(
            opcionesConIndice
        );

    return {
        id: item.id,
        pregunta:
            item.pregunta ||
            item.question ||
            item.text ||
            "Pregunta sin texto",

        opciones:
            opcionesMezcladas.map(
                opcion =>
                    opcion.texto
            ),

        correcta:
            opcionesMezcladas
                .findIndex(
                    opcion =>
                        opcion.indiceOriginal ===
                        indiceCorrectoOriginal
                )
    };
}


function obtenerMejorPuntaje() {

    const valor =
        Number(
            localStorage.getItem(
                TRIVIA_BEST_KEY
            )
        );

    return Number.isFinite(valor)
        ? valor
        : 0;
}


function guardarMejorPuntaje() {

    const anterior =
        obtenerMejorPuntaje();

    if (
        puntajeActual >
        anterior
    ) {

        localStorage.setItem(
            TRIVIA_BEST_KEY,
            String(puntajeActual)
        );
    }
}


function actualizarResumen() {

    const puntosTop =
        document.getElementById(
            "puntos-trivia"
        );

    const statPuntos =
        document.getElementById(
            "stat-puntos"
        );

    const progressText =
        document.getElementById(
            "trivia-progress-text"
        );

    const progressBar =
        document.getElementById(
            "trivia-progress-bar"
        );

    const bestScore =
        document.getElementById(
            "trivia-best-score"
        );

    if (puntosTop) {
        puntosTop.textContent =
            puntajeActual;
    }

    if (statPuntos) {
        statPuntos.textContent =
            `${puntajeActual} pts`;
    }

    if (bestScore) {
        bestScore.textContent =
            `${Math.max(
                obtenerMejorPuntaje(),
                puntajeActual
            )} pts`;
    }

    const current =
        Math.min(
            preguntaActualIndex + 1,
            PREGUNTAS_POR_PARTIDA
        );

    if (progressText) {

        progressText.textContent =
            `${current} / ${PREGUNTAS_POR_PARTIDA}`;
    }

    if (progressBar) {

        const completed =
            Math.min(
                preguntaActualIndex,
                PREGUNTAS_POR_PARTIDA
            );

        progressBar.style.width =
            `${
                (
                    completed /
                    PREGUNTAS_POR_PARTIDA
                ) * 100
            }%`;
    }
}


async function cargarTrivia() {

    const triviaCard =
        document.getElementById(
            "trivia-card"
        );

    const resultadoDiv =
        document.getElementById(
            "trivia-resultado"
        );

    const btnSiguiente =
        document.getElementById(
            "btn-siguiente"
        );

    /*
     * Puede llamarse desde app.js justo después de
     * cargar la vista. Si todavía no está el HTML,
     * simplemente salimos.
     */
    if (!triviaCard) {
        return;
    }

    triviaCard.innerHTML = `
        <div class="trivia-loading">
            <div class="trivia-spinner"></div>
            Cargando preguntas...
        </div>
    `;

    if (resultadoDiv) {
        resultadoDiv.textContent = "";
        resultadoDiv.className =
            "trivia-result";
    }

    if (btnSiguiente) {
        btnSiguiente.style.display =
            "none";
        btnSiguiente.onclick =
            null;
    }

    preguntaActualIndex =
        0;

    puntajeActual =
        0;

    respuestasCorrectas =
        0;

    triviaBloqueada =
        false;

    actualizarResumen();

    try {

        const response =
            await fetch(
                "./data/preguntas.json",
                { cache: "no-store" }
            );

        if (!response.ok) {

            throw new Error(
                `Error al cargar preguntas (${response.status}).`
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                "El banco de preguntas no contiene un arreglo válido."
            );
        }

        const preguntasValidas =
            data
                .map(
                    prepararPregunta
                )
                .filter(
                    pregunta =>
                        pregunta !== null
                );

        if (
            preguntasValidas.length <
            PREGUNTAS_POR_PARTIDA
        ) {

            throw new Error(
                `Se requieren al menos ${PREGUNTAS_POR_PARTIDA} preguntas válidas.`
            );
        }

        console.log(
            `[Trivia] Banco válido: ${preguntasValidas.length} preguntas`
        );

        preguntasPartida =
            mezclarArreglo(
                preguntasValidas
            ).slice(
                0,
                PREGUNTAS_POR_PARTIDA
            );

        mostrarPreguntaActual();

    } catch (error) {

        console.error(
            "Error en trivia:",
            error
        );

        triviaCard.innerHTML = `
            <div class="trivia-error">
                ⚠️ No se pudo cargar la trivia.<br><br>
                ${escapeTriviaHtml(
                    error.message
                )}
            </div>
        `;
    }
}


function escapeTriviaHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function mostrarPreguntaActual() {

    if (
        preguntaActualIndex >=
        preguntasPartida.length
    ) {

        mostrarResultadosFinales();

        return;
    }

    triviaBloqueada =
        false;

    const pregunta =
        preguntasPartida[
            preguntaActualIndex
        ];

    const triviaCard =
        document.getElementById(
            "trivia-card"
        );

    const resultadoDiv =
        document.getElementById(
            "trivia-resultado"
        );

    const btnSiguiente =
        document.getElementById(
            "btn-siguiente"
        );

    if (!triviaCard) {
        return;
    }

    triviaCard.innerHTML = `
        <div class="trivia-question-number">
            Pregunta ${preguntaActualIndex + 1}
            de ${PREGUNTAS_POR_PARTIDA}
        </div>

        <h3 class="trivia-question">
            ${escapeTriviaHtml(
                pregunta.pregunta
            )}
        </h3>

        <div
            id="opciones-container"
            class="trivia-options">
        </div>
    `;

    const contenedorOpciones =
        document.getElementById(
            "opciones-container"
        );

    if (resultadoDiv) {

        resultadoDiv.textContent =
            "";

        resultadoDiv.className =
            "trivia-result";
    }

    if (btnSiguiente) {

        btnSiguiente.style.display =
            "none";

        btnSiguiente.onclick =
            null;
    }

    pregunta.opciones.forEach(
        (opcion, indice) => {

            const boton =
                document.createElement(
                    "button"
                );

            boton.type =
                "button";

            boton.className =
                "trivia-option";

            boton.textContent =
                opcion;

            boton.addEventListener(
                "click",
                () => {

                    verificarRespuesta(
                        indice,
                        pregunta.correcta,
                        boton
                    );
                }
            );

            contenedorOpciones
                ?.appendChild(
                    boton
                );
        }
    );

    actualizarResumen();
}


function verificarRespuesta(
    seleccionada,
    correcta,
    botonSeleccionado
) {

    if (triviaBloqueada) {
        return;
    }

    triviaBloqueada =
        true;

    const botones =
        Array.from(
            document.querySelectorAll(
                "#opciones-container .trivia-option"
            )
        );

    const resultadoDiv =
        document.getElementById(
            "trivia-resultado"
        );

    botones.forEach(
        boton => {

            boton.disabled =
                true;
        }
    );

    const acierto =
        seleccionada === correcta;

    if (acierto) {

        botonSeleccionado
            ?.classList.add(
                "correct"
            );

        puntajeActual +=
            PUNTOS_POR_RESPUESTA;

        respuestasCorrectas++;

        if (resultadoDiv) {

            resultadoDiv.textContent =
                "¡Correcto! ⚾ +10 puntos";

            resultadoDiv.className =
                "trivia-result correct";
        }

    } else {

        botonSeleccionado
            ?.classList.add(
                "incorrect"
            );

        botones[correcta]
            ?.classList.add(
                "correct"
            );

        if (resultadoDiv) {

            const respuestaCorrecta =
                botones[correcta]
                    ?.textContent ||
                "";

            resultadoDiv.textContent =
                `Incorrecto. Respuesta: ${respuestaCorrecta}`;

            resultadoDiv.className =
                "trivia-result incorrect";
        }
    }

    actualizarResumen();

    const btnSiguiente =
        document.getElementById(
            "btn-siguiente"
        );

    if (btnSiguiente) {

        btnSiguiente.style.display =
            "block";

        btnSiguiente.textContent =
            preguntaActualIndex ===
            PREGUNTAS_POR_PARTIDA - 1
                ? "Ver resultado"
                : "Siguiente pregunta";

        btnSiguiente.onclick =
            () => {

                preguntaActualIndex++;

                mostrarPreguntaActual();
            };
    }
}


function obtenerMensajeFinal() {

    if (
        respuestasCorrectas ===
        PREGUNTAS_POR_PARTIDA
    ) {
        return {
            icon: "🏆",
            title: "¡Juego perfecto!",
            message:
                "Cinco de cinco. Nivel leyenda."
        };
    }

    if (
        respuestasCorrectas >= 4
    ) {
        return {
            icon: "⭐",
            title: "¡Gran partida!",
            message:
                "Tu conocimiento de MLB está en muy buen nivel."
        };
    }

    if (
        respuestasCorrectas >= 2
    ) {
        return {
            icon: "⚾",
            title: "Buen intento",
            message:
                "Cada partida toma preguntas distintas del banco."
        };
    }

    return {
        icon: "🧢",
        title: "Sigue jugando",
        message:
            "Hay 75 preguntas para seguir practicando."
    };
}


function mostrarResultadosFinales() {

    guardarMejorPuntaje();

    const triviaCard =
        document.getElementById(
            "trivia-card"
        );

    const resultadoDiv =
        document.getElementById(
            "trivia-resultado"
        );

    const btnSiguiente =
        document.getElementById(
            "btn-siguiente"
        );

    const progressText =
        document.getElementById(
            "trivia-progress-text"
        );

    const progressBar =
        document.getElementById(
            "trivia-progress-bar"
        );

    const final =
        obtenerMensajeFinal();

    if (triviaCard) {

        triviaCard.innerHTML = `
            <div class="trivia-final">

                <div class="trivia-final-icon">
                    ${final.icon}
                </div>

                <h3>
                    ${final.title}
                </h3>

                <p>
                    ${final.message}
                </p>

                <div class="trivia-final-score">
                    ${puntajeActual} / 50 pts
                </div>

                <p>
                    Respuestas correctas:
                    <strong>
                        ${respuestasCorrectas} / ${PREGUNTAS_POR_PARTIDA}
                    </strong>
                </p>

                <p>
                    Mejor marca:
                    <strong>
                        ${obtenerMejorPuntaje()} pts
                    </strong>
                </p>

            </div>
        `;
    }

    if (resultadoDiv) {

        resultadoDiv.textContent =
            "";

        resultadoDiv.className =
            "trivia-result";
    }

    if (progressText) {

        progressText.textContent =
            `${PREGUNTAS_POR_PARTIDA} / ${PREGUNTAS_POR_PARTIDA}`;
    }

    if (progressBar) {

        progressBar.style.width =
            "100%";
    }

    actualizarResumen();

    if (btnSiguiente) {

        btnSiguiente.textContent =
            "Jugar de nuevo";

        btnSiguiente.style.display =
            "block";

        btnSiguiente.onclick =
            cargarTrivia;
    }
}


/*
 * app.js utiliza esta función global.
 */
window.cargarTrivia =
    cargarTrivia;


window.TriviaModule = {
    init: cargarTrivia,
    restart: cargarTrivia
};