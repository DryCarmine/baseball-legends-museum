document.addEventListener("DOMContentLoaded", () => {

    const scene = document.getElementById("ar-scene");

    const status = document.getElementById("status");
    const teamName = document.getElementById("team-name");
    const instructions = document.getElementById("instructions");

    const rotateLeft = document.getElementById("rotate-left");
    const rotateRight = document.getElementById("rotate-right");
    const toggleMotion = document.getElementById("toggle-motion");
    const toggleParticles = document.getElementById("toggle-particles");
    const capturePhoto = document.getElementById("capture-photo");


    const teams = [
        {
            id: "brewers",
            name: "Milwaukee Brewers",
            targetIndex: 0,
            target: document.getElementById("target-brewers"),
            root: document.getElementById("root-brewers"),
            model: document.getElementById("model-brewers"),
            particleGroup: document.getElementById("particles-brewers"),
            loaded: false,
            particles: []
        },
        {
            id: "cubs",
            name: "Chicago Cubs",
            targetIndex: 1,
            target: document.getElementById("target-cubs"),
            root: document.getElementById("root-cubs"),
            model: document.getElementById("model-cubs"),
            particleGroup: document.getElementById("particles-cubs"),
            loaded: false,
            particles: []
        },
        {
            id: "twins",
            name: "Minnesota Twins",
            targetIndex: 2,
            target: document.getElementById("target-twins"),
            root: document.getElementById("root-twins"),
            model: document.getElementById("model-twins"),
            particleGroup: document.getElementById("particles-twins"),
            loaded: false,
            particles: []
        },
        {
            id: "braves",
            name: "Atlanta Braves",
            targetIndex: 3,
            target: document.getElementById("target-braves"),
            root: document.getElementById("root-braves"),
            model: document.getElementById("model-braves"),
            particleGroup: document.getElementById("particles-braves"),
            loaded: false,
            particles: []
        },
        {
            id: "dbacks",
            name: "Arizona Diamondbacks",
            targetIndex: 4,
            target: document.getElementById("target-dbacks"),
            root: document.getElementById("root-dbacks"),
            model: document.getElementById("model-dbacks"),
            particleGroup: document.getElementById("particles-dbacks"),
            loaded: false,
            particles: []
        }
    ];


    if (!scene || teams.some(team => !team.target || !team.root || !team.model || !team.particleGroup)) {
        console.error("AR: faltan elementos esenciales en ar.html.");
        return;
    }


    let movementPaused = false;
    let particlesEnabled = true;
    let previousTime = performance.now();
    let activeTeam = null;


    const FLOAT_HEIGHT = 0.045;
    const FLOAT_SPEED = 0.0024;
    const ROTATION_STEP = Math.PI / 12;


    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }


    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }


    function setInstructions(message) {
        if (instructions) {
            instructions.textContent = message;
        }
    }


    function setTeamName(message) {
        if (teamName) {
            teamName.textContent = message;
        }
    }


    function teamVisible(team) {
        return !!team.target.object3D.visible;
    }


    function canUseControls() {
        return !!(
            activeTeam &&
            activeTeam.loaded &&
            teamVisible(activeTeam)
        );
    }


    function updateControls() {
        const enabled = canUseControls();

        if (rotateLeft) rotateLeft.disabled = !enabled;
        if (rotateRight) rotateRight.disabled = !enabled;
        if (toggleMotion) toggleMotion.disabled = !enabled;
        if (toggleParticles) toggleParticles.disabled = !enabled;
        if (capturePhoto) capturePhoto.disabled = !enabled;
    }


    function updateMovementButton() {
        if (!toggleMotion) return;

        if (movementPaused) {
            toggleMotion.textContent = "▶ Reanudar movimiento";
            toggleMotion.classList.add("active");
        } else {
            toggleMotion.textContent = "⏸ Pausar movimiento";
            toggleMotion.classList.remove("active");
        }
    }


    function updateParticlesButton() {
        if (!toggleParticles) return;

        teams.forEach(team => {
            team.particleGroup.object3D.visible = particlesEnabled;
        });

        if (particlesEnabled) {
            toggleParticles.textContent = "✨ Partículas";
            toggleParticles.classList.add("active");
        } else {
            toggleParticles.textContent = "○ Sin partículas";
            toggleParticles.classList.remove("active");
        }
    }


    function createParticlesForTeam(team) {

        const PARTICLE_COUNT = 20;

        for (let i = 0; i < PARTICLE_COUNT; i++) {

            const particle =
                document.createElement("a-sphere");

            const particleData = {
                x: randomBetween(-0.42, 0.42),
                y: randomBetween(0.02, 0.82),
                z: randomBetween(-0.15, 0.18),
                speed: randomBetween(0.00006, 0.00014),
                drift: randomBetween(0.6, 1.6),
                phase: randomBetween(0, Math.PI * 2)
            };

            particle.setAttribute(
                "radius",
                randomBetween(0.008, 0.018)
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

            particle.object3D.position.set(
                particleData.x,
                particleData.y,
                particleData.z
            );

            team.particleGroup.appendChild(particle);

            team.particles.push({
                element: particle,
                ...particleData
            });
        }
    }


    function rotateModel(direction) {
        if (!canUseControls()) return;
        activeTeam.root.object3D.rotation.y +=
            ROTATION_STEP * direction;
    }


    if (rotateLeft) {
        rotateLeft.addEventListener(
            "click",
            () => rotateModel(1)
        );
    }


    if (rotateRight) {
        rotateRight.addEventListener(
            "click",
            () => rotateModel(-1)
        );
    }


    if (toggleMotion) {
        toggleMotion.addEventListener(
            "click",
            () => {

                if (!canUseControls()) return;

                movementPaused = !movementPaused;

                if (movementPaused) {
                    teams.forEach(team => {
                        team.root.object3D.position.y = 0;
                    });
                }

                updateMovementButton();
            }
        );
    }


    if (toggleParticles) {
        toggleParticles.addEventListener(
            "click",
            () => {

                if (!canUseControls()) return;

                particlesEnabled = !particlesEnabled;
                updateParticlesButton();
            }
        );
    }


    function drawVideoCover(ctx, video, outputWidth, outputHeight) {

        const sourceWidth =
            video.videoWidth;

        const sourceHeight =
            video.videoHeight;

        const sourceRatio =
            sourceWidth / sourceHeight;

        const outputRatio =
            outputWidth / outputHeight;

        let sx = 0;
        let sy = 0;
        let sw = sourceWidth;
        let sh = sourceHeight;

        if (sourceRatio > outputRatio) {
            sw = sourceHeight * outputRatio;
            sx = (sourceWidth - sw) / 2;
        } else {
            sh = sourceWidth / outputRatio;
            sy = (sourceHeight - sh) / 2;
        }

        ctx.drawImage(
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

        if (!canUseControls()) return;

        try {

            const video =
                document.querySelector("video");

            const renderer =
                scene.renderer;

            const activeCamera =
                scene.camera;

            if (!video || !renderer || !activeCamera) {
                throw new Error("No se encontró la cámara o el renderer.");
            }

            if (!video.videoWidth || !video.videoHeight) {
                throw new Error("La cámara todavía no tiene dimensiones válidas.");
            }

            renderer.render(
                scene.object3D,
                activeCamera
            );

            const gl =
                renderer.getContext();

            if (gl && typeof gl.finish === "function") {
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
                document.createElement("canvas");

            photoCanvas.width = width;
            photoCanvas.height = height;

            const context =
                photoCanvas.getContext(
                    "2d",
                    { alpha: false }
                );

            if (!context) {
                throw new Error("No se pudo crear el canvas de captura.");
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
                `${Math.max(16, Math.round(width * 0.025))}px Arial`;
            context.textAlign = "right";
            context.textBaseline = "bottom";
            context.fillStyle = "rgba(255,255,255,0.92)";
            context.shadowColor = "rgba(0,0,0,0.80)";
            context.shadowBlur = 5;

            context.fillText(
                activeTeam
                    ? `${activeTeam.name} • Baseball Legends Museum AR`
                    : "Baseball Legends Museum AR",
                width - 18,
                height - 18
            );

            context.restore();

            photoCanvas.toBlob(
                blob => {

                    if (!blob) {
                        setStatus("⚠️ No se pudo generar la foto");
                        return;
                    }

                    const url =
                        URL.createObjectURL(blob);

                    const link =
                        document.createElement("a");

                    const now =
                        new Date();

                    const stamp =
                        [
                            now.getFullYear(),
                            String(now.getMonth() + 1).padStart(2, "0"),
                            String(now.getDate()).padStart(2, "0"),
                            "-",
                            String(now.getHours()).padStart(2, "0"),
                            String(now.getMinutes()).padStart(2, "0"),
                            String(now.getSeconds()).padStart(2, "0")
                        ].join("");

                    link.href = url;
                    link.download = `baseball-legends-ar-${stamp}.png`;

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    setTimeout(
                        () => {
                            URL.revokeObjectURL(url);
                        },
                        2000
                    );

                    setStatus("📸 Foto capturada");

                    setTimeout(
                        () => {

                            if (canUseControls()) {
                                setStatus("🎯 MARCADOR DETECTADO");
                            } else {
                                setStatus("🔎 Buscando marcador...");
                            }

                        },
                        1500
                    );
                },
                "image/png"
            );

        } catch (error) {
            console.error("Error al tomar la foto AR:", error);
            setStatus("⚠️ Error al tomar la foto");
        }
    }


    if (capturePhoto) {
        capturePhoto.addEventListener(
            "click",
            captureARPhoto
        );
    }


    function chooseActiveVisibleTeam() {

        const visibleLoaded = teams.filter(
            team => team.loaded && teamVisible(team)
        );

        if (visibleLoaded.length > 0) {
            activeTeam = visibleLoaded[visibleLoaded.length - 1];
            setTeamName(`Equipo activo: ${activeTeam.name}`);
            setInstructions("Usa los controles o toma una fotografía AR.");
            setStatus("🎯 MARCADOR DETECTADO");
        } else {
            activeTeam = null;
            setTeamName("Equipo activo: ninguno");
            setInstructions("Vuelve a enfocar una de las tarjetas Topps.");
            setStatus("🔎 Buscando marcador...");
        }

        updateControls();
    }


    function attachTeamEvents(team) {

        team.target.addEventListener(
            "targetFound",
            () => {
                activeTeam = team;
                setStatus("🎯 MARCADOR DETECTADO");
                setTeamName(`Equipo activo: ${team.name}`);
                setInstructions("Usa los controles o toma una fotografía AR.");
                updateControls();
                console.log(`✅ Marcador detectado: ${team.name}`);
            }
        );

        team.target.addEventListener(
            "targetLost",
            () => {
                if (activeTeam && activeTeam.id === team.id) {
                    chooseActiveVisibleTeam();
                } else {
                    updateControls();
                }
            }
        );

        team.model.addEventListener(
            "model-loaded",
            () => {
                team.loaded = true;
                console.log(`✅ Modelo cargado: ${team.name}`);
                updateControls();
            }
        );

        team.model.addEventListener(
            "model-error",
            event => {
                team.loaded = false;
                console.error(`❌ Error de modelo en ${team.name}:`, event);
                if (activeTeam && activeTeam.id === team.id) {
                    setStatus("⚠️ Error cargando modelo");
                }
                updateControls();
            }
        );
    }


    function animate(currentTime) {

        const delta =
            Math.min(
                currentTime - previousTime,
                50
            );

        previousTime = currentTime;

        teams.forEach(team => {

            if (!team.loaded || !teamVisible(team)) {
                return;
            }

            if (!movementPaused) {
                team.root.object3D.position.y =
                    Math.sin(currentTime * FLOAT_SPEED) *
                    FLOAT_HEIGHT;
            }

            if (particlesEnabled) {
                team.particles.forEach(
                    particle => {

                        particle.y +=
                            delta * particle.speed;

                        const offsetX =
                            Math.sin(
                                currentTime * 0.001 * particle.drift +
                                particle.phase
                            ) * 0.025;

                        particle.element.object3D.position.set(
                            particle.x + offsetX,
                            particle.y,
                            particle.z
                        );

                        if (particle.y > 0.9) {
                            particle.y = randomBetween(0.01, 0.12);
                            particle.x = randomBetween(-0.42, 0.42);
                            particle.z = randomBetween(-0.15, 0.18);
                        }
                    }
                );
            }

        });

        requestAnimationFrame(animate);
    }


    scene.addEventListener(
        "arReady",
        () => {
            setStatus("✅ Cámara lista — buscando marcador");
            setTeamName("Equipo activo: ninguno");
            setInstructions("Apunta la cámara a una de las 5 tarjetas Topps configuradas.");
            console.log("✅ MindAR iniciado");
        }
    );


    scene.addEventListener(
        "arError",
        event => {
            setStatus("❌ Error iniciando AR");
            console.error("MindAR error:", event);
        }
    );


    teams.forEach(team => {
        createParticlesForTeam(team);
        attachTeamEvents(team);
    });

    updateMovementButton();
    updateParticlesButton();
    updateControls();

    requestAnimationFrame(animate);

});
