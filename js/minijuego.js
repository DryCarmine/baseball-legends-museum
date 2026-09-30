/*
 * Baseball Legends Museum
 * Home Run Derby v4
 *
 * Mecánica:
 * - 10 lanzamientos por partida.
 * - Cada lanzamiento tiene un windup aleatorio.
 * - La pelota sólo cruza una vez la zona: si no bateas, es strike.
 * - Tipos de lanzamiento aleatorios con velocidades diferentes.
 * - La dificultad escala con rapidez durante la partida.
 * - Trofeos, mejor puntuación y Puntos del Museo persistentes.
 */

(() => {

  if (
    window.HomeRunDerby &&
    typeof window.HomeRunDerby.destroy === "function"
  ) {
    window.HomeRunDerby.destroy();
  }


  const TOTAL_PITCHES = 10;
  const TRACK_PADDING = 11;

  const MUSEUM_POINTS_KEY =
    "museumPoints";

  const DERBY_SAVE_KEY =
    "blm_derby2";


  const TROPHIES = [
    {
      id: "first_hit",
      icon: "⚾",
      name: "Primer Hit",
      check: s => s.totalHits >= 1
    },
    {
      id: "hr_1",
      icon: "🥉",
      name: "Bate Bronce",
      check: s => s.totalHRs >= 1
    },
    {
      id: "hr_3",
      icon: "🥈",
      name: "Bate Plata",
      check: s => s.totalHRs >= 3
    },
    {
      id: "hr_5",
      icon: "🥇",
      name: "Bate Oro",
      check: s => s.totalHRs >= 5
    },
    {
      id: "hr_10",
      icon: "💎",
      name: "Diamante",
      check: s => s.totalHRs >= 10
    },
    {
      id: "perfect_3",
      icon: "🎯",
      name: "Francotirador",
      check: s => s.sessionPerfects >= 3
    },
    {
      id: "score_200",
      icon: "🌟",
      name: "Estrella",
      check: s => s.totalScore >= 200
    },
    {
      id: "legendary",
      icon: "👑",
      name: "Legendario",
      check: s => s.totalHRs >= 25
    }
  ];


  /*
   * Los perfiles alteran:
   * - tiempo de windup
   * - velocidad de cruce
   * - curva de aceleración
   *
   * La selección es aleatoria en cada lanzamiento.
   */
  const PITCH_TYPES = [
    {
      id: "fastball",
      label: "RECTA",
      weight: 34,
      windupMin: 650,
      windupMax: 1500,
      travelMultiplier: 0.82,
      motion: "linear"
    },
    {
      id: "changeup",
      label: "CAMBIO",
      weight: 23,
      windupMin: 800,
      windupMax: 1800,
      travelMultiplier: 1.14,
      motion: "changeup"
    },
    {
      id: "quick",
      label: "QUICK PITCH",
      weight: 16,
      windupMin: 240,
      windupMax: 620,
      travelMultiplier: 0.76,
      motion: "linear"
    },
    {
      id: "hesitation",
      label: "PAUSA",
      weight: 17,
      windupMin: 1450,
      windupMax: 2550,
      travelMultiplier: 0.86,
      motion: "burst"
    },
    {
      id: "cutter",
      label: "CORTADA",
      weight: 10,
      windupMin: 520,
      windupMax: 1350,
      travelMultiplier: 0.93,
      motion: "cutter"
    }
  ];


  const state = {
    score: 0,
    sessionHRs: 0,
    sessionHits: 0,
    sessionPerfects: 0,

    pitchNum: 0,
    pitchResults: [],

    totalHRs: 0,
    totalHits: 0,
    totalScore: 0,
    bestScore: 0,
    unlocked: [],

    rewardCommitted: false,
    museumEarnedThisGame: 0
  };


  let ballX = 0;
  let ballDir = 1;

  let animId = null;

  let canSwing = false;
  let swingDone = false;

  let currentPitch = null;
  let releaseStartedAt = 0;

  let destroyed = false;

  const timers =
    new Set();


  function byId(id) {
    return document.getElementById(id);
  }


  function clamp(value, min, max) {
    return Math.min(
      max,
      Math.max(
        min,
        value
      )
    );
  }


  function randomBetween(min, max) {

    return (
      min +
      Math.random() *
      (max - min)
    );
  }


  function isMounted() {

    return (
      !destroyed &&
      document.body.contains(
        byId("derby-root")
      )
    );
  }


  function later(fn, ms) {

    const timer =
      setTimeout(
        () => {

          timers.delete(timer);

          if (isMounted()) {
            fn();
          }

        },
        ms
      );

    timers.add(timer);

    return timer;
  }


  function setPitchStatus(
    text,
    mode = "waiting"
  ) {

    const status =
      byId(
        "derby-pitch-status"
      );

    if (!status) {
      return;
    }


    status.textContent =
      text;


    status.classList.remove(
      "waiting",
      "release",
      "missed"
    );


    status.classList.add(
      mode
    );
  }


  function setBallVisible(visible) {

    const ball =
      byId("derby-ball");

    if (!ball) {
      return;
    }


    ball.classList.toggle(
      "visible",
      visible
    );
  }


  function clearTrail() {

    const trail =
      byId("derby-trail");

    if (trail) {

      trail.style.width =
        "0";
    }
  }


  function getMuseumPoints() {

    const value =
      Number(
        localStorage.getItem(
          MUSEUM_POINTS_KEY
        )
      );

    return (
      Number.isFinite(value) &&
      value >= 0
    )
      ? Math.floor(value)
      : 0;
  }


  function setMuseumPoints(value) {

    const safeValue =
      Math.max(
        0,
        Math.floor(
          Number(value) || 0
        )
      );


    localStorage.setItem(
      MUSEUM_POINTS_KEY,
      String(safeValue)
    );


    updateMuseumWallet();


    window.dispatchEvent(
      new CustomEvent(
        "museumPointsChanged",
        {
          detail: {
            points: safeValue
          }
        }
      )
    );


    return safeValue;
  }


  function addMuseumPoints(amount) {

    const safeAmount =
      Math.max(
        0,
        Math.floor(
          Number(amount) || 0
        )
      );


    return setMuseumPoints(
      getMuseumPoints() +
      safeAmount
    );
  }


  function updateMuseumWallet() {

    const wallet =
      byId(
        "derby-museum-points"
      );


    if (wallet) {

      wallet.textContent =
        getMuseumPoints();
    }
  }


  function loadSave() {

    try {

      const data =
        JSON.parse(
          localStorage.getItem(
            DERBY_SAVE_KEY
          ) || "{}"
        );


      state.totalHRs =
        Number(data.totalHRs) || 0;


      state.totalHits =
        Number(data.totalHits) || 0;


      state.totalScore =
        Number(data.totalScore) || 0;


      state.bestScore =
        Number(data.bestScore) || 0;


      state.unlocked =
        Array.isArray(data.unlocked)
          ? data.unlocked
          : [];

    } catch (error) {

      console.warn(
        "[Derby] No se pudo cargar progreso:",
        error
      );
    }
  }


  function save() {

    localStorage.setItem(
      DERBY_SAVE_KEY,
      JSON.stringify({
        totalHRs:
          state.totalHRs,

        totalHits:
          state.totalHits,

        totalScore:
          state.totalScore,

        bestScore:
          state.bestScore,

        unlocked:
          state.unlocked
      })
    );
  }


  function init() {

    if (!byId("derby-root")) {
      return;
    }


    destroyed =
      false;


    loadSave();

    renderTrophies();

    renderPitchDots();

    updateHUD();

    updateMuseumWallet();


    const swingButton =
      byId(
        "derby-btn-swing"
      );


    const restartButton =
      byId(
        "derby-btn-restart"
      );


    swingButton
      ?.addEventListener(
        "pointerdown",
        swing
      );


    restartButton
      ?.addEventListener(
        "click",
        restartGame
      );


    nextPitch();
  }


  function getDifficultyProgress() {

    if (
      TOTAL_PITCHES <= 1
    ) {
      return 1;
    }


    return clamp(
      state.pitchNum /
      (TOTAL_PITCHES - 1),
      0,
      1
    );
  }


  function weightedPitchType() {

    const totalWeight =
      PITCH_TYPES.reduce(
        (sum, type) =>
          sum + type.weight,
        0
      );


    let roll =
      Math.random() *
      totalWeight;


    for (
      const type of PITCH_TYPES
    ) {

      roll -=
        type.weight;


      if (roll <= 0) {
        return type;
      }
    }


    return PITCH_TYPES[0];
  }


  function createPitch() {

    const difficulty =
      getDifficultyProgress();


    const type =
      weightedPitchType();


    /*
     * Escalado bastante más rápido:
     *
     * Lanzamiento 1:
     * ~900 ms de cruce base.
     *
     * Lanzamiento 10:
     * ~410 ms de cruce base.
     */
    const baseTravelMs =
      900 -
      difficulty *
      490;


    const randomSpeedFactor =
      randomBetween(
        0.90,
        1.08
      );


    const travelMs =
      clamp(
        baseTravelMs *
        type.travelMultiplier *
        randomSpeedFactor,
        340,
        1100
      );


    /*
     * A medida que avanza la partida,
     * el windup medio se acorta ligeramente,
     * pero sigue teniendo mucha variación.
     */
    const windupReduction =
      1 -
      difficulty *
      0.18;


    let windupMs =
      randomBetween(
        type.windupMin,
        type.windupMax
      ) *
      windupReduction;


    /*
     * Evento aleatorio adicional:
     * ~12% de los lanzamientos tienen
     * una pausa extra impredecible.
     */
    const extraHold =
      Math.random() < 0.12
        ? randomBetween(
            350,
            900
          )
        : 0;


    windupMs +=
      extraHold;


    return {
      ...type,

      windupMs:
        Math.round(
          windupMs
        ),

      travelMs:
        Math.round(
          travelMs
        ),

      direction:
        Math.random() >
        0.5
          ? 1
          : -1,

      extraHold:
        extraHold > 0
    };
  }


  function updateSpeedMeter(
    pitch,
    released = false
  ) {

    const fill =
      byId(
        "derby-speed-fill"
      );


    if (!fill) {
      return;
    }


    if (!released) {

      fill.style.width =
        "0%";

      return;
    }


    /*
     * Más rápido = barra más llena.
     */
    const normalized =
      1 -
      clamp(
        (
          pitch.travelMs -
          340
        ) /
        (
          1100 -
          340
        ),
        0,
        1
      );


    const pct =
      22 +
      normalized *
      78;


    fill.style.width =
      `${Math.round(pct)}%`;
  }


  function nextPitch() {

    if (!isMounted()) {
      return;
    }


    if (
      state.pitchNum >=
      TOTAL_PITCHES
    ) {

      gameOver();

      return;
    }


    swingDone =
      false;


    canSwing =
      false;


    currentPitch =
      createPitch();


    const swingButton =
      byId(
        "derby-btn-swing"
      );


    if (swingButton) {

      swingButton.disabled =
        true;
    }


    setBallVisible(
      false
    );


    clearTrail();


    updateSpeedMeter(
      currentPitch,
      false
    );


    const waitingMessages = [
      "El pitcher se prepara...",
      "Mira al plato...",
      "Ajusta el agarre...",
      "Esperando el lanzamiento..."
    ];


    setPitchStatus(
      waitingMessages[
        Math.floor(
          Math.random() *
          waitingMessages.length
        )
      ],
      "waiting"
    );


    /*
     * En pausas largas damos una pista visual
     * que NO revela cuándo saldrá la pelota.
     */
    if (
      currentPitch.windupMs >
      1350
    ) {

      later(
        () => {

          if (
            !swingDone &&
            currentPitch
          ) {

            setPitchStatus(
              currentPitch.extraHold
                ? "El pitcher sostiene la pelota..."
                : "Todavía no suelta...",
              "waiting"
            );
          }

        },
        Math.min(
          850,
          currentPitch.windupMs *
          0.55
        )
      );
    }


    later(
      releasePitch,
      currentPitch.windupMs
    );
  }


  function releasePitch() {

    if (
      !isMounted() ||
      swingDone ||
      !currentPitch
    ) {
      return;
    }


    ballDir =
      currentPitch.direction;


    ballX =
      ballDir === 1
        ? 0
        : 1;


    releaseStartedAt =
      performance.now();


    canSwing =
      true;


    setBallVisible(
      true
    );


    renderBall();


    updateSpeedMeter(
      currentPitch,
      true
    );


    const swingButton =
      byId(
        "derby-btn-swing"
      );


    if (swingButton) {

      swingButton.disabled =
        false;
    }


    setPitchStatus(
      `⚾ ¡LANZAMIENTO! · ${currentPitch.label}`,
      "release"
    );


    animId =
      requestAnimationFrame(
        animatePitch
      );
  }


  function getMotionProgress(
    pitch,
    t
  ) {

    switch (
      pitch.motion
    ) {

      case "changeup":
        /*
         * Parece salir rápido,
         * se frena ligeramente al centro.
         */
        if (t < 0.48) {

          return (
            t *
            0.92
          );
        }

        return (
          0.4416 +
          (
            (t - 0.48) /
            0.52
          ) *
          0.5584
        );


      case "burst":
        /*
         * Después de la pausa,
         * acelera con fuerza.
         */
        return Math.pow(
          t,
          0.78
        );


      case "cutter":
        /*
         * Microvariación temporal
         * para que el paso por el centro
         * no sea idéntico a una recta.
         */
        return clamp(
          t +
          Math.sin(
            t *
            Math.PI
          ) *
          0.035,
          0,
          1
        );


      default:
        return t;
    }
  }


  function animatePitch(timestamp) {

    if (
      !isMounted() ||
      swingDone ||
      !currentPitch
    ) {
      return;
    }


    const elapsed =
      timestamp -
      releaseStartedAt;


    const rawProgress =
      clamp(
        elapsed /
        currentPitch.travelMs,
        0,
        1
      );


    const progress =
      getMotionProgress(
        currentPitch,
        rawProgress
      );


    ballX =
      currentPitch.direction === 1
        ? progress
        : 1 -
          progress;


    renderBall();


    if (
      rawProgress >= 1
    ) {

      registerMissedPitch();

      return;
    }


    animId =
      requestAnimationFrame(
        animatePitch
      );
  }


  function registerMissedPitch() {

    if (swingDone) {
      return;
    }


    swingDone =
      true;


    canSwing =
      false;


    if (animId) {

      cancelAnimationFrame(
        animId
      );

      animId =
        null;
    }


    const swingButton =
      byId(
        "derby-btn-swing"
      );


    if (swingButton) {

      swingButton.disabled =
        true;
    }


    state.pitchNum++;


    state.pitchResults.push(
      "strike"
    );


    setBallVisible(
      false
    );


    clearTrail();


    setPitchStatus(
      "STRIKE · Se te fue el lanzamiento",
      "missed"
    );


    showResultFlash({
      emoji: "❌",
      type: "STRIKE!",
      color: "#ff4444"
    });


    updateHUD();

    renderPitchDots();


    later(
      () => {

        hideResultFlash();

        nextPitch();

      },
      950
    );
  }


  function renderBall() {

    const track =
      byId("derby-track");

    const ball =
      byId("derby-ball");

    const trail =
      byId("derby-trail");


    if (
      !track ||
      !ball ||
      !trail
    ) {
      return;
    }


    const trackWidth =
      Math.max(
        1,
        track.clientWidth -
        TRACK_PADDING *
        2
      );


    const px =
      TRACK_PADDING +
      ballX *
      trackWidth;


    ball.style.left =
      `${px - 11}px`;


    if (ballDir === 1) {

      trail.style.left =
        `${Math.max(
          0,
          px - 40
        )}px`;


      trail.style.width =
        `${Math.min(
          40,
          px
        )}px`;

    } else {

      trail.style.left =
        `${px}px`;


      trail.style.width =
        `${Math.min(
          40,
          (
            trackWidth +
            TRACK_PADDING
          ) - px
        )}px`;
    }
  }


  function swing(event) {

    event.preventDefault();


    if (
      !canSwing ||
      swingDone
    ) {
      return;
    }


    swingDone =
      true;


    canSwing =
      false;


    if (animId) {

      cancelAnimationFrame(
        animId
      );

      animId =
        null;
    }


    const swingButton =
      byId(
        "derby-btn-swing"
      );


    if (swingButton) {

      swingButton.disabled =
        true;
    }


    const distanceFromCenter =
      Math.abs(
        ballX -
        0.5
      ) *
      2;


    const accuracy =
      1 -
      distanceFromCenter;


    evaluateSwing(
      accuracy
    );
  }


  function evaluateSwing(accuracy) {

    state.pitchNum++;


    let result;


    if (accuracy >= 0.85) {

      result = {
        type: "HOME RUN!",
        pts: 100,
        color: "#d4af37",
        emoji: "🔥",
        outcome: "hit",
        isHR: true,
        isPerfect: true
      };

    } else if (accuracy >= 0.70) {

      result = {
        type: "TRIPLE!",
        pts: 60,
        color: "#4da6ff",
        emoji: "⚡",
        outcome: "hit",
        isHR: false
      };

    } else if (accuracy >= 0.55) {

      result = {
        type: "DOBLE!",
        pts: 40,
        color: "#66ff66",
        emoji: "🏃",
        outcome: "hit",
        isHR: false
      };

    } else if (accuracy >= 0.38) {

      result = {
        type: "SENCILLO!",
        pts: 20,
        color: "#ffffff",
        emoji: "👆",
        outcome: "hit",
        isHR: false
      };

    } else if (accuracy >= 0.20) {

      result = {
        type: "FOUL",
        pts: 5,
        color: "#ffaa00",
        emoji: "🌀",
        outcome: "hit",
        isHR: false
      };

    } else {

      result = {
        type: "STRIKE!",
        pts: 0,
        color: "#ff4444",
        emoji: "❌",
        outcome: "strike",
        isHR: false
      };
    }


    state.score +=
      result.pts;


    state.totalScore +=
      result.pts;


    if (
      result.outcome ===
      "hit"
    ) {

      state.sessionHits++;

      state.totalHits++;
    }


    if (result.isHR) {

      state.sessionHRs++;

      state.totalHRs++;
    }


    if (result.isPerfect) {

      state.sessionPerfects++;
    }


    state.pitchResults.push(
      result.outcome
    );


    setBallVisible(
      false
    );


    clearTrail();


    animateBatter();


    showResultFlash(
      result
    );


    setPitchStatus(
      result.type,
      result.outcome ===
      "strike"
        ? "missed"
        : "release"
    );


    if (
      result.outcome ===
      "hit"
    ) {

      launchFlyBall(
        result.isHR
      );
    }


    if (result.isHR) {

      spawnConfetti();
    }


    updateHUD();

    renderPitchDots();

    checkTrophies();


    later(
      () => {

        hideResultFlash();

        nextPitch();

      },
      result.isHR
        ? 1500
        : 950
    );
  }


  function animateBatter() {

    const arm =
      byId("derby-arm");

    const bat =
      byId("derby-bat-line");


    if (!arm || !bat) {
      return;
    }


    arm.style.transition =
      "all 0.15s ease-out";


    bat.style.transition =
      "all 0.15s ease-out";


    arm.setAttribute(
      "x2",
      "50"
    );


    arm.setAttribute(
      "y2",
      "30"
    );


    bat.setAttribute(
      "x1",
      "50"
    );


    bat.setAttribute(
      "y1",
      "30"
    );


    bat.setAttribute(
      "x2",
      "65"
    );


    bat.setAttribute(
      "y2",
      "20"
    );


    later(
      () => {

        arm.style.transition =
          "all 0.3s ease-in";


        bat.style.transition =
          "all 0.3s ease-in";


        arm.setAttribute(
          "x2",
          "10"
        );


        arm.setAttribute(
          "y2",
          "38"
        );


        bat.setAttribute(
          "x1",
          "10"
        );


        bat.setAttribute(
          "y1",
          "38"
        );


        bat.setAttribute(
          "x2",
          "-2"
        );


        bat.setAttribute(
          "y2",
          "30"
        );

      },
      200
    );
  }


  function launchFlyBall(isHR) {

    const field =
      byId("derby-field");

    const flyBall =
      byId("derby-fly-ball");

    const track =
      byId("derby-track");


    if (
      !field ||
      !flyBall ||
      !track
    ) {
      return;
    }


    const rect =
      track.getBoundingClientRect();


    const fieldRect =
      field.getBoundingClientRect();


    const startX =
      rect.left -
      fieldRect.left +
      rect.width *
      ballX;


    const startY =
      rect.top -
      fieldRect.top;


    flyBall.style.cssText =
      `display:block;` +
      `left:${startX}px;` +
      `top:${startY}px;` +
      `opacity:1;` +
      `transform:scale(1);` +
      `transition:none;`;


    flyBall.offsetHeight;


    const distance =
      isHR
        ? 280
        : 160 +
          Math.random() *
          80;


    const angle =
      -(
        50 +
        Math.random() *
        30
      );


    const radians =
      angle *
      Math.PI /
      180;


    const dx =
      Math.cos(radians) *
      distance *
      (
        Math.random() >
        0.5
          ? 1
          : -1
      );


    const dy =
      Math.sin(radians) *
      distance;


    const duration =
      isHR
        ? 1.2
        : 0.8;


    flyBall.style.transition =
      `all ${duration}s cubic-bezier(0.25,0.46,0.45,0.94)`;


    flyBall.style.transform =
      `translate(${dx}px,${dy}px) scale(${isHR ? 0.3 : 0.5})`;


    flyBall.style.opacity =
      "0";


    later(
      () => {

        flyBall.style.display =
          "none";

      },
      isHR
        ? 1200
        : 800
    );
  }


  function spawnConfetti() {

    const field =
      byId("derby-field");


    if (!field) {
      return;
    }


    const colors = [
      "#d4af37",
      "#ffffff",
      "#00ff66",
      "#4da6ff",
      "#ff4444",
      "#ff69b4"
    ];


    for (
      let i = 0;
      i < 32;
      i++
    ) {

      const piece =
        document.createElement(
          "div"
        );


      piece.className =
        "confetti-piece";


      piece.style.cssText =
        `background:${colors[i % colors.length]};` +
        `left:50%;` +
        `top:40%;` +
        `position:absolute;` +
        `transition:all ${0.6 + Math.random() * 0.6}s ease-out;` +
        `transform:translate(-50%,-50%);`;


      field.appendChild(
        piece
      );


      const angle =
        Math.random() *
        Math.PI *
        2;


      const distance =
        60 +
        Math.random() *
        180;


      requestAnimationFrame(
        () => {

          if (!piece.isConnected) {
            return;
          }


          piece.style.transform =
            `translate(` +
            `calc(-50% + ${Math.cos(angle) * distance}px),` +
            `calc(-50% + ${Math.sin(angle) * distance}px)` +
            `) rotate(${Math.random() * 360}deg)`;


          piece.style.opacity =
            "0";
        }
      );


      later(
        () => {

          piece.remove();

        },
        1200
      );
    }
  }


  function showResultFlash(result) {

    const element =
      byId(
        "derby-result-flash"
      );


    if (!element) {
      return;
    }


    element.textContent =
      `${result.emoji} ${result.type}`;


    element.style.color =
      result.color;


    element.classList.add(
      "show"
    );
  }


  function hideResultFlash() {

    byId(
      "derby-result-flash"
    )?.classList.remove(
      "show"
    );
  }


  function updateHUD() {

    const score =
      byId("derby-score");


    const hrs =
      byId("derby-hrs");


    const best =
      byId("derby-best");


    if (score) {

      score.textContent =
        state.score;
    }


    if (hrs) {

      hrs.textContent =
        state.sessionHRs;
    }


    if (best) {

      best.textContent =
        Math.max(
          state.bestScore,
          state.score
        );
    }


    updateMuseumWallet();
  }


  function renderPitchDots() {

    const container =
      byId(
        "derby-pitch-dots"
      );


    if (!container) {
      return;
    }


    container.innerHTML =
      "";


    for (
      let i = 0;
      i < TOTAL_PITCHES;
      i++
    ) {

      const dot =
        document.createElement(
          "div"
        );


      dot.className =
        "pitch-dot" +
        (
          i <
          state.pitchResults.length
            ? ` ${state.pitchResults[i]}`
            : ""
        );


      container.appendChild(
        dot
      );
    }
  }


  function checkTrophies() {

    let changed =
      false;


    TROPHIES.forEach(
      trophy => {

        if (
          !state.unlocked.includes(
            trophy.id
          ) &&
          trophy.check(state)
        ) {

          state.unlocked.push(
            trophy.id
          );


          changed =
            true;
        }
      }
    );


    if (changed) {

      save();

      renderTrophies();
    }
  }


  function renderTrophies() {

    const bar =
      byId(
        "derby-trophy-bar"
      );


    if (!bar) {
      return;
    }


    bar.innerHTML =
      "";


    TROPHIES.forEach(
      trophy => {

        const unlocked =
          state.unlocked.includes(
            trophy.id
          );


        const chip =
          document.createElement(
            "div"
          );


        chip.className =
          "trophy-chip" +
          (
            unlocked
              ? " unlocked"
              : ""
          );


        chip.innerHTML =
          `<div class="t-icon">` +
          `${unlocked ? trophy.icon : "🔒"}` +
          `</div>` +
          `<div>${trophy.name}</div>`;


        bar.appendChild(
          chip
        );
      }
    );
  }


  function calculateMuseumReward() {

    return Math.floor(
      state.score /
      10
    );
  }


  function gameOver() {

    if (!isMounted()) {
      return;
    }


    canSwing =
      false;


    swingDone =
      true;


    setBallVisible(
      false
    );


    clearTrail();


    setPitchStatus(
      "Partida terminada",
      "waiting"
    );


    if (
      state.score >
      state.bestScore
    ) {

      state.bestScore =
        state.score;
    }


    if (
      !state.rewardCommitted
    ) {

      state.museumEarnedThisGame =
        calculateMuseumReward();


      addMuseumPoints(
        state.museumEarnedThisGame
      );


      state.rewardCommitted =
        true;
    }


    save();


    const goScore =
      byId(
        "derby-go-score"
      );


    const goHRs =
      byId(
        "derby-go-hrs"
      );


    const goHits =
      byId(
        "derby-go-hits"
      );


    const goEarned =
      byId(
        "derby-go-museum-earned"
      );


    const goTotal =
      byId(
        "derby-go-museum-total"
      );


    if (goScore) {
      goScore.textContent =
        state.score;
    }


    if (goHRs) {
      goHRs.textContent =
        state.sessionHRs;
    }


    if (goHits) {
      goHits.textContent =
        state.sessionHits;
    }


    if (goEarned) {

      goEarned.textContent =
        state.museumEarnedThisGame;
    }


    if (goTotal) {

      goTotal.textContent =
        getMuseumPoints();
    }


    byId(
      "derby-game-over"
    )?.classList.add(
      "show"
    );
  }


  function restartGame() {

    if (animId) {

      cancelAnimationFrame(
        animId
      );


      animId =
        null;
    }


    timers.forEach(
      timer =>
        clearTimeout(timer)
    );


    timers.clear();


    state.score = 0;

    state.sessionHRs = 0;

    state.sessionHits = 0;

    state.sessionPerfects = 0;

    state.pitchNum = 0;

    state.pitchResults = [];

    state.rewardCommitted =
      false;

    state.museumEarnedThisGame =
      0;


    currentPitch =
      null;


    byId(
      "derby-game-over"
    )?.classList.remove(
      "show"
    );


    const swingButton =
      byId(
        "derby-btn-swing"
      );


    if (swingButton) {

      swingButton.disabled =
        true;
    }


    setBallVisible(
      false
    );


    clearTrail();


    updateHUD();

    renderPitchDots();

    nextPitch();
  }


  function destroy() {

    destroyed =
      true;


    canSwing =
      false;


    swingDone =
      true;


    if (animId) {

      cancelAnimationFrame(
        animId
      );


      animId =
        null;
    }


    timers.forEach(
      timer =>
        clearTimeout(timer)
    );


    timers.clear();
  }


  window.HomeRunDerby = {
    init,
    destroy,
    getMuseumPoints,
    addMuseumPoints
  };


  init();

})();