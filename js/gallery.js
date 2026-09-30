(() => {
    "use strict";

    /*
     * Archivo Visual
     * 30 logos + 6 estadios = 36 piezas.
     *
     * Costos:
     * - Logos: 60 puntos
     * - Estadios: 180 puntos
     *
     * El saldo se comparte con Trivia y Home Run Derby:
     * localStorage["museumPoints"]
     */

    const MUSEUM_POINTS_KEY =
        "museumPoints";

    const COLLECTION_KEY =
        "museumVisualCollection";

    const FAVORITE_GIFT_KEY =
        "museumFavoriteGiftClaimed";

    const TEAM_PRICE =
        60;

    const STADIUM_PRICE =
        180;


    const galleryItems = [

        // =====================================================
        // LIGA AMERICANA
        // =====================================================

        {
            id: "athletics",
            name: "Athletics",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/athletics.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Athletics, franquicia histórica de la Liga Americana."
        },

        {
            id: "baltimore_orioles",
            name: "Baltimore Orioles",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/baltimore_orioles.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Baltimore Orioles."
        },

        {
            id: "boston_red_sox",
            name: "Boston Red Sox",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/boston_red_sox.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Boston Red Sox."
        },

        {
            id: "chicago_white_sox",
            name: "Chicago White Sox",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/chicago_white_sox.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Chicago White Sox."
        },

        {
            id: "cleveland_guardians",
            name: "Cleveland Guardians",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/cleveland_guardians.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Cleveland Guardians."
        },

        {
            id: "detroit_tigers",
            name: "Detroit Tigers",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/detroit_tigers.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Detroit Tigers."
        },

        {
            id: "houston_astros",
            name: "Houston Astros",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/houston_astros.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Houston Astros."
        },

        {
            id: "kansas_city_royals",
            name: "Kansas City Royals",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/kansas-city-royals.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Kansas City Royals."
        },

        {
            id: "los_angeles_angels",
            name: "Los Angeles Angels",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/los_angeles_angels.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de Los Angeles Angels."
        },

        {
            id: "minnesota_twins",
            name: "Minnesota Twins",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/minnesota_twins.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Minnesota Twins."
        },

        {
            id: "new_york_yankees",
            name: "New York Yankees",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/new_york_yankees.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los New York Yankees."
        },

        {
            id: "seattle_mariners",
            name: "Seattle Mariners",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/seattle_mariners.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Seattle Mariners."
        },

        {
            id: "tampa_bay_rays",
            name: "Tampa Bay Rays",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/tampa_bay_rays_logo.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Tampa Bay Rays."
        },

        {
            id: "texas_rangers",
            name: "Texas Rangers",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/texas_rangers.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Texas Rangers."
        },

        {
            id: "toronto_blue_jays",
            name: "Toronto Blue Jays",
            league: "American",
            leagueLabel: "Liga Americana",
            image: "assets/images/gallery/equipos/toronto_blue_jays.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Toronto Blue Jays."
        },


        // =====================================================
        // LIGA NACIONAL
        // =====================================================

        {
            id: "arizona_diamondbacks",
            name: "Arizona Diamondbacks",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/arizona_diamondbacks.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Arizona Diamondbacks."
        },

        {
            id: "atlanta_braves",
            name: "Atlanta Braves",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/atlanta_braves.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Atlanta Braves."
        },

        {
            id: "chicago_cubs",
            name: "Chicago Cubs",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/chicago_cubs.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Chicago Cubs."
        },

        {
            id: "cincinnati_reds",
            name: "Cincinnati Reds",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/cincinnati_reds.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Cincinnati Reds."
        },

        {
            id: "colorado_rockies",
            name: "Colorado Rockies",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/colorado_rockies.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Colorado Rockies."
        },

        {
            id: "los_angeles_dodgers",
            name: "Los Angeles Dodgers",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/los_angeles_dodgers.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de Los Angeles Dodgers."
        },

        {
            id: "miami_marlins",
            name: "Miami Marlins",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/miami_marlins.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Miami Marlins."
        },

        {
            id: "milwaukee_brewers",
            name: "Milwaukee Brewers",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/milwaukee_brewers.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Milwaukee Brewers."
        },

        {
            id: "new_york_mets",
            name: "New York Mets",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/new_york_mets.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los New York Mets."
        },

        {
            id: "philadelphia_phillies",
            name: "Philadelphia Phillies",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/philadelphia_phillies.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Philadelphia Phillies."
        },

        {
            id: "pittsburgh_pirates",
            name: "Pittsburgh Pirates",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/pittsburgh_pirates.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Pittsburgh Pirates."
        },

        {
            id: "san_diego_padres",
            name: "San Diego Padres",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/san-diego-padres.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los San Diego Padres."
        },

        {
            id: "san_francisco_giants",
            name: "San Francisco Giants",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/san_francisco_giants.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los San Francisco Giants."
        },

        {
            id: "st_louis_cardinals",
            name: "St. Louis Cardinals",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/stlouis_cardinals.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los St. Louis Cardinals."
        },

        {
            id: "washington_nationals",
            name: "Washington Nationals",
            league: "National",
            leagueLabel: "Liga Nacional",
            image: "assets/images/gallery/equipos/washington_nationals.webp",
            price: TEAM_PRICE,
            description:
                "Emblema de los Washington Nationals."
        },


        // =====================================================
        // ESTADIOS
        // =====================================================

        {
            id: "fenway_park",
            name: "Fenway Park",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadio",
            team: "Boston Red Sox",
            location: "Boston, Massachusetts",
            year: "1912",
            image: "assets/images/gallery/estadios/fenway_park.webp",
            price: STADIUM_PRICE,
            description:
                "Inaugurado en 1912, Fenway Park es el hogar histórico de los Boston Red Sox."
        },

        {
            id: "yankee_stadium",
            name: "Yankee Stadium",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadio",
            team: "New York Yankees",
            location: "Bronx, Nueva York",
            year: "2009",
            image: "assets/images/gallery/estadios/yankee_stadium.webp",
            price: STADIUM_PRICE,
            description:
                "Casa de los New York Yankees y sucesor del estadio original del Bronx."
        },

        {
            id: "wrigley_field",
            name: "Wrigley Field",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadio",
            team: "Chicago Cubs",
            location: "Chicago, Illinois",
            year: "1914",
            image: "assets/images/gallery/estadios/wrigley_field.webp",
            price: STADIUM_PRICE,
            description:
                "Uno de los parques más reconocibles de MLB y hogar de los Chicago Cubs."
        },

        {
            id: "dodger_stadium",
            name: "Dodger Stadium",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadio",
            team: "Los Angeles Dodgers",
            location: "Los Ángeles, California",
            year: "1962",
            image: "assets/images/gallery/estadios/dodger_stadium.webp",
            price: STADIUM_PRICE,
            description:
                "Hogar de Los Angeles Dodgers desde 1962."
        },

        {
            id: "oracle_park",
            name: "Oracle Park",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadio",
            team: "San Francisco Giants",
            location: "San Francisco, California",
            year: "2000",
            image: "assets/images/gallery/estadios/oracle_park.webp",
            price: STADIUM_PRICE,
            description:
                "Ubicado junto a la bahía de San Francisco, es la casa de los San Francisco Giants."
        },

        {
            id: "camden_yards",
            name: "Camden Yards",
            type: "stadium",
            category: "estadios",
            leagueLabel: "Estadio",
            team: "Baltimore Orioles",
            location: "Baltimore, Maryland",
            year: "1992",
            image: "assets/images/gallery/estadios/camden_yards.webp",
            price: STADIUM_PRICE,
            description:
                "Oriole Park at Camden Yards es el hogar de los Baltimore Orioles."
        }
    ];


    let currentFilter =
        "all";

    let currentSearch =
        "";

    let currentModalItem =
        null;


    function getElement(id) {
        return document.getElementById(id);
    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
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


    function getUnlockedIds() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        COLLECTION_KEY
                    ) || "[]"
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.warn(
                "[Galería] Colección inválida:",
                error
            );

            return [];
        }
    }


    function saveUnlockedIds(ids) {

        const clean =
            Array.from(
                new Set(ids)
            );

        localStorage.setItem(
            COLLECTION_KEY,
            JSON.stringify(clean)
        );
    }


    function isUnlocked(itemId) {

        return getUnlockedIds()
            .includes(itemId);
    }


    function unlockItem(itemId) {

        const unlocked =
            getUnlockedIds();

        if (
            !unlocked.includes(
                itemId
            )
        ) {

            unlocked.push(
                itemId
            );

            saveUnlockedIds(
                unlocked
            );
        }
    }


    function mapFavoriteToGalleryId(
        favoriteId
    ) {

        if (
            favoriteId ===
            "oakland_athletics"
        ) {
            return "athletics";
        }

        return favoriteId;
    }


    function isFavoritePiece(item) {

        const favoriteId =
            mapFavoriteToGalleryId(
                localStorage.getItem(
                    "favoriteTeam"
                ) || ""
            );

        return (
            item.category !==
                "estadios" &&
            item.id ===
                favoriteId
        );
    }


    function applyFavoriteWelcomeGift() {

        if (
            localStorage.getItem(
                FAVORITE_GIFT_KEY
            ) === "true"
        ) {
            return;
        }


        const favoriteId =
            mapFavoriteToGalleryId(
                localStorage.getItem(
                    "favoriteTeam"
                ) || ""
            );


        if (!favoriteId) {
            return;
        }


        const item =
            galleryItems.find(
                galleryItem =>
                    galleryItem.id ===
                    favoriteId &&
                    galleryItem.category !==
                    "estadios"
            );


        if (!item) {
            return;
        }


        unlockItem(
            item.id
        );


        localStorage.setItem(
            FAVORITE_GIFT_KEY,
            "true"
        );


        const message =
            getElement(
                "gallery-gift-message"
            );


        if (message) {

            message.innerHTML =
                `🎁 Pieza de bienvenida: ` +
                `<strong>${escapeHTML(item.name)}</strong> ` +
                `se añadió gratis a tu colección.`;

            message.classList.remove(
                "hidden"
            );
        }
    }


    function updateArchiveHUD() {

        const points =
            getMuseumPoints();

        const unlocked =
            getUnlockedIds()
                .filter(
                    id =>
                        galleryItems.some(
                            item =>
                                item.id === id
                        )
                );


        const balance =
            getElement(
                "gallery-museum-points"
            );


        const progressText =
            getElement(
                "gallery-progress-text"
            );


        const progressFill =
            getElement(
                "gallery-progress-fill"
            );


        if (balance) {

            balance.textContent =
                points;
        }


        if (progressText) {

            progressText.textContent =
                `${unlocked.length} / ${galleryItems.length}`;
        }


        if (progressFill) {

            progressFill.style.width =
                `${
                    (
                        unlocked.length /
                        galleryItems.length
                    ) * 100
                }%`;
        }
    }


    function getFilteredItems() {

        const search =
            currentSearch
                .trim()
                .toLowerCase();


        return galleryItems.filter(
            item => {

                const unlocked =
                    isUnlocked(
                        item.id
                    );


                const matchesFilter =
                    currentFilter ===
                        "all" ||

                    (
                        currentFilter ===
                            "unlocked" &&
                        unlocked
                    ) ||

                    (
                        currentFilter ===
                            "estadios" &&
                        item.category ===
                            "estadios"
                    ) ||

                    item.league ===
                        currentFilter;


                const searchable =
                    [
                        item.name,
                        item.leagueLabel,
                        item.team,
                        item.location
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                return (
                    matchesFilter &&
                    matchesSearch
                );
            }
        );
    }


    function renderGallery() {

        const grid =
            getElement(
                "gallery-grid"
            );

        const status =
            getElement(
                "gallery-status"
            );

        const emptyState =
            getElement(
                "gallery-empty-state"
            );


        if (!grid) {
            return;
        }


        updateArchiveHUD();


        const filteredItems =
            getFilteredItems();


        grid.innerHTML =
            filteredItems.map(
                item => {

                    const unlocked =
                        isUnlocked(
                            item.id
                        );


                    const favorite =
                        isFavoritePiece(
                            item
                        );


                    const stateClass =
                        unlocked
                            ? "unlocked"
                            : "locked";


                    const favoriteClass =
                        favorite
                            ? "favorite-piece"
                            : "";


                    const subtitle =
                        item.category ===
                            "estadios"
                            ? `${item.team} · ${item.location}`
                            : "Colección de equipos";


                    return `
                        <article
                            class="gallery-card ${stateClass} ${favoriteClass}"
                            data-gallery-id="${escapeHTML(item.id)}"
                            tabindex="0"
                            role="button"
                            aria-label="${
                                unlocked
                                    ? "Abrir pieza"
                                    : "Desbloquear pieza"
                            }: ${escapeHTML(item.name)}">

                            <div class="gallery-card-image">

                                <img
                                    src="${escapeHTML(item.image)}"
                                    alt=""
                                    loading="lazy"
                                    onerror="this.closest('.gallery-card').classList.add('image-error');">

                                <span class="gallery-card-overlay">
                                    ${
                                        unlocked
                                            ? "Ver pieza"
                                            : `🔒<span>${item.price} pts</span>`
                                    }
                                </span>

                            </div>

                            <div class="gallery-card-content">

                                <span class="gallery-card-league">
                                    ${escapeHTML(item.leagueLabel)}
                                </span>

                                <h2>
                                    ${escapeHTML(item.name)}
                                </h2>

                                <p>
                                    ${escapeHTML(subtitle)}
                                </p>

                                ${
                                    unlocked
                                        ? `
                                            <span class="gallery-card-owned">
                                                ✓ Desbloqueado
                                            </span>
                                        `
                                        : `
                                            <span class="gallery-card-price">
                                                🏛️ ${item.price} pts
                                            </span>
                                        `
                                }

                            </div>

                        </article>
                    `;
                }
            ).join("");


        if (status) {

            const unlockedCount =
                getUnlockedIds()
                    .filter(
                        id =>
                            galleryItems.some(
                                item =>
                                    item.id === id
                            )
                    )
                    .length;


            status.textContent =
                `${filteredItems.length} ${
                    filteredItems.length === 1
                        ? "pieza visible"
                        : "piezas visibles"
                } · ${unlockedCount} desbloqueadas`;
        }


        if (emptyState) {

            emptyState.classList.toggle(
                "hidden",
                filteredItems.length !== 0
            );
        }


        grid.classList.toggle(
            "hidden",
            filteredItems.length === 0
        );
    }


    function renderModalPurchase(
        item,
        unlocked
    ) {

        const purchase =
            getElement(
                "gallery-modal-purchase"
            );

        const price =
            getElement(
                "gallery-modal-price"
            );

        const buyButton =
            getElement(
                "gallery-buy-button"
            );

        const message =
            getElement(
                "gallery-purchase-message"
            );


        if (
            !purchase ||
            !price ||
            !buyButton ||
            !message
        ) {
            return;
        }


        if (unlocked) {

            purchase.classList.add(
                "hidden"
            );

            message.textContent =
                "";

            return;
        }


        purchase.classList.remove(
            "hidden"
        );


        const balance =
            getMuseumPoints();


        const missing =
            Math.max(
                0,
                item.price -
                balance
            );


        price.innerHTML =
            `Costo: <strong>${item.price} puntos</strong><br>` +
            `Tu saldo: ${balance} puntos`;


        buyButton.disabled =
            balance <
            item.price;


        buyButton.textContent =
            balance >=
            item.price
                ? `Desbloquear por ${item.price} pts`
                : "Puntos insuficientes";


        if (missing > 0) {

            message.textContent =
                `Te faltan ${missing} puntos. Consíguelos en Trivia o Home Run Derby.`;

            message.className =
                "gallery-purchase-message error";

        } else {

            message.textContent =
                "La pieza quedará guardada permanentemente en tu colección.";

            message.className =
                "gallery-purchase-message";
        }
    }


    function openModal(item) {

        const modal =
            getElement(
                "gallery-modal"
            );

        const modalContent =
            getElement(
                "gallery-modal-content"
            );

        const image =
            getElement(
                "gallery-modal-image"
            );

        const title =
            getElement(
                "gallery-modal-title"
            );

        const league =
            getElement(
                "gallery-modal-league"
            );

        const description =
            getElement(
                "gallery-modal-description"
            );


        if (
            !modal ||
            !modalContent ||
            !image ||
            !title ||
            !league ||
            !description
        ) {
            return;
        }


        currentModalItem =
            item;


        const unlocked =
            isUnlocked(
                item.id
            );


        image.src =
            item.image;


        image.alt =
            unlocked
                ? `${
                    item.category ===
                        "estadios"
                        ? "Foto de"
                        : "Logo de"
                } ${item.name}`
                : "";


        title.textContent =
            item.name;


        league.textContent =
            item.category ===
                "estadios"
                ? `${item.leagueLabel} · ${item.team}`
                : item.leagueLabel;


        description.textContent =
            unlocked
                ? item.description
                : (
                    item.category ===
                        "estadios"
                        ? `Fotografía de ${item.location}. Desbloquea esta pieza para verla completa y añadirla a tu archivo.`
                        : "Desbloquea este emblema para verlo completo y añadirlo a tu archivo."
                );


        modalContent.classList.toggle(
            "locked-piece",
            !unlocked
        );


        renderModalPurchase(
            item,
            unlocked
        );


        modal.classList.remove(
            "hidden"
        );


        document.body.classList.add(
            "gallery-modal-open"
        );


        getElement(
            "gallery-modal-close"
        )?.focus();
    }


    function closeModal() {

        const modal =
            getElement(
                "gallery-modal"
            );


        if (!modal) {
            return;
        }


        modal.classList.add(
            "hidden"
        );


        document.body.classList.remove(
            "gallery-modal-open"
        );


        currentModalItem =
            null;
    }


    function purchaseCurrentItem() {

        const item =
            currentModalItem;


        if (!item) {
            return;
        }


        if (
            isUnlocked(
                item.id
            )
        ) {

            openModal(item);

            return;
        }


        const balance =
            getMuseumPoints();


        const message =
            getElement(
                "gallery-purchase-message"
            );


        if (
            balance <
            item.price
        ) {

            const missing =
                item.price -
                balance;


            if (message) {

                message.textContent =
                    `Te faltan ${missing} puntos.`;

                message.className =
                    "gallery-purchase-message error";
            }

            return;
        }


        setMuseumPoints(
            balance -
            item.price
        );


        unlockItem(
            item.id
        );


        if (message) {

            message.textContent =
                "✓ Pieza desbloqueada.";

            message.className =
                "gallery-purchase-message success";
        }


        renderGallery();


        /*
         * Reabrimos inmediatamente el mismo modal
         * como pieza ya desbloqueada.
         */
        openModal(
            item
        );
    }


    function handleGalleryClick(event) {

        const card =
            event.target.closest(
                "[data-gallery-id]"
            );


        if (card) {

            const item =
                galleryItems.find(
                    galleryItem =>
                        galleryItem.id ===
                        card.dataset.galleryId
                );


            if (item) {
                openModal(item);
            }

            return;
        }


        if (
            event.target.closest(
                "[data-gallery-close]"
            )
        ) {

            closeModal();
        }
    }


    function handleGalleryKeydown(event) {

        const card =
            event.target.closest(
                "[data-gallery-id]"
            );


        if (
            card &&
            (
                event.key ===
                    "Enter" ||
                event.key ===
                    " "
            )
        ) {

            event.preventDefault();


            const item =
                galleryItems.find(
                    galleryItem =>
                        galleryItem.id ===
                        card.dataset.galleryId
                );


            if (item) {
                openModal(item);
            }

            return;
        }


        if (
            event.key ===
            "Escape"
        ) {

            closeModal();
        }
    }


    function setupGalleryEvents() {

        const root =
            getElement(
                "galeria-view"
            );


        if (
            !root ||
            root.dataset.galleryBound ===
                "true"
        ) {
            return;
        }


        root.dataset.galleryBound =
            "true";


        const grid =
            getElement(
                "gallery-grid"
            );


        const searchInput =
            getElement(
                "gallery-search-input"
            );


        const filterButtons =
            root.querySelectorAll(
                "[data-gallery-filter]"
            );


        grid?.addEventListener(
            "click",
            handleGalleryClick
        );


        grid?.addEventListener(
            "keydown",
            handleGalleryKeydown
        );


        getElement(
            "gallery-modal"
        )?.addEventListener(
            "click",
            handleGalleryClick
        );


        getElement(
            "gallery-buy-button"
        )?.addEventListener(
            "click",
            purchaseCurrentItem
        );


        searchInput?.addEventListener(
            "input",
            event => {

                currentSearch =
                    event.target.value;

                renderGallery();
            }
        );


        filterButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentFilter =
                            button.dataset.galleryFilter;


                        filterButtons.forEach(
                            filterButton => {

                                filterButton.classList.toggle(
                                    "active",
                                    filterButton ===
                                        button
                                );
                            }
                        );


                        renderGallery();
                    }
                );
            }
        );
    }


    function handlePointsChanged() {

        if (
            !getElement(
                "galeria-view"
            )
        ) {
            return;
        }


        updateArchiveHUD();


        if (
            currentModalItem
        ) {

            renderModalPurchase(
                currentModalItem,
                isUnlocked(
                    currentModalItem.id
                )
            );
        }
    }


    function initGallery() {

        const grid =
            getElement(
                "gallery-grid"
            );


        if (!grid) {
            return;
        }


        currentFilter =
            "all";


        currentSearch =
            "";


        applyFavoriteWelcomeGift();


        setupGalleryEvents();


        renderGallery();
    }


    /*
     * Se registra una sola vez aunque app.js
     * vuelva a inicializar la vista.
     */
    if (
        !window.__galleryPointsListener
    ) {

        window.addEventListener(
            "museumPointsChanged",
            handlePointsChanged
        );


        window.__galleryPointsListener =
            true;
    }


    window.Gallery = {
        init: initGallery,
        items: galleryItems,
        render: renderGallery,
        openModal,
        closeModal,
        getMuseumPoints,
        getUnlockedIds
    };


    initGallery();

})();