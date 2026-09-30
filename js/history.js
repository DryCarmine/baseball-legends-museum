(() => {

    const API_URL =
        "https://statsapi.mlb.com/api/v1/teams?sportId=1&hydrate=venue,league,division";

    let apiTeams =
        [];

    let leagueFilter =
        "all";

    let searchText =
        "";


    function $(id) {
        return document.getElementById(id);
    }


    function normalize(value) {

        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
    }


    function escapeHtml(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function getFavoriteTeamId() {

        return (
            localStorage.getItem("favoriteTeam") ||
            ""
        );
    }


    function findApiTeam(localTeam) {

        const localName =
            normalize(localTeam.name);

        const localId =
            normalize(localTeam.id);


        const aliases = {
            oakland_athletics: [
                "athletics",
                "oakland_athletics"
            ]
        };


        return apiTeams.find(team => {

            const apiName =
                normalize(team.name);

            if (
                apiName === localName ||
                apiName === localId
            ) {
                return true;
            }


            const teamAliases =
                aliases[localTeam.id] ||
                [];


            return teamAliases.includes(
                apiName
            );
        });
    }


    function getLeagueLabel(team) {

        return team.league === "American"
            ? "Liga Americana"
            : "Liga Nacional";
    }


    function getDivisionLabel(team) {

        const map = {
            "AL East": "AL Este",
            "AL Central": "AL Central",
            "AL West": "AL Oeste",
            "NL East": "NL Este",
            "NL Central": "NL Central",
            "NL West": "NL Oeste"
        };

        return (
            map[team.division] ||
            team.division ||
            "—"
        );
    }


    function buildTeamHistoryText(
        localTeam,
        apiTeam
    ) {

        const year =
            apiTeam?.firstYearOfPlay ||
            "una etapa histórica anterior";

        const venue =
            apiTeam?.venue?.name ||
            "su estadio actual";

        const league =
            getLeagueLabel(localTeam);

        const division =
            getDivisionLabel(localTeam);


        return (
            `${localTeam.name} forma parte de la ${league} ` +
            `y actualmente compite en ${division}. ` +
            `La franquicia registra participación en las Grandes Ligas ` +
            `desde ${year}. En la actualidad juega como local en ${venue}. ` +
            `Esta ficha utiliza información vigente de MLB para presentar ` +
            `una referencia rápida de la identidad y continuidad histórica ` +
            `de la franquicia.`
        );
    }


    function renderTeams() {

        const grid =
            $("history-teams-grid");

        const count =
            $("history-teams-count");


        if (!grid) {
            return;
        }


        if (
            typeof MLB_TEAMS === "undefined" ||
            !Array.isArray(MLB_TEAMS)
        ) {

            grid.innerHTML = `
                <div class="history-error">
                    No se encontró la lista de equipos MLB.
                </div>
            `;

            return;
        }


        const favoriteId =
            getFavoriteTeamId();


        const query =
            normalize(searchText);


        const filtered =
            MLB_TEAMS.filter(team => {

                if (
                    leagueFilter !== "all" &&
                    team.league !== leagueFilter
                ) {
                    return false;
                }


                if (!query) {
                    return true;
                }


                const searchable =
                    normalize(
                        [
                            team.name,
                            team.shortName,
                            team.division
                        ].join(" ")
                    );


                return searchable.includes(query);
            });


        if (count) {

            count.textContent =
                `${filtered.length} equipo${filtered.length === 1 ? "" : "s"}`;
        }


        if (filtered.length === 0) {

            grid.innerHTML = `
                <div class="history-empty">
                    No se encontraron equipos con ese filtro.
                </div>
            `;

            return;
        }


        grid.innerHTML =
            filtered.map(team => {

                const apiTeam =
                    findApiTeam(team);


                const favorite =
                    favoriteId === team.id;


                const firstYear =
                    apiTeam?.firstYearOfPlay ||
                    "—";


                const venue =
                    apiTeam?.venue?.name ||
                    "—";


                return `
                    <button
                        type="button"
                        class="team-history-card ${favorite ? "favorite" : ""}"
                        data-team-id="${escapeHtml(team.id)}">

                        ${favorite
                            ? `<span class="team-favorite-badge">★ Favorito</span>`
                            : ""
                        }

                        <div class="team-card-top">

                            <img
                                class="team-card-logo"
                                src="${escapeHtml(team.logo)}"
                                alt="Logo de ${escapeHtml(team.name)}"
                                loading="lazy"
                            >

                            <div>
                                <h3 class="team-card-name">
                                    ${escapeHtml(team.name)}
                                </h3>

                                <div class="team-card-meta">
                                    ${escapeHtml(getLeagueLabel(team))}
                                    ·
                                    ${escapeHtml(getDivisionLabel(team))}
                                </div>
                            </div>

                        </div>

                        <div class="team-card-details">

                            <div class="team-card-detail">
                                <strong>${escapeHtml(firstYear)}</strong>
                                <span>Desde</span>
                            </div>

                            <div class="team-card-detail">
                                <strong>${escapeHtml(venue)}</strong>
                                <span>Estadio</span>
                            </div>

                        </div>

                    </button>
                `;
            }).join("");


        grid
            .querySelectorAll("[data-team-id]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        openTeamModal(
                            button.dataset.teamId
                        );
                    }
                );
            });
    }


    function openTeamModal(teamId) {

        if (
            typeof MLB_TEAMS === "undefined" ||
            !Array.isArray(MLB_TEAMS)
        ) {
            return;
        }


        const localTeam =
            MLB_TEAMS.find(
                team => team.id === teamId
            );


        if (!localTeam) {
            return;
        }


        const apiTeam =
            findApiTeam(localTeam);


        const modal =
            $("history-team-modal");


        if (!modal) {
            return;
        }


        const logo =
            $("history-modal-logo");

        if (logo) {
            logo.src = localTeam.logo;
            logo.alt = `Logo de ${localTeam.name}`;
        }


        const title =
            $("history-modal-title");

        if (title) {
            title.textContent =
                localTeam.name;
        }


        const subtitle =
            $("history-modal-subtitle");

        if (subtitle) {
            subtitle.textContent =
                `${getLeagueLabel(localTeam)} · ${getDivisionLabel(localTeam)}`;
        }


        const founded =
            $("history-modal-founded");

        if (founded) {
            founded.textContent =
                apiTeam?.firstYearOfPlay ||
                "—";
        }


        const venue =
            $("history-modal-venue");

        if (venue) {
            venue.textContent =
                apiTeam?.venue?.name ||
                "—";
        }


        const location =
            $("history-modal-location");

        if (location) {

            location.textContent =
                apiTeam?.locationName ||
                apiTeam?.clubName ||
                "—";
        }


        const division =
            $("history-modal-division");

        if (division) {
            division.textContent =
                getDivisionLabel(localTeam);
        }


        const history =
            $("history-modal-history");

        if (history) {
            history.textContent =
                buildTeamHistoryText(
                    localTeam,
                    apiTeam
                );
        }


        modal.hidden =
            false;


        modal.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function closeTeamModal() {

        const modal =
            $("history-team-modal");

        if (!modal) {
            return;
        }


        modal.hidden =
            true;


        modal.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    function setPanel(panel) {

        document
            .querySelectorAll(".history-tab")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.historyPanel === panel
                );
            });


        document
            .querySelectorAll(".history-panel")
            .forEach(element => {

                element.hidden =
                    element.id !==
                    `history-panel-${panel}`;
            });
    }


    async function loadTeamMetadata() {

        try {

            const response =
                await fetch(API_URL);


            if (!response.ok) {
                throw new Error(
                    `MLB API respondió ${response.status}`
                );
            }


            const data =
                await response.json();


            apiTeams =
                Array.isArray(data?.teams)
                    ? data.teams
                    : [];


            renderTeams();


        } catch (error) {

            console.error(
                "Error cargando historia de equipos:",
                error
            );


            /*
             * Aunque la API falle, seguimos mostrando los
             * 30 equipos usando teams.js.
             */
            apiTeams =
                [];


            renderTeams();
        }
    }


    function attachEvents() {

        document
            .querySelectorAll(".history-tab")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        setPanel(
                            button.dataset.historyPanel
                        );
                    }
                );
            });


        $("history-team-search")
            ?.addEventListener(
                "input",
                event => {

                    searchText =
                        event.target.value;

                    renderTeams();
                }
            );


        $("history-league-filter")
            ?.addEventListener(
                "change",
                event => {

                    leagueFilter =
                        event.target.value;

                    renderTeams();
                }
            );


        $("history-modal-close")
            ?.addEventListener(
                "click",
                closeTeamModal
            );


        $("history-team-modal")
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target.id ===
                        "history-team-modal"
                    ) {
                        closeTeamModal();
                    }
                }
            );
    }


    function init() {

        if (
            !document.querySelector(
                ".history-view"
            )
        ) {
            return;
        }


        attachEvents();


        renderTeams();


        loadTeamMetadata();
    }


    window.HistoryModule = {
        init,
        reload: loadTeamMetadata
    };


    init();

})();