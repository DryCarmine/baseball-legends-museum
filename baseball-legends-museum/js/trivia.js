let preguntasPartida = [];
let preguntaActualIndex = 0;
let puntajeActual = 0;

async function cargarTrivia() {
    const triviaCard = document.getElementById('trivia-card');
    const btnSiguiente = document.getElementById('btn-siguiente');
    
    if (triviaCard) {
        triviaCard.innerHTML = `
            <h3 id="pregunta-texto" style="font-size: 16px; margin-bottom: 20px; color: #fff;">Cargando pregunta...</h3>
            <div id="opciones-container" style="display: flex; flex-direction: column; gap: 10px;"></div>
        `;
    }

    if (btnSiguiente) {
        btnSiguiente.style.display = 'none';
        btnSiguiente.onclick = null;
        btnSiguiente.innerText = "Siguiente Pregunta";
    }

    const preguntaTexto = document.getElementById('pregunta-texto');
    const contenedorOpciones = document.getElementById('opciones-container');
    
    try {
        const response = await fetch('./data/preguntas.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON (${response.status})`);
        }
        
        const data = await response.json();
        
        // Mapeo robusto compatible con diferentes estructuras del JSON
        const todasLasPreguntas = data.map(item => {
            const opciones = item.opciones || item.options || item.choices || [];
            let correctaIndex = 0;

            const rawCorrect = item.correcta !== undefined ? item.correcta : 
                               (item.correct !== undefined ? item.correct : 
                               (item.answer !== undefined ? item.answer : 
                               (item.respuesta !== undefined ? item.respuesta : 0)));

            if (typeof rawCorrect === 'number') {
                correctaIndex = rawCorrect;
            } else if (typeof rawCorrect === 'string') {
                const foundIdx = opciones.findIndex(op => op === rawCorrect);
                correctaIndex = foundIdx !== -1 ? foundIdx : 0;
            }

            return {
                pregunta: item.pregunta || item.question || item.text || "Pregunta sin texto",
                opciones: opciones,
                correcta: correctaIndex
            };
        });

        if (!Array.isArray(todasLasPreguntas) || todasLasPreguntas.length === 0) {
            throw new Error("El archivo de preguntas está vacío o no tiene el formato esperado.");
        }
        
        preguntasPartida = [...todasLasPreguntas].sort(() => Math.random() - 0.5).slice(0, 5);
        preguntaActualIndex = 0;
        puntajeActual = 0;
        
        const puntosTop = document.getElementById('puntos-trivia');
        if (puntosTop) puntosTop.innerText = puntajeActual;
        const statPuntos = document.getElementById('stat-puntos');
        if (statPuntos) statPuntos.innerText = `${puntajeActual} pts`;
        
        mostrarPreguntaActual();
    } catch (error) {
        console.error("Error en trivia:", error);
        if (preguntaTexto) preguntaTexto.innerText = "⚠️ Error al cargar la trivia";
        if (contenedorOpciones) {
            contenedorOpciones.innerHTML = `<p style="color: #ff6b6b; font-size: 13px; text-align: center; padding: 10px;">${error.message}</p>`;
        }
    }
}

function mostrarPreguntaActual() {
    if (preguntaActualIndex >= preguntasPartida.length) {
        mostrarResultadosFinales();
        return;
    }

    const q = preguntasPartida[preguntaActualIndex];
    const preguntaTexto = document.getElementById('pregunta-texto');
    const contenedorOpciones = document.getElementById('opciones-container');
    const resultadoDiv = document.getElementById('trivia-resultado');
    const btnSiguiente = document.getElementById('btn-siguiente');

    if (preguntaTexto) {
        preguntaTexto.innerText = `(${preguntaActualIndex + 1}/5) ${q.pregunta}`;
    }
    
    if (contenedorOpciones) {
        contenedorOpciones.innerHTML = '';
    }
    
    if (resultadoDiv) resultadoDiv.innerText = '';
    if (btnSiguiente) {
        btnSiguiente.style.display = 'none';
        btnSiguiente.innerText = "Siguiente Pregunta";
        btnSiguiente.onclick = null;
    }

    const opciones = q.opciones || [];
    opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.innerText = opcion;
        btn.style.cssText = 'padding: 12px 15px; background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; cursor: pointer; text-align: left; font-size: 14px; transition: background 0.2s; width: 100%;';
        
        btn.addEventListener('click', () => verificarRespuesta(index, q.correcta, btn));
        if (contenedorOpciones) contenedorOpciones.appendChild(btn);
    });
}

function verificarRespuesta(seleccionada, correcta, btnElement) {
    const botones = document.querySelectorAll('#opciones-container button');
    botones.forEach(b => b.disabled = true);

    const resultadoDiv = document.getElementById('trivia-resultado');

    if (seleccionada === correcta) {
        btnElement.style.background = '#2a9d8f';
        if (resultadoDiv) {
            resultadoDiv.innerText = "¡Correcto! ⚾";
            resultadoDiv.style.color = '#2a9d8f';
        }
        puntajeActual += 10;
        
        const puntosTop = document.getElementById('puntos-trivia');
        if (puntosTop) puntosTop.innerText = puntajeActual;

        const statPuntos = document.getElementById('stat-puntos');
        if (statPuntos) statPuntos.innerText = `${puntajeActual} pts`;
    } else {
        btnElement.style.background = '#e63946';
        if (botones[correcta]) botones[correcta].style.background = '#2a9d8f';
        if (resultadoDiv) {
            resultadoDiv.innerText = "¡Incorrecto!";
            resultadoDiv.style.color = '#e63946';
        }
    }

    const btnSiguiente = document.getElementById('btn-siguiente');
    if (btnSiguiente) {
        btnSiguiente.style.display = 'block';
        btnSiguiente.onclick = () => {
            preguntaActualIndex++;
            mostrarPreguntaActual();
        };
    }
}

function mostrarResultadosFinales() {
    const triviaCard = document.getElementById('trivia-card');
    if (triviaCard) {
        triviaCard.innerHTML = `
            <h3 style="color: #ffcc00; margin-bottom: 10px;">¡Trivia Completada! 🎉</h3>
            <p style="margin: 15px 0; color: #fff;">Has puesto a prueba tus conocimientos.</p>
            <p style="font-size: 20px; font-weight: bold; color: #ffcc00;">Puntaje Final: ${puntajeActual} / 50 pts</p>
        `;
    }
    
    const resultadoDiv = document.getElementById('trivia-resultado');
    if (resultadoDiv) resultadoDiv.innerText = "";
    
    const btnSiguiente = document.getElementById('btn-siguiente');
    if (btnSiguiente) {
        btnSiguiente.innerText = "Jugar de Nuevo";
        btnSiguiente.style.display = 'block';
        btnSiguiente.onclick = () => cargarTrivia();
    }
}