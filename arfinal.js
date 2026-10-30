console.log("✅ arfinal.js cargado");

(function () {

    function startWhenReady() {

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                initAR,
                { once: true }
            );

        } else {

            initAR();

        }
    }


    function initAR() {

        const status =
            document.getElementById("status");


        function setStatus(message) {

            if (status) {
                status.textContent = message;
            }

            console.log("[AR]", message);

        }


        /*
         * Si ocurre cualquier error de JavaScript durante el arranque,
         * lo mostramos en pantalla para evitar quedarse eternamente
         * en "Iniciando AR...".
         */
        window.addEventListener(
            "error",
            event => {

                console.error(
                    "Error global AR:",
                    event.error || event.message
                );

                setStatus(
                    "❌ Error JS — revisa consola"
                );

            }
        );


        window.addEventListener(
            "unhandledrejection",
            event => {

                console.error(
                    "Promesa rechazada en AR:",
                    event.reason
                );

                setStatus(
                    "❌ Error cargando AR"
                );

            }
        );


        try {

            setStatus(
                "✅ JS listo — configurando AR..."
            );


            const scene =
                document.getElementById("ar-scene");


            const teamName =
                document.getElementById("team-name");


            const instructions =
                document.getElementById("instructions");


            const rotateLeft =
                document.getElementById("rotate-left");


            const rotateRight =
                document.getElementById("rotate-right");


            const toggleMotion =
                document.getElementById("toggle-motion");


            const toggleParticles =
                document.getElementById("toggle-particles");


            const capturePhoto =
                document.getElementById("capture-photo");


            const historyButton =
                document.getElementById("history-button");

            const historyModal =
                document.getElementById("team-history-modal");

            const historyTitle =
                document.getElementById("team-history-title");

            const historyBody =
                document.getElementById("team-history-body");

            const historyClose =
                document.getElementById("history-close");


            if (!scene) {

                throw new Error(
                    "No se encontró #ar-scene"
                );

            }


            const teams = [
                createTeam(
                    "brewers",
                    "Milwaukee Brewers",
                    0
                ),

                createTeam(
                    "cubs",
                    "Chicago Cubs",
                    1
                ),

                createTeam(
                    "twins",
                    "Minnesota Twins",
                    2
                ),

                createTeam(
                    "braves",
                    "Atlanta Braves",
                    3
                ),

                createTeam(
                    "dbacks",
                    "Arizona Diamondbacks",
                    4
                )
            ];


            function createTeam(
                id,
                name,
                targetIndex
            ) {

                const team = {
                    id,
                    name,
                    targetIndex,

                    target:
                        document.getElementById(
                            `target-${id}`
                        ),

                    root:
                        document.getElementById(
                            `root-${id}`
                        ),

                    model:
                        document.getElementById(
                            `model-${id}`
                        ),

                    particleGroup:
                        document.getElementById(
                            `particles-${id}`
                        ),

                    loaded: false,
                    detected: false,
                    particles: []
                };


                if (
                    !team.target ||
                    !team.root ||
                    !team.model ||
                    !team.particleGroup
                ) {

                    throw new Error(
                        `Faltan elementos AR del equipo: ${name}`
                    );

                }


                return team;

            }


            let activeTeam = null;

            let movementPaused = false;

            let particlesEnabled = true;

            let previousTime =
                performance.now();


            const FLOAT_HEIGHT =
                0.045;


            const FLOAT_SPEED =
                0.0024;


            const ROTATION_STEP =
                Math.PI / 12;


            function randomBetween(
                min,
                max
            ) {

                return (
                    Math.random() *
                    (max - min) +
                    min
                );

            }


            function setInstructions(
                message
            ) {

                if (instructions) {

                    instructions.textContent =
                        message;

                }

            }


            function setTeamName(
                message
            ) {

                if (teamName) {

                    teamName.textContent =
                        message;

                }

            }


            function canUseControls() {

                return !!(
                    activeTeam &&
                    activeTeam.loaded &&
                    activeTeam.detected
                );

            }


            function updateControls() {

                const enabled =
                    canUseControls();


                if (rotateLeft) {
                    rotateLeft.disabled =
                        !enabled;
                }


                if (rotateRight) {
                    rotateRight.disabled =
                        !enabled;
                }


                if (toggleMotion) {
                    toggleMotion.disabled =
                        !enabled;
                }


                if (toggleParticles) {
                    toggleParticles.disabled =
                        !enabled;
                }


                if (capturePhoto) {
                    capturePhoto.disabled =
                        !enabled;
                }


                if (historyButton) {
                    historyButton.disabled = !enabled;
                }

            }


            function updateMovementButton() {

                if (!toggleMotion) {
                    return;
                }


                if (movementPaused) {

                    toggleMotion.textContent =
                        "▶ Reanudar movimiento";

                    toggleMotion.classList.add(
                        "active"
                    );

                } else {

                    toggleMotion.textContent =
                        "⏸ Pausar movimiento";

                    toggleMotion.classList.remove(
                        "active"
                    );

                }

            }


            function updateParticlesButton() {

                teams.forEach(
                    team => {

                        team.particleGroup.setAttribute(
                            "visible",
                            particlesEnabled
                        );

                    }
                );


                if (!toggleParticles) {
                    return;
                }


                if (particlesEnabled) {

                    toggleParticles.textContent =
                        "✨ Partículas";

                    toggleParticles.classList.add(
                        "active"
                    );

                } else {

                    toggleParticles.textContent =
                        "○ Sin partículas";

                    toggleParticles.classList.remove(
                        "active"
                    );

                }

            }


            function createParticlesForTeam(
                team
            ) {

                const PARTICLE_COUNT =
                    20;


                for (
                    let i = 0;
                    i < PARTICLE_COUNT;
                    i++
                ) {

                    const particle =
                        document.createElement(
                            "a-sphere"
                        );


                    const data = {
                        x:
                            randomBetween(
                                -0.42,
                                0.42
                            ),

                        y:
                            randomBetween(
                                0.02,
                                0.82
                            ),

                        z:
                            randomBetween(
                                -0.15,
                                0.18
                            ),

                        speed:
                            randomBetween(
                                0.00006,
                                0.00014
                            ),

                        drift:
                            randomBetween(
                                0.6,
                                1.6
                            ),

                        phase:
                            randomBetween(
                                0,
                                Math.PI * 2
                            )
                    };


                    particle.setAttribute(
                        "radius",
                        randomBetween(
                            0.008,
                            0.018
                        )
                    );


                    particle.setAttribute(
                        "segments-height",
                        8
                    );


                    particle.setAttribute(
                        "segments-width",
                        8
                    );


                    const color =
                        i % 3 === 0
                            ? "#fff4c2"
                            : "#d4af37";


                    particle.setAttribute(
                        "material",
                        `
                            color: ${color};
                            opacity: 0.82;
                            transparent: true;
                            shader: flat;
                        `
                    );


                    /*
                     * Usamos atributo position en vez de object3D aquí.
                     * De esta forma no dependemos de que A-Frame haya
                     * inicializado el objeto recién creado.
                     */
                    particle.setAttribute(
                        "position",
                        `${data.x} ${data.y} ${data.z}`
                    );


                    team.particleGroup.appendChild(
                        particle
                    );


                    team.particles.push({
                        element: particle,
                        ...data
                    });

                }

            }


            const TEAM_HISTORIES = {
                brewers: {
                    subtitle: "De Seattle a Milwaukee",
                    intro: "La franquicia nació en 1969 como Seattle Pilots. Tras una sola temporada en Washington? No: en Seattle, el club se trasladó a Milwaukee en 1970 y adoptó el nombre Brewers, en honor a la larga tradición cervecera de la ciudad.",
                    facts: [
                        ["1969", "Debutó como Seattle Pilots en la Liga Americana."],
                        ["1970", "Se mudó a Milwaukee y pasó a llamarse Brewers."],
                        ["1982", "Ganó el banderín de la Liga Americana y disputó su primera Serie Mundial."],
                        ["1998", "Se incorporó a la Liga Nacional, dentro de la División Central."],
                        ["Identidad", "Su nombre y guante con pelota representan la cultura beisbolera de Milwaukee."]
                    ]
                },
                cubs: {
                    subtitle: "Una de las franquicias fundadoras de la Liga Nacional",
                    intro: "Los Cubs forman parte de la historia más antigua del béisbol profesional. La franquicia comenzó en 1876 y atravesó distintas denominaciones antes de consolidar el nombre Chicago Cubs. Wrigley Field y sus aficionados son parte esencial de su identidad.",
                    facts: [
                        ["1876", "La franquicia comenzó como parte de la temporada inaugural de la Liga Nacional."],
                        ["1907–1908", "Conquistó títulos consecutivos de Serie Mundial."],
                        ["1916", "Se instaló en el estadio que hoy conocemos como Wrigley Field."],
                        ["2016", "Volvió a ganar la Serie Mundial, poniendo fin a una espera de 108 años."],
                        ["Tradición", "El Wrigley Field, el letrero rojo y la hiedra de sus jardines son símbolos del club."]
                    ]
                },
                twins: {
                    subtitle: "De Washington a Minnesota",
                    intro: "La historia de los Twins comenzó en Washington, D. C., como Senators. En 1961 la franquicia se trasladó a Minnesota y adoptó el nombre Twins, en referencia a las ciudades gemelas de Minneapolis y St. Paul.",
                    facts: [
                        ["1901", "La franquicia comenzó como Washington Senators, en el primer año de la Liga Americana."],
                        ["1924", "Washington ganó su primera Serie Mundial."],
                        ["1961", "La franquicia se mudó a Minnesota y nació el nombre Twins."],
                        ["1987 y 1991", "Ganó dos Series Mundiales representando a Minnesota."],
                        ["Identidad", "El nombre Twins celebra la conexión entre Minneapolis y St. Paul."]
                    ]
                },
                braves: {
                    subtitle: "Una franquicia con varias ciudades y generaciones",
                    intro: "Los Braves son una de las franquicias más antiguas del béisbol profesional. Su historia pasó por Boston y Milwaukee antes de establecerse en Atlanta en 1966. A lo largo de más de un siglo, el club ha construido una identidad reconocible en cada una de esas ciudades.",
                    facts: [
                        ["1871", "La franquicia nació en Boston como Boston Red Stockings."],
                        ["1914", "Los Boston Braves protagonizaron la remontada conocida como Miracle Braves y ganaron la Serie Mundial."],
                        ["1953", "La franquicia se trasladó a Milwaukee y se convirtió en Milwaukee Braves."],
                        ["1966", "Llegó a Atlanta y adoptó su actual sede."],
                        ["1995 y 2021", "Ganó la Serie Mundial ya como Atlanta Braves; también había sido campeón en Milwaukee en 1957."]
                    ]
                },
                dbacks: {
                    subtitle: "Una nueva franquicia que llegó rápido a la cima",
                    intro: "Arizona Diamondbacks se incorporó a las Grandes Ligas en 1998 como equipo de expansión. En apenas su cuarta temporada alcanzó la Serie Mundial y derrotó a los New York Yankees en una de las finales más recordadas de comienzos del siglo XXI.",
                    facts: [
                        ["1998", "Debutó en MLB como franquicia de expansión en la Liga Nacional."],
                        ["2001", "Ganó su primera Serie Mundial, apenas cuatro temporadas después de su debut."],
                        ["2001", "La Serie Mundial se decidió en el séptimo juego frente a los Yankees."],
                        ["2007", "Volvió a ganar la División Oeste de la Liga Nacional y alcanzó la Serie de Campeonato."],
                        ["2023", "Regresó a la Serie Mundial y obtuvo el banderín de la Liga Nacional."]
                    ]
                }
            };

            function openTeamHistory() {
                if (!canUseControls() || !activeTeam || !historyModal) return;

                const history = TEAM_HISTORIES[activeTeam.id];
                if (!history) return;

                historyTitle.textContent = activeTeam.name;
                historyBody.replaceChildren();

                const subtitle = document.createElement("p");
                subtitle.className = "history-kicker";
                subtitle.textContent = history.subtitle;
                historyBody.appendChild(subtitle);

                const intro = document.createElement("p");
                intro.textContent = history.intro;
                historyBody.appendChild(intro);

                const heading = document.createElement("h3");
                heading.textContent = "Momentos clave";
                historyBody.appendChild(heading);

                const list = document.createElement("ul");
                history.facts.forEach(([year, detail]) => {
                    const item = document.createElement("li");
                    const strong = document.createElement("strong");
                    strong.textContent = `${year} — `;
                    item.append(strong, document.createTextNode(detail));
                    list.appendChild(item);
                });
                historyBody.appendChild(list);

                historyModal.classList.add("open");
                historyModal.setAttribute("aria-hidden", "false");
                if (historyClose) historyClose.focus();
            }

            function closeTeamHistory() {
                if (!historyModal) return;
                historyModal.classList.remove("open");
                historyModal.setAttribute("aria-hidden", "true");
            }

            if (historyButton) {
                historyButton.addEventListener("click", openTeamHistory);
            }
            if (historyClose) {
                historyClose.addEventListener("click", closeTeamHistory);
            }
            if (historyModal) {
                historyModal.addEventListener("click", event => {
                    if (event.target === historyModal) closeTeamHistory();
                });
            }
            document.addEventListener("keydown", event => {
                if (event.key === "Escape") closeTeamHistory();
            });


            function chooseActiveTeam() {

                const visibleTeam =
                    teams.find(
                        team =>
                            team.detected &&
                            team.loaded
                    );


                if (visibleTeam) {

                    activeTeam =
                        visibleTeam;


                    setStatus(
                        "🎯 MARCADOR DETECTADO"
                    );


                    setTeamName(
                        `Equipo activo: ${activeTeam.name}`
                    );


                    setInstructions(
                        "Usa los controles o toma una fotografía AR."
                    );

                } else {

                    activeTeam =
                        null;


                    setStatus(
                        "🔎 Buscando marcador..."
                    );


                    setTeamName(
                        "Equipo activo: ninguno"
                    );


                    setInstructions(
                        "Vuelve a enfocar una de las 5 tarjetas."
                    );

                }


                updateControls();

            }


            teams.forEach(
                team => {

                    team.target.addEventListener(
                        "targetFound",
                        () => {

                            team.detected = true;

                            activeTeam =
                                team;


                            setStatus(
                                "🎯 MARCADOR DETECTADO"
                            );


                            setTeamName(
                                `Equipo activo: ${team.name}`
                            );


                            setInstructions(
                                "Usa los controles o toma una fotografía AR."
                            );


                            updateControls();


                            console.log(
                                `✅ Target ${team.targetIndex}: ${team.name}`
                            );

                        }
                    );


                    team.target.addEventListener(
                        "targetLost",
                        () => {

                            team.detected =
                                false;


                            if (
                                activeTeam &&
                                activeTeam.id ===
                                    team.id
                            ) {

                                chooseActiveTeam();

                            } else {

                                updateControls();

                            }

                        }
                    );


                    team.model.addEventListener(
                        "model-loaded",
                        () => {

                            team.loaded =
                                true;


                            console.log(
                                `✅ Modelo cargado: ${team.name}`
                            );


                            updateControls();

                        }
                    );


                    team.model.addEventListener(
                        "model-error",
                        event => {

                            team.loaded =
                                false;


                            console.error(
                                `❌ Modelo falló: ${team.name}`,
                                event
                            );


                            if (
                                activeTeam &&
                                activeTeam.id ===
                                    team.id
                            ) {

                                setStatus(
                                    "⚠️ Error cargando modelo"
                                );

                            }


                            updateControls();

                        }
                    );

                }
            );


            /*
             * Estos listeners se instalan ANTES de esperar a que
             * A-Frame termine de arrancar.
             */
            scene.addEventListener(
                "arReady",
                () => {

                    setStatus(
                        "✅ Cámara lista — buscando marcador"
                    );


                    setInstructions(
                        "Apunta la cámara a una de las 5 tarjetas."
                    );


                    console.log(
                        "✅ MindAR listo"
                    );

                }
            );


            scene.addEventListener(
                "arError",
                event => {

                    console.error(
                        "MindAR error:",
                        event
                    );


                    setStatus(
                        "❌ Error iniciando MindAR"
                    );

                }
            );


            scene.addEventListener(
                "loaded",
                () => {

                    console.log(
                        "✅ Escena A-Frame cargada"
                    );


                    /*
                     * Las partículas se crean después de que A-Frame
                     * ya terminó de inicializar la escena.
                     */
                    teams.forEach(
                        team => {

                            if (
                                team.particles.length ===
                                0
                            ) {

                                createParticlesForTeam(
                                    team
                                );

                            }

                        }
                    );


                    updateParticlesButton();


                    setStatus(
                        "⏳ Cargando targets AR..."
                    );

                },
                { once: true }
            );


            // =============================================
            // ROTACIÓN
            // =============================================

            function rotateModel(
                direction
            ) {

                if (!canUseControls()) {
                    return;
                }


                activeTeam.root
                    .object3D
                    .rotation
                    .y +=
                    ROTATION_STEP *
                    direction;

            }


            if (rotateLeft) {

                rotateLeft.addEventListener(
                    "click",
                    () => {

                        rotateModel(1);

                    }
                );

            }


            if (rotateRight) {

                rotateRight.addEventListener(
                    "click",
                    () => {

                        rotateModel(-1);

                    }
                );

            }


            // =============================================
            // MOVIMIENTO
            // =============================================

            if (toggleMotion) {

                toggleMotion.addEventListener(
                    "click",
                    () => {

                        if (
                            !canUseControls()
                        ) {
                            return;
                        }


                        movementPaused =
                            !movementPaused;


                        if (
                            movementPaused
                        ) {

                            teams.forEach(
                                team => {

                                    if (
                                        team.root &&
                                        team.root.object3D
                                    ) {

                                        team.root
                                            .object3D
                                            .position
                                            .y = 0;

                                    }

                                }
                            );

                        }


                        updateMovementButton();

                    }
                );

            }


            // =============================================
            // PARTÍCULAS
            // =============================================

            if (toggleParticles) {

                toggleParticles.addEventListener(
                    "click",
                    () => {

                        if (
                            !canUseControls()
                        ) {
                            return;
                        }


                        particlesEnabled =
                            !particlesEnabled;


                        updateParticlesButton();

                    }
                );

            }


            // =============================================
            // FOTO AR
            // =============================================

            function drawVideoCover(
                context,
                video,
                outputWidth,
                outputHeight
            ) {

                const sourceWidth =
                    video.videoWidth;


                const sourceHeight =
                    video.videoHeight;


                const sourceRatio =
                    sourceWidth /
                    sourceHeight;


                const outputRatio =
                    outputWidth /
                    outputHeight;


                let sx = 0;
                let sy = 0;

                let sw =
                    sourceWidth;

                let sh =
                    sourceHeight;


                if (
                    sourceRatio >
                    outputRatio
                ) {

                    sw =
                        sourceHeight *
                        outputRatio;


                    sx =
                        (
                            sourceWidth -
                            sw
                        ) / 2;

                } else {

                    sh =
                        sourceWidth /
                        outputRatio;


                    sy =
                        (
                            sourceHeight -
                            sh
                        ) / 2;

                }


                context.drawImage(
                    video,

                    sx,
                    sy,
                    sw,
                    sh,

                    0,
                    0,
                    outputWidth,
                    outputHeight
                );

            }


            function captureARPhoto() {

                if (!canUseControls()) {
                    return;
                }


                try {

                    const video =
                        document.querySelector(
                            "video"
                        );


                    const renderer =
                        scene.renderer;


                    const camera =
                        scene.camera;


                    if (
                        !video ||
                        !renderer ||
                        !camera
                    ) {

                        throw new Error(
                            "Cámara o renderer no disponibles."
                        );

                    }


                    renderer.render(
                        scene.object3D,
                        camera
                    );


                    const gl =
                        renderer.getContext();


                    if (
                        gl &&
                        typeof gl.finish ===
                            "function"
                    ) {

                        gl.finish();

                    }


                    const arCanvas =
                        renderer.domElement;


                    const width =
                        arCanvas.width ||
                        video.videoWidth;


                    const height =
                        arCanvas.height ||
                        video.videoHeight;


                    const photoCanvas =
                        document.createElement(
                            "canvas"
                        );


                    photoCanvas.width =
                        width;


                    photoCanvas.height =
                        height;


                    const context =
                        photoCanvas.getContext(
                            "2d",
                            {
                                alpha: false
                            }
                        );


                    if (!context) {

                        throw new Error(
                            "No se pudo crear canvas de foto."
                        );

                    }


                    drawVideoCover(
                        context,
                        video,
                        width,
                        height
                    );


                    context.drawImage(
                        arCanvas,
                        0,
                        0,
                        width,
                        height
                    );


                    context.save();


                    context.font =
                        `${Math.max(
                            16,
                            Math.round(
                                width *
                                0.025
                            )
                        )}px Arial`;


                    context.textAlign =
                        "right";


                    context.textBaseline =
                        "bottom";


                    context.fillStyle =
                        "rgba(255,255,255,0.92)";


                    context.shadowColor =
                        "rgba(0,0,0,0.80)";


                    context.shadowBlur =
                        5;


                    context.fillText(
                        `${activeTeam.name} • Baseball Legends Museum AR`,
                        width - 18,
                        height - 18
                    );


                    context.restore();


                    photoCanvas.toBlob(
                        blob => {

                            if (!blob) {

                                setStatus(
                                    "⚠️ No se pudo generar la foto"
                                );

                                return;

                            }


                            const url =
                                URL.createObjectURL(
                                    blob
                                );


                            const link =
                                document.createElement(
                                    "a"
                                );


                            link.href =
                                url;


                            link.download =
                                `baseball-legends-ar-${Date.now()}.png`;


                            document.body.appendChild(
                                link
                            );


                            link.click();


                            link.remove();


                            setTimeout(
                                () => {

                                    URL.revokeObjectURL(
                                        url
                                    );

                                },
                                2000
                            );


                            setStatus(
                                "📸 Foto capturada"
                            );


                            setTimeout(
                                () => {

                                    chooseActiveTeam();

                                },
                                1400
                            );

                        },
                        "image/png"
                    );


                } catch (error) {

                    console.error(
                        "Error foto AR:",
                        error
                    );


                    setStatus(
                        "⚠️ Error al tomar la foto"
                    );

                }

            }


            if (capturePhoto) {

                capturePhoto.addEventListener(
                    "click",
                    captureARPhoto
                );

            }


            // =============================================
            // ANIMACIÓN
            // =============================================

            function animate(
                currentTime
            ) {

                const delta =
                    Math.min(
                        currentTime -
                        previousTime,
                        50
                    );


                previousTime =
                    currentTime;


                teams.forEach(
                    team => {

                        if (
                            !team.loaded ||
                            !team.detected
                        ) {
                            return;
                        }


                        if (
                            !movementPaused &&
                            team.root.object3D
                        ) {

                            team.root
                                .object3D
                                .position
                                .y =
                                Math.sin(
                                    currentTime *
                                    FLOAT_SPEED
                                ) *
                                FLOAT_HEIGHT;

                        }


                        if (
                            particlesEnabled
                        ) {

                            team.particles.forEach(
                                particle => {

                                    particle.y +=
                                        delta *
                                        particle.speed;


                                    const offsetX =
                                        Math.sin(
                                            currentTime *
                                            0.001 *
                                            particle.drift +
                                            particle.phase
                                        ) *
                                        0.025;


                                    if (
                                        particle.element &&
                                        particle.element.object3D
                                    ) {

                                        particle.element
                                            .object3D
                                            .position
                                            .set(
                                                particle.x +
                                                    offsetX,
                                                particle.y,
                                                particle.z
                                            );

                                    }


                                    if (
                                        particle.y >
                                        0.9
                                    ) {

                                        particle.y =
                                            randomBetween(
                                                0.01,
                                                0.12
                                            );


                                        particle.x =
                                            randomBetween(
                                                -0.42,
                                                0.42
                                            );


                                        particle.z =
                                            randomBetween(
                                                -0.15,
                                                0.18
                                            );

                                    }

                                }
                            );

                        }

                    }
                );


                requestAnimationFrame(
                    animate
                );

            }


            updateMovementButton();

            updateParticlesButton();

            updateControls();


            requestAnimationFrame(
                animate
            );


            /*
             * Si la escena ya estaba cargada cuando el JS inició,
             * creamos también las partículas inmediatamente.
             */
            if (scene.hasLoaded) {

                teams.forEach(
                    team => {

                        if (
                            team.particles.length ===
                            0
                        ) {

                            createParticlesForTeam(
                                team
                            );

                        }

                    }
                );


                updateParticlesButton();


                setStatus(
                    "⏳ Cargando targets AR..."
                );

            } else {

                setStatus(
                    "⏳ Esperando A-Frame..."
                );

            }


        } catch (error) {

            console.error(
                "Error al configurar AR:",
                error
            );


            setStatus(
                "❌ Error configurando AR"
            );

        }

    }


    startWhenReady();

})();
