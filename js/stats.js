(() => {

    const API_BASE =
        "https://statsapi.mlb.com/api/v1";

    const LEAGUES = {
        AL: "103",
        NL: "104"
    };

    const DIVISION_NAMES = {
        200: "Liga Americana — Oeste",
        201: "Liga Americana — Este",
        202: "Liga Americana — Central",
        203: "Liga Nacional — Oeste",
        204: "Liga Nacional — Este",
        205: "Liga Nacional — Central"
    };

    const LEADER_LABELS = {
        homeRuns: "Home Runs",
        battingAverage: "Promedio de bateo",
        runsBattedIn: "Carreras impulsadas",
        era: "ERA",
        strikeouts: "Ponches",
        saves: "Salvamentos"
    };

    let selectedSeason =
        new Date().getFullYear();

    let selectedLeague =
        "all";

    let activePanel =
        "standings";

    const cache =
        new Map();


    function $(id) {
        return document.getElementById(id);
    }


    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function teamLogo(teamId) {
        return `https://www.mlbstatic.com/team-logos/${teamId}.svg`;
    }


    function personHeadshot(personId) {
        return `https://img.mlbstatic.com/mlb-photos/image/upload/w_120,q_auto:good/v1/people/${personId}/headshot/67/current`;
    }


    function getFavoriteTeamId() {
        const value =
            localStorage.getItem("favoriteTeam");

        const id =
            Number(value);

        return Number.isFinite(id)
            ? id
            : null;
    }


    async function fetchJson(url) {

        if (cache.has(url)) {
            return cache.get(url);
        }

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                `MLB API respondió ${response.status}`
            );
        }

        const data =
            await response.json();

        cache.set(url, data);

        return data;
    }


    function getLeagueParam() {

        if (selectedLeague === "all") {
            return `${LEAGUES.AL},${LEAGUES.NL}`;
        }

        return selectedLeague;
    }


    function buildSeasonSelector() {

        const select =
            $("stats-season");

        if (!select) {
            return;
        }

        const currentYear =
            new Date().getFullYear();

        select.innerHTML = "";

        for (
            let year = currentYear;
            year >= currentYear - 4;
            year--
        ) {

            const option =
                document.createElement("option");

            option.value =
                String(year);

            option.textContent =
                `Temporada ${year}`;

            if (year === selectedSeason) {
                option.selected = true;
            }

            select.appendChild(option);
        }
    }


    function setSeasonLabels() {

        [
            "standings-season-label",
            "hitting-season-label",
            "pitching-season-label"
        ].forEach(id => {

            const element =
                $(id);

            if (element) {
                element.textContent =
                    selectedSeason;
            }
        });
    }


    function showLoading(
        containerId,
        message
    ) {

        const container =
            $(containerId);

        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="mlb-stats-loading">
                <div class="mlb-stats-spinner"></div>
                ${escapeHtml(message)}
            </div>
        `;
    }


    function showError(
        containerId,
        message,
        panel
    ) {

        const container =
            $(containerId);

        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="mlb-stats-error">
                <div>⚠️ ${escapeHtml(message)}</div>

                <button
                    type="button"
                    class="mlb-stats-retry"
                    data-retry-panel="${escapeHtml(panel)}">
                    Reintentar
                </button>
            </div>
        `;

        container
            .querySelector("[data-retry-panel]")
            ?.addEventListener(
                "click",
                () => loadPanel(panel)
            );
    }


    function divisionName(record) {

        const divisionId =
            record?.division?.id;

        if (
            divisionId &&
            DIVISION_NAMES[divisionId]
        ) {
            return DIVISION_NAMES[divisionId];
        }

        return (
            record?.division?.name ||
            "División"
        );
    }


    function renderFavoriteTeam(records) {

        const card =
            $("favorite-team-card");

        if (!card) {
            return;
        }

        const favoriteTeamId =
            getFavoriteTeamId();

        if (!favoriteTeamId) {
            card.classList.add("hidden");
            return;
        }

        let favoriteRecord = null;

        for (const division of records) {

            const found =
                division.teamRecords?.find(
                    record =>
                        record.team?.id ===
                        favoriteTeamId
                );

            if (found) {
                favoriteRecord = found;
                break;
            }
        }

        if (!favoriteRecord) {
            card.classList.add("hidden");
            return;
        }

        card.classList.remove("hidden");

        const logo =
            $("favorite-team-logo");

        if (logo) {
            logo.src =
                teamLogo(favoriteTeamId);

            logo.alt =
                favoriteRecord.team?.name || "";
        }

        const name =
            $("favorite-team-name");

        if (name) {
            name.textContent =
                favoriteRecord.team?.name ||
                "Equipo favorito";
        }

        const record =
            $("favorite-team-record");

        if (record) {
            record.textContent =
                `${favoriteRecord.wins}-${favoriteRecord.losses}`;
        }

        const rank =
            $("favorite-team-rank");

        if (rank) {
            rank.textContent =
                favoriteRecord.divisionRank
                    ? `#${favoriteRecord.divisionRank}`
                    : "—";
        }

        const streak =
            $("favorite-team-streak");

        if (streak) {
            streak.textContent =
                favoriteRecord.streak?.streakCode ||
                "—";
        }
    }


    function renderStandings(data) {

        const container =
            $("standings-content");

        if (!container) {
            return;
        }

        const records =
            Array.isArray(data?.records)
                ? data.records
                : [];

        if (records.length === 0) {

            container.innerHTML = `
                <div class="mlb-stats-empty">
                    No hay posiciones disponibles
                    para esta temporada.
                </div>
            `;

            renderFavoriteTeam([]);

            return;
        }

        const favoriteTeamId =
            getFavoriteTeamId();

        const sortedRecords =
            [...records].sort(
                (a, b) =>
                    Number(a.division?.id || 0) -
                    Number(b.division?.id || 0)
            );

        container.innerHTML =
            sortedRecords.map(record => {

                const teams =
                    record.teamRecords || [];

                const rows =
                    teams.map(teamRecord => {

                        const team =
                            teamRecord.team || {};

                        const lastTen =
                            teamRecord.records?.splitRecords
                                ?.find(
                                    item =>
                                        item.type === "lastTen"
                                );

                        const lastTenText =
                            lastTen
                                ? `${lastTen.wins}-${lastTen.losses}`
                                : (
                                    teamRecord.lastTen
                                        ? `${teamRecord.lastTen.wins}-${teamRecord.lastTen.losses}`
                                        : "—"
                                );

                        const favoriteClass =
                            team.id === favoriteTeamId
                                ? "favorite-row"
                                : "";

                        return `
                            <tr class="${favoriteClass}">
                                <td class="standings-rank">
                                    ${escapeHtml(teamRecord.divisionRank || "—")}
                                </td>

                                <td class="standings-team">
                                    <img
                                        src="${teamLogo(team.id)}"
                                        alt=""
                                        loading="lazy"
                                        onerror="this.style.display='none'"
                                    >

                                    <span class="standings-team-name">
                                        ${escapeHtml(team.name || "Equipo")}
                                    </span>
                                </td>

                                <td>${escapeHtml(teamRecord.wins ?? "—")}</td>
                                <td>${escapeHtml(teamRecord.losses ?? "—")}</td>
                                <td>${escapeHtml(teamRecord.winningPercentage ?? "—")}</td>
                                <td>${escapeHtml(teamRecord.gamesBack ?? "—")}</td>
                                <td>${escapeHtml(lastTenText)}</td>
                                <td>${escapeHtml(teamRecord.streak?.streakCode || "—")}</td>
                            </tr>
                        `;
                    }).join("");

                return `
                    <div class="division-card">
                        <div class="division-title">
                            ${escapeHtml(divisionName(record))}
                        </div>

                        <div class="standings-table-wrap">
                            <table class="standings-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th style="text-align:left;">Equipo</th>
                                        <th>G</th>
                                        <th>P</th>
                                        <th>PCT</th>
                                        <th>Dif.</th>
                                        <th>Últ. 10</th>
                                        <th>Racha</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }).join("");

        renderFavoriteTeam(records);
    }


    function getLeaderCategoryObject(
        data,
        category
    ) {

        const groups =
            Array.isArray(data?.leagueLeaders)
                ? data.leagueLeaders
                : [];

        return groups.find(
            group =>
                group.leaderCategory === category ||
                group.leaderCategory?.toLowerCase() ===
                    category.toLowerCase()
        );
    }


    function renderLeaderCategory(
        data,
        category
    ) {

        const group =
            getLeaderCategoryObject(
                data,
                category
            );

        const leaders =
            Array.isArray(group?.leaders)
                ? group.leaders
                : [];

        if (leaders.length === 0) {

            return `
                <div class="leader-category">
                    <div class="leader-category-title">
                        ${escapeHtml(LEADER_LABELS[category] || category)}
                    </div>

                    <div class="mlb-stats-empty">
                        Sin datos disponibles.
                    </div>
                </div>
            `;
        }

        return `
            <div class="leader-category">

                <div class="leader-category-title">
                    ${escapeHtml(LEADER_LABELS[category] || category)}
                </div>

                ${leaders.map(leader => {

                    const person =
                        leader.person || {};

                    const team =
                        leader.team || {};

                    return `
                        <div class="leader-row">

                            <div class="leader-rank">
                                ${escapeHtml(leader.rank || "—")}
                            </div>

                            <img
                                class="leader-headshot"
                                src="${personHeadshot(person.id)}"
                                alt=""
                                loading="lazy"
                                onerror="this.style.visibility='hidden'"
                            >

                            <div class="leader-name">
                                ${escapeHtml(person.fullName || "Jugador")}

                                <span class="leader-team">
                                    ${escapeHtml(team.name || "")}
                                </span>
                            </div>

                            <div class="leader-value">
                                ${escapeHtml(leader.value ?? "—")}
                            </div>

                        </div>
                    `;
                }).join("")}

            </div>
        `;
    }


    function renderLeaders(
        containerId,
        data,
        categories
    ) {

        const container =
            $(containerId);

        if (!container) {
            return;
        }

        container.innerHTML =
            categories
                .map(
                    category =>
                        renderLeaderCategory(
                            data,
                            category
                        )
                )
                .join("");
    }


    async function loadStandings() {

        showLoading(
            "standings-content",
            "Cargando posiciones..."
        );

        const leagueId =
            getLeagueParam();

        const url =
            `${API_BASE}/standings` +
            `?leagueId=${encodeURIComponent(leagueId)}` +
            `&season=${selectedSeason}` +
            `&standingsTypes=regularSeason` +
            `&hydrate=team,league,division`;

        try {

            const data =
                await fetchJson(url);

            renderStandings(data);

        } catch (error) {

            console.error(
                "Error en posiciones MLB:",
                error
            );

            showError(
                "standings-content",
                "No se pudieron cargar las posiciones.",
                "standings"
            );
        }
    }


    async function loadHittingLeaders() {

        showLoading(
            "hitting-content",
            "Cargando líderes ofensivos..."
        );

        const league =
            selectedLeague === "all"
                ? ""
                : `&leagueId=${selectedLeague}`;

        const categories =
            [
                "homeRuns",
                "battingAverage",
                "runsBattedIn"
            ];

        const url =
            `${API_BASE}/stats/leaders` +
            `?leaderCategories=${categories.join(",")}` +
            `&season=${selectedSeason}` +
            `&sportId=1` +
            `&statGroup=hitting` +
            `&leaderGameTypes=R` +
            `&limit=5` +
            league;

        try {

            const data =
                await fetchJson(url);

            renderLeaders(
                "hitting-content",
                data,
                categories
            );

        } catch (error) {

            console.error(
                "Error en líderes de bateo:",
                error
            );

            showError(
                "hitting-content",
                "No se pudieron cargar los líderes de bateo.",
                "hitting"
            );
        }
    }


    async function loadPitchingLeaders() {

        showLoading(
            "pitching-content",
            "Cargando líderes de pitcheo..."
        );

        const league =
            selectedLeague === "all"
                ? ""
                : `&leagueId=${selectedLeague}`;

        const categories =
            [
                "era",
                "strikeouts",
                "saves"
            ];

        const url =
            `${API_BASE}/stats/leaders` +
            `?leaderCategories=${categories.join(",")}` +
            `&season=${selectedSeason}` +
            `&sportId=1` +
            `&statGroup=pitching` +
            `&leaderGameTypes=R` +
            `&limit=5` +
            league;

        try {

            const data =
                await fetchJson(url);

            renderLeaders(
                "pitching-content",
                data,
                categories
            );

        } catch (error) {

            console.error(
                "Error en líderes de pitcheo:",
                error
            );

            showError(
                "pitching-content",
                "No se pudieron cargar los líderes de pitcheo.",
                "pitching"
            );
        }
    }


    async function loadPanel(panel) {

        setSeasonLabels();

        if (panel === "standings") {
            await loadStandings();
            return;
        }

        if (panel === "hitting") {
            await loadHittingLeaders();
            return;
        }

        if (panel === "pitching") {
            await loadPitchingLeaders();
        }
    }


    function setActivePanel(panel) {

        activePanel =
            panel;

        document
            .querySelectorAll(".mlb-stats-tab")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.statsPanel === panel
                );
            });

        document
            .querySelectorAll(".mlb-stats-panel")
            .forEach(element => {

                element.hidden =
                    element.id !==
                    `stats-panel-${panel}`;
            });

        loadPanel(panel);
    }


    function attachEvents() {

        $("stats-season")
            ?.addEventListener(
                "change",
                event => {

                    selectedSeason =
                        Number(event.target.value);

                    cache.clear();

                    loadPanel(activePanel);
                }
            );


        $("stats-league")
            ?.addEventListener(
                "change",
                event => {

                    selectedLeague =
                        event.target.value;

                    cache.clear();

                    loadPanel(activePanel);
                }
            );


        document
            .querySelectorAll(".mlb-stats-tab")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        setActivePanel(
                            button.dataset.statsPanel
                        );
                    }
                );
            });
    }


    function init() {

        /*
         * El archivo se carga desde una vista inyectada.
         * Si ya no existe la vista, no hacemos nada.
         */
        if (!document.querySelector(".mlb-stats-view")) {
            return;
        }

        buildSeasonSelector();

        attachEvents();

        setSeasonLabels();

        loadStandings();
    }


    window.MLBStatsModule = {
        init,
        reload() {
            cache.clear();
            return loadPanel(activePanel);
        }
    };


    /*
     * stats.js se carga dinámicamente desde estadisticas.html,
     * por lo que DOMContentLoaded probablemente ya ocurrió.
     */
    init();

})();