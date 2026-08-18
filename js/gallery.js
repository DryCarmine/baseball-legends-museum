(() => {
    "use strict";

    const galleryItems = [
        // Liga Americana
        {
            id: "athletics",
            name: "Athletics",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/athletics.webp",
            description: "Emblema de los Athletics, parte de la historia de la Liga Americana."
        },
        {
            id: "baltimore_orioles",
            name: "Baltimore Orioles",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/baltimore_orioles.webp",
            description: "Logo oficial de los Baltimore Orioles."
        },
        {
            id: "boston_red_sox",
            name: "Boston Red Sox",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/boston_red_sox.webp",
            description: "Logo oficial de los Boston Red Sox."
        },
        {
            id: "chicago_white_sox",
            name: "Chicago White Sox",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/chicago_white_sox.webp",
            description: "Logo oficial de los Chicago White Sox."
        },
        {
            id: "cleveland_guardians",
            name: "Cleveland Guardians",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/cleveland_guardians.webp",
            description: "Logo oficial de los Cleveland Guardians."
        },
        {
            id: "detroit_tigers",
            name: "Detroit Tigers",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/detroit_tigers.webp",
            description: "Logo oficial de los Detroit Tigers."
        },
        {
            id: "houston_astros",
            name: "Houston Astros",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/houston_astros.webp",
            description: "Logo oficial de los Houston Astros."
        },
        {
            id: "kansas_city_royals",
            name: "Kansas City Royals",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/kansas-city-royals.webp",
            description: "Logo oficial de los Kansas City Royals."
        },
        {
            id: "los_angeles_angels",
            name: "Los Angeles Angels",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/los_angeles_angels.webp",
            description: "Logo oficial de Los Angeles Angels."
        },
        {
            id: "minnesota_twins",
            name: "Minnesota Twins",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/minnesota_twins.webp",
            description: "Logo oficial de los Minnesota Twins."
        },
        {
            id: "new_york_yankees",
            name: "New York Yankees",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/new_york_yankees.webp",
            description: "Logo oficial de los New York Yankees."
        },
        {
            id: "seattle_mariners",
            name: "Seattle Mariners",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/seattle_mariners.webp",
            description: "Logo oficial de los Seattle Mariners."
        },
        {
            id: "tampa_bay_rays",
            name: "Tampa Bay Rays",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/tampa_bay_rays_logo.webp",
            description: "Logo oficial de los Tampa Bay Rays."
        },
        {
            id: "texas_rangers",
            name: "Texas Rangers",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/texas_rangers.webp",
            description: "Logo oficial de los Texas Rangers."
        },
        {
            id: "toronto_blue_jays",
            name: "Toronto Blue Jays",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/toronto_blue_jays.webp",
            description: "Logo oficial de los Toronto Blue Jays."
        },

        // Liga Nacional
        {
            id: "arizona_diamondbacks",
            name: "Arizona Diamondbacks",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/arizona_diamondbacks.webp",
            description: "Logo oficial de los Arizona Diamondbacks."
        },
        {
            id: "atlanta_braves",
            name: "Atlanta Braves",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/atlanta_braves.webp",
            description: "Logo oficial de los Atlanta Braves."
        },
        {
            id: "chicago_cubs",
            name: "Chicago Cubs",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/chicago_cubs.webp",
            description: "Logo oficial de los Chicago Cubs."
        },
        {
            id: "cincinnati_reds",
            name: "Cincinnati Reds",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/cincinnati_reds.webp",
            description: "Logo oficial de los Cincinnati Reds."
        },
        {
            id: "colorado_rockies",
            name: "Colorado Rockies",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/colorado_rockies.webp",
            description: "Logo oficial de los Colorado Rockies."
        },
        {
            id: "los_angeles_dodgers",
            name: "Los Angeles Dodgers",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/los_angeles_dodgers.webp",
            description: "Logo oficial de Los Angeles Dodgers."
        },
        {
            id: "miami_marlins",
            name: "Miami Marlins",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/miami_marlins.webp",
            description: "Logo oficial de los Miami Marlins."
        },
        {
            id: "milwaukee_brewers",
            name: "Milwaukee Brewers",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/milwaukee_brewers.webp",
            description: "Logo oficial de los Milwaukee Brewers."
        },
        {
            id: "new_york_mets",
            name: "New York Mets",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/new_york_mets.webp",
            description: "Logo oficial de los New York Mets."
        },
        {
            id: "philadelphia_phillies",
            name: "Philadelphia Phillies",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/philadelphia_phillies.webp",
            description: "Logo oficial de los Philadelphia Phillies."
        },
        {
            id: "pittsburgh_pirates",
            name: "Pittsburgh Pirates",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/pittsburgh_pirates.webp",
            description: "Logo oficial de los Pittsburgh Pirates."
        },
        {
            id: "san_diego_padres",
            name: "San Diego Padres",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/san-diego-padres.webp",
            description: "Logo oficial de los San Diego Padres."
        },
        {
            id: "san_francisco_giants",
            name: "San Francisco Giants",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/san_francisco_giants.webp",
            description: "Logo oficial de los San Francisco Giants."
        },
        {
            id: "st_louis_cardinals",
            name: "St. Louis Cardinals",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/stlouis_cardinals.webp",
            description: "Logo oficial de los St. Louis Cardinals."
        },
        {
            id: "washington_nationals",
            name: "Washington Nationals",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/washington_nationals.webp",
            description: "Logo oficial de los Washington Nationals."
        },

        // Estadios
        {
            id: "fenway_park",
            name: "Fenway Park",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadios",
            team: "Boston Red Sox",
            location: "Boston, Massachusetts",
            year: "1912",
            image: "assets/images/gallery/estadios/fenway_park.webp",
            description: "Inaugurado en 1912, es el estadio más antiguo en uso de las Grandes Ligas y hogar histórico de los Boston Red Sox."
        },
        {
            id: "yankee_stadium",
            name: "Yankee Stadium",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadios",
            team: "New York Yankees",
            location: "Bronx, Nueva York",
            year: "2009",
            image: "assets/images/gallery/estadios/yankee_stadium.webp",
            description: "Casa de los New York Yankees, heredero del legendario estadio original inaugurado en 1923."
        },
        {
            id: "wrigley_field",
            name: "Wrigley Field",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadios",
            team: "Chicago Cubs",
            location: "Chicago, Illinois",
            year: "1914",
            image: "assets/images/gallery/estadios/wrigley_field.webp",
            description: "Conocido como 'Friendly Confines', es uno de los estadios más emblemáticos y antiguos de la MLB."
        },
        {
            id: "dodger_stadium",
            name: "Dodger Stadium",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadios",
            team: "Los Angeles Dodgers",
            location: "Los Ángeles, California",
            year: "1962",
            image: "assets/images/gallery/estadios/dodger_stadium.webp",
            description: "El estadio con mayor capacidad de la MLB y hogar de Los Angeles Dodgers desde 1962."
        },
        {
            id: "oracle_park",
            name: "Oracle Park",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadios",
            team: "San Francisco Giants",
            location: "San Francisco, California",
            year: "2000",
            image: "assets/images/gallery/estadios/oracle_park.webp",
            description: "Ubicado a orillas de la bahía de San Francisco, es la casa de los San Francisco Giants."
        },
        {
            id: "camden_yards",
            name: "Camden Yards",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadios",
            team: "Baltimore Orioles",
            location: "Baltimore, Maryland",
            year: "1992",
            image: "assets/images/gallery/estadios/camden_yards.webp",
            description: "Pionero del estilo retro de estadios modernos, es el hogar de los Baltimore Orioles desde 1992."
        }
    ];

    let currentFilter = "all";
    let currentSearch = "";

    function getElement(id) {
        return document.getElementById(id);
    }

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<​​", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getFilteredItems() {
        const search = currentSearch.trim().toLowerCase();

        return galleryItems.filter((item) => {
            const matchesFilter =
                currentFilter === "all" ||
                (currentFilter === "estadios" && item.category === "estadios") ||
                item.league === currentFilter;

            const matchesSearch =
                !search ||
                item.name.toLowerCase().includes(search) ||
                item.leagueLabel.toLowerCase().includes(search) ||
                (item.team && item.team.toLowerCase().includes(search)) ||
                (item.location && item.location.toLowerCase().includes(search));

            return matchesFilter && matchesSearch;
        });
    }

    function renderGallery() {
        const grid = getElement("gallery-grid");
        const status = getElement("gallery-status");
        const emptyState = getElement("gallery-empty-state");

        if (!grid) {
            return;
        }

        const filteredItems = getFilteredItems();

        grid.innerHTML = filteredItems.map((item) => `
            <article
                class="gallery-card"
                data-gallery-id="${escapeHTML(item.id)}"
                tabindex="0"
                role="button"
                aria-label="Abrir pieza: ${escapeHTML(item.name)}">

                <div class="gallery-card-image">
                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${item.category === "estadios" ? "Foto de" : "Logo de"} ${escapeHTML(item.name)}"
                        loading="lazy"
                        onerror="this.closest('.gallery-card').classList.add('image-error');">

                    <span class="gallery-card-overlay">
                        Ver pieza
                    </span>
                </div>

                <div class="gallery-card-content">
                    <span class="gallery-card-league">
                        ${escapeHTML(item.leagueLabel)}
                    </span>

                    <h2>${escapeHTML(item.name)}</h2>

                    <p>
                        ${item.category === "estadios"
                            ? escapeHTML(`${item.team} · ${item.location}`)
                            : "Colección de equipos"}
                    </p>
                </div>
            </article>
        `).join("");

        if (status) {
            status.textContent = `${filteredItems.length} ${
                filteredItems.length === 1 ? "pieza encontrada" : "piezas encontradas"
            }`;
        }

        if (emptyState) {
            emptyState.classList.toggle("hidden", filteredItems.length !== 0);
        }

        grid.classList.toggle("hidden", filteredItems.length === 0);
    }

    function openModal(item) {
        const modal = getElement("gallery-modal");
        const image = getElement("gallery-modal-image");
        const title = getElement("gallery-modal-title");
        const league = getElement("gallery-modal-league");
        const description = getElement("gallery-modal-description");

        if (!modal || !image || !title || !league || !description) {
            return;
        }

        image.src = item.image;
        image.alt = `${item.category === "estadios" ? "Foto de" : "Logo de"} ${item.name}`;
        title.textContent = item.name;
        league.textContent = item.category === "estadios"
            ? `${item.leagueLabel} · ${item.team} · ${item.location} (${item.year})`
            : item.leagueLabel;
        description.textContent = item.description;

        modal.classList.remove("hidden");
        document.body.classList.add("gallery-modal-open");

        const closeButton = getElement("gallery-modal-close");
        closeButton?.focus();
    }

    function closeModal() {
        const modal = getElement("gallery-modal");

        if (!modal) {
            return;
        }

        modal.classList.add("hidden");
        document.body.classList.remove("gallery-modal-open");
    }

    function handleGalleryClick(event) {
        const card = event.target.closest("[data-gallery-id]");

        if (card) {
            const item = galleryItems.find(
                (galleryItem) => galleryItem.id === card.dataset.galleryId
            );

            if (item) {
                openModal(item);
            }

            return;
        }

        if (event.target.closest("[data-gallery-close]")) {
            closeModal();
        }
    }

    function handleGalleryKeydown(event) {
        const card = event.target.closest("[data-gallery-id]");

        if (card && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();

            const item = galleryItems.find(
                (galleryItem) => galleryItem.id === card.dataset.galleryId
            );

            if (item) {
                openModal(item);
            }

            return;
        }

        if (event.key === "Escape") {
            closeModal();
        }
    }

    function setupGalleryEvents() {
        const grid = getElement("gallery-grid");
        const searchInput = getElement("gallery-search-input");
        const filterButtons = document.querySelectorAll("[data-gallery-filter]");

        grid?.addEventListener("click", handleGalleryClick);
        grid?.addEventListener("keydown", handleGalleryKeydown);

        getElement("gallery-modal")?.addEventListener(
            "click",
            handleGalleryClick
        );

        searchInput?.addEventListener("input", (event) => {
            currentSearch = event.target.value;
            renderGallery();
        });

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                currentFilter = button.dataset.galleryFilter;

                filterButtons.forEach((filterButton) => {
                    filterButton.classList.toggle(
                        "active",
                        filterButton === button
                    );
                });

                renderGallery();
            });
        });
    }

    function initGallery() {
        const grid = getElement("gallery-grid");

        if (!grid) {
            return;
        }

        setupGalleryEvents();
        renderGallery();
    }

    window.Gallery = {
        init: initGallery,
        items: galleryItems,
        render: renderGallery,
        openModal,
        closeModal
    };

    initGallery();
})();