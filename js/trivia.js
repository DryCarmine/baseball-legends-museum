const PREGUNTAS_POR_PARTIDA = 5;
const PUNTOS_POR_RESPUESTA = 10;

let preguntasPartida = [];
let preguntaActualIndex = 0;
let puntajeActual = 0;

/**
 * Devuelve un número entero aleatorio entre 0 y maxExclusive - 1.
 * Se usa crypto cuando el navegador lo soporta.
 */
function obtenerEnteroAleatorio(maxExclusive) {
    if (maxExclusive <= 0) return 0;

    if (window.crypto && window.crypto.getRandomValues) {
        const limite = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
        const valores = new Uint32Array(1);

        do {
            window.crypto.getRandomValues(valores);
        } while (valores[0] >= limite);

        return valores[0] % maxExclusive;
    }

    return Math.floor(Math.random() * maxExclusive);
}

/**
 * Mezcla un arreglo con Fisher-Yates sin modificar el arreglo original.
 */
function mezclarArreglo(arreglo) {
    const copia = [...arreglo];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = obtenerEnteroAleatorio(i + 1);
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

/**
 * Reordena las opciones y actualiza el índice de la respuesta correcta.
 */
function prepararPregunta(item) {
    const opcionesOriginales = item.opciones || item.options || item.choices || [];

    const valorCorrecto =
        item.correcta !== undefined ? item.correcta :
        item.correct !== undefined ? item.correct :
        item.answer !== undefined ? item.answer :
        item.respuesta !== undefined ? item.respuesta :
        null;

    let indiceCorrectoOriginal;

    if (typeof valorCorrecto === "number") {
        indiceCorrectoOriginal = valorCorrecto;
    } else if (typeof valorCorrecto === "string") {
        indiceCorrectoOriginal = opcionesOriginales.findIndex(
            opcion => opcion === valorCorrecto
        );
    }

    if (
        !Array.isArray(opcionesOriginales) ||
        opcionesOriginales.length < 2 ||
        indiceCorrectoOriginal < 0 ||
        indiceCorrectoOriginal >= opcionesOriginales.length
    ) {
        return null;
    }

    const opcionesConIndice = opcionesOriginales.map((texto, indice) => ({
        texto,
        indiceOriginal: indice
    }));

    const opcionesMezcladas = mezclarArreglo(opcionesConIndice);

    return {
        pregunta: item.pregunta || item.question || item.text || "Pregunta sin texto",
        opciones: opcionesMezcladas.map(opcion => opcion.texto),
        correcta: opcionesMezcladas.findIndex(
            opcion => opcion.indiceOriginal === indiceCorrectoOriginal
        )
    };
}

async function cargarTrivia() {
    const triviaCard = document.getElementById("trivia-card");
    const btnSiguiente = document.getElementById("btn-siguiente");

    if (triviaCard) {
        triviaCard.innerHTML = `
            <h3 id="pregunta-texto" style="font-size: 16px; margin-bottom: 20px; color: #fff;">
                Cargando pregunta...
            </h3>
            <div id="opciones-container" style="display: flex; flex-direction: column; gap: 10px;"></div>
        `;
    }

    if (btnSiguiente) {
        btnSiguiente.style.display = "none";
        btnSiguiente.onclick = null;
        btnSiguiente.innerText = "Siguiente pregunta";
    }

    const preguntaTexto = document.getElementById("pregunta-texto");
    const contenedorOpciones = document.getElementById("opciones-container");

    try {
        const response = await fetch("./data/preguntas.json");

        if (!response.ok) {
            throw new Error(`Error al cargar preguntas (${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("El archivo de preguntas no contiene un arreglo válido.");
        }

        const preguntasValidas = data
            .map(prepararPregunta)
            .filter(pregunta => pregunta !== null);

        if (preguntasValidas.length < PREGUNTAS_POR_PARTIDA) {
            throw new Error(
                `Se requieren al menos ${PREGUNTAS_POR_PARTIDA} preguntas válidas.`
            );
        }

        preguntasPartida = mezclarArreglo(preguntasValidas)
            .slice(0, PREGUNTAS_POR_PARTIDA);

        preguntaActualIndex = 0;
        puntajeActual = 0;

        actualizarPuntaje();
        mostrarPreguntaActual();
    } catch (error) {
        console.error("Error en trivia:", error);

        if (preguntaTexto) {
            preguntaTexto.innerText = "⚠️ Error al cargar la trivia";
        }

        if (contenedorOpciones) {
            contenedorOpciones.innerHTML = `
                <p style="color: #ff6b6b; font-size: 13px; text-align: center; padding: 10px;">
                    ${error.message}
                </p>
            `;
        }
    }
}

function actualizarPuntaje() {
    const puntosTop = document.getElementById("puntos-trivia");
    const statPuntos = document.getElementById("stat-puntos");

    if (puntosTop) {
        puntosTop.innerText = puntajeActual;
    }

    if (statPuntos) {
        statPuntos.innerText = `${puntajeActual} pts`;
    }
}

function mostrarPreguntaActual() {
    if (preguntaActualIndex >= preguntasPartida.length) {
        mostrarResultadosFinales();
        return;
    }

    const pregunta = preguntasPartida[preguntaActualIndex];
    const preguntaTexto = document.getElementById("pregunta-texto");
    const contenedorOpciones = document.getElementById("opciones-container");
    const resultadoDiv = document.getElementById("trivia-resultado");
    const btnSiguiente = document.getElementById("btn-siguiente");

    if (preguntaTexto) {
        preguntaTexto.innerText =
            `(${preguntaActualIndex + 1}/${PREGUNTAS_POR_PARTIDA}) ${pregunta.pregunta}`;
    }

    if (contenedorOpciones) {
        contenedorOpciones.innerHTML = "";
    }

    if (resultadoDiv) {
        resultadoDiv.innerText = "";
    }

    if (btnSiguiente) {
        btnSiguiente.style.display = "none";
        btnSiguiente.innerText = "Siguiente pregunta";
        btnSiguiente.onclick = null;
    }

    pregunta.opciones.forEach((opcion, indice) => {
        const boton = document.createElement("button");

        boton.innerText = opcion;
        boton.style.cssText = `
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            cursor: pointer;
            text-align: left;
            font-size: 14px;
            transition: background 0.2s;
            width: 100%;
        `;

        boton.addEventListener("click", () => {
            verificarRespuesta(indice, pregunta.correcta, boton);
        });

        if (contenedorOpciones) {
            contenedorOpciones.appendChild(boton);
        }
    });
}

function verificarRespuesta(seleccionada, correcta, botonSeleccionado) {
    const botones = document.querySelectorAll("#opciones-container button");
    const resultadoDiv = document.getElementById("trivia-resultado");

    botones.forEach(boton => {
        boton.disabled = true;
        boton.style.cursor = "default";
    });

    if (seleccionada === correcta) {
        botonSeleccionado.style.background = "#2a9d8f";

        if (resultadoDiv) {
            resultadoDiv.innerText = "¡Correcto! ⚾";
            resultadoDiv.style.color = "#2a9d8f";
        }

        puntajeActual += PUNTOS_POR_RESPUESTA;
        actualizarPuntaje();
    } else {
        botonSeleccionado.style.background = "#e63946";

        if (botones[correcta]) {
            botones[correcta].style.background = "#2a9d8f";
        }

        if (resultadoDiv) {
            resultadoDiv.innerText = "¡Incorrecto!";
            resultadoDiv.style.color = "#e63946";
        }
    }

    const btnSiguiente = document.getElementById("btn-siguiente");

    if (btnSiguiente) {
        btnSiguiente.style.display = "block";
        btnSiguiente.innerText =
            preguntaActualIndex === PREGUNTAS_POR_PARTIDA - 1
                ? "Ver resultado"
                : "Siguiente pregunta";

        btnSiguiente.onclick = () => {
            preguntaActualIndex++;
            mostrarPreguntaActual();
        };
    }
}

function mostrarResultadosFinales() {
    const triviaCard = document.getElementById("trivia-card");
    const resultadoDiv = document.getElementById("trivia-resultado");
    const btnSiguiente = document.getElementById("btn-siguiente");

    if (triviaCard) {
        triviaCard.innerHTML = `
            <h3 style="color: #ffcc00; margin-bottom: 10px;">
                ¡Trivia completada! 🎉
            </h3>
            <p style="margin: 15px 0; color: #fff;">
                Has puesto a prueba tus conocimientos de MLB.
            </p>
            <p style="font-size: 20px; font-weight: bold; color: #ffcc00;">
                Puntaje final: ${puntajeActual} / ${PREGUNTAS_POR_PARTIDA * PUNTOS_POR_RESPUESTA} pts
            </p>
        `;
    }

    if (resultadoDiv) {
        resultadoDiv.innerText = "";
    }

    if (btnSiguiente) {
        btnSiguiente.innerText = "Jugar de nuevo";
        btnSiguiente.style.display = "block";
        btnSiguiente.onclick = cargarTrivia;
    }
}