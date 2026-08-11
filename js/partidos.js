const MLB_API_BASE = "https://statsapi.mlb.com/api/v1";

let fechaActual = new Date();
let filtroLiga = "all";

const LEAGUE_IDS = { AL: 103, NL: 104 };

const TEAM_LEAGUES = {
    110: "AL", 111: "AL", 139: "AL", 141: "AL", 147: "AL",
    145: "AL", 114: "AL", 116: "AL", 118: "AL", 142: "AL",
    117: "AL", 133: "AL", 108: "AL", 136: "AL", 140: "AL",
    112: "NL", 113: "NL", 134: "NL", 138: "NL", 143: "NL",
    144: "NL", 146: "NL", 121: "NL", 120: "NL", 158: "NL",
    109: "NL", 115: "NL", 119: "NL", 135: "NL", 137: "NL"
};

function formatearFecha(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatearHoraLocal(isoString) {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

function obtenerEstadoBadge(estado) {
    const code = estado?.abstractGameCode || "";
    const detalle = estado?.detailedState || "";

    if (code === "F") return { texto: "Final", clase: "badge-final" };
    if (code === "L") return { texto: "En vivo 🔴", clase: "badge-live" };
    if (detalle.includes("Postponed")) return { texto: "Pospuesto", clase: "badge-postponed" };
    return { texto: "Programado", clase: "badge-scheduled" };
}

function obtenerLogoEquipo(teamId) {
    return `https://www.mlbstatic.com/team-logos/${teamId}.svg`;
}

function renderizarPartido(juego) {
    const away = juego.teams.away;
    const home = juego.teams.home;
    const badge = obtenerEstadoBadge(juego.status);
    const hora = formatearHoraLocal(juego.gameDate);
    const estadio = juego.venue?.name || "";

    const marcadorAway = away.score !== undefined ? away.score : "-";
    const marcadorHome = home.score !== undefined ? home.score : "-";
    const esFinal = juego.status?.abstractGameCode === "F";
    const esLive = juego.status?.abstractGameCode === "L";

    const ganadorAway = esFinal && away.score > home.score;
    const ganadorHome = esFinal && home.score > away.score;

    return `
        <div class="partido-card">
            <div class="partido-badge ${badge.clase}">${badge.texto}</div>

            <div class="partido-equipos">
                <!-- Visitante -->
                <div class="equipo-col ${ganadorAway ? "ganador" : ""}">
                    <img
                        src="${obtenerLogoEquipo(away.team.id)}"
                        alt="${away.team.name}"
                        class="equipo-logo"
                        onerror="this.style.display='none'"
                    />
                    <span class="equipo-nombre">${away.team.name}</span>
                    ${away.leagueRecord ? `<span class="equipo-record">${away.leagueRecord.wins}-${away.leagueRecord.losses}</span>` : ""}
                </div>

                <!-- Marcador / Hora -->
                <div class="marcador-col">
                    ${(esFinal || esLive)
                        ? `<span class="marcador-num ${ganadorAway ? "marcador-ganador" : ""}">${marcadorAway}</span>
                           <span class="marcador-sep">-</span>
                           <span class="marcador-num ${ganadorHome ? "marcador-ganador" : ""}">${marcadorHome}</span>`
                        : `<span class="partido-hora">${hora}</span>`
                    }
                    ${esLive && juego.linescore
                        ? `<span class="inning-info">Inn. ${juego.linescore.currentInning || ""} ${juego.linescore.inningHalf || ""}</span>`
                        : ""
                    }
                </div>

                <!-- Local -->
                <div class="equipo-col ${ganadorHome ? "ganador" : ""}">
                    <img
                        src="${obtenerLogoEquipo(home.team.id)}"
                        alt="${home.team.name}"
                        class="equipo-logo"
                        onerror="this.style.display='none'"
                    />
                    <span class="equipo-nombre">${home.team.name}</span>
                    ${home.leagueRecord ? `<span class="equipo-record">${home.leagueRecord.wins}-${home.leagueRecord.losses}</span>` : ""}
                </div>
            </div>

            <div class="partido-estadio">🏟️ ${estadio}</div>
        </div>
    `;
}

async function cargarPartidos() {
    const lista = document.getElementById("partidos-lista");
    if (!lista) return;

    lista.innerHTML = `
        <div class="partidos-loading">
            <div class="loading-spinner"></div>
            <p>Cargando partidos...</p>
        </div>
    `;

    const fecha = formatearFecha(fechaActual);

    try {
        const url = `${MLB_API_BASE}/schedule?sportId=1&date=${fecha}&hydrate=team,linescore,venue`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        const fechaData = data.dates?.[0];
        let juegos = fechaData?.games || [];

        // Filtrar por liga si aplica
        if (filtroLiga !== "all") {
            juegos = juegos.filter(j => {
                const awayLeague = TEAM_LEAGUES[j.teams.away.team.id];
                const homeLeague = TEAM_LEAGUES[j.teams.home.team.id];
                return awayLeague === filtroLiga || homeLeague === filtroLiga;
            });
        }

        if (juegos.length === 0) {
            lista.innerHTML = `
                <div class="partidos-vacio">
                    <p>⚾</p>
                    <p>No hay partidos programados para esta fecha.</p>
                </div>
            `;
            return;
        }

        // Ordenar: en vivo primero, luego programados, luego finales
        const orden = { L: 0, P: 1, F: 2 };
        juegos.sort((a, b) => {
            const ca = orden[a.status?.abstractGameCode] ?? 1;
            const cb = orden[b.status?.abstractGameCode] ?? 1;
            return ca - cb;
        });

        lista.innerHTML = juegos.map(renderizarPartido).join("");

    } catch (err) {
        console.error("Error cargando partidos:", err);
        lista.innerHTML = `
            <div class="partidos-error">
                <p>⚠️ No se pudieron cargar los partidos.</p>
                <p style="font-size:12px; opacity:0.7;">${err.message}</p>
                <button onclick="cargarPartidos()" class="btn-reintentar">Reintentar</button>
            </div>
        `;
    }
}

function actualizarInputFecha() {
    const input = document.getElementById("partidos-fecha");
    if (input) input.value = formatearFecha(fechaActual);
}

function inicializarPartidos() {
    fechaActual = new Date();
    actualizarInputFecha();

    // Botón Hoy
    document.getElementById("btn-hoy")?.addEventListener("click", () => {
        fechaActual = new Date();
        actualizarInputFecha();
        cargarPartidos();
    });

    // Fecha anterior
    document.getElementById("btn-fecha-anterior")?.addEventListener("click", () => {
        fechaActual.setDate(fechaActual.getDate() - 1);
        actualizarInputFecha();
        cargarPartidos();
    });

    // Fecha siguiente
    document.getElementById("btn-fecha-siguiente")?.addEventListener("click", () => {
        fechaActual.setDate(fechaActual.getDate() + 1);
        actualizarInputFecha();
        cargarPartidos();
    });

    // Input de fecha manual
    document.getElementById("partidos-fecha")?.addEventListener("change", (e) => {
        const [y, m, d] = e.target.value.split("-").map(Number);
        fechaActual = new Date(y, m - 1, d);
        cargarPartidos();
    });

    // Filtros de liga
    document.querySelectorAll(".filtro-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filtroLiga = btn.dataset.liga;
            cargarPartidos();
        });
    });

    cargarPartidos();
}
