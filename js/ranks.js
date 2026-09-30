/*
 * Baseball Legends Museum
 * Sistema de rangos del museo
 *
 * El rango depende únicamente de la cantidad de piezas
 * desbloqueadas en el Archivo Visual.
 *
 * 30 logos + 6 estadios = 36 piezas.
 */

(() => {

    const COLLECTION_KEY =
        "museumVisualCollection";

    const TOTAL_ITEMS =
        36;


    const RANKS = [

        {
            min: 0,
            max: 2,
            name: "Novato",
            icon: "⚾"
        },

        {
            min: 3,
            max: 7,
            name: "Aficionado",
            icon: "🧢"
        },

        {
            min: 8,
            max: 14,
            name: "Coleccionista",
            icon: "📚"
        },

        {
            min: 15,
            max: 23,
            name: "Historiador",
            icon: "📜"
        },

        {
            min: 24,
            max: 31,
            name: "Curador",
            icon: "🏛️"
        },

        {
            min: 32,
            max: 35,
            name: "Maestro del Museo",
            icon: "⭐"
        },

        {
            min: 36,
            max: 36,
            name: "Leyenda del Béisbol",
            icon: "👑"
        }

    ];


    function getUnlockedCount() {

        try {

            const collection =
                JSON.parse(
                    localStorage.getItem(
                        COLLECTION_KEY
                    ) || "[]"
                );


            if (
                !Array.isArray(
                    collection
                )
            ) {
                return 0;
            }


            const unique =
                new Set(
                    collection.filter(
                        value =>
                            typeof value ===
                            "string"
                    )
                );


            return Math.min(
                TOTAL_ITEMS,
                unique.size
            );

        } catch (error) {

            console.warn(
                "[Rangos] No se pudo leer la colección:",
                error
            );


            return 0;
        }
    }


    function getRank(
        unlockedCount
    ) {

        return (
            RANKS.find(
                rank =>
                    unlockedCount >=
                        rank.min &&
                    unlockedCount <=
                        rank.max
            ) ||
            RANKS[0]
        );
    }


    function getNextRank(
        currentRank
    ) {

        const index =
            RANKS.indexOf(
                currentRank
            );


        if (
            index < 0 ||
            index >=
            RANKS.length - 1
        ) {
            return null;
        }


        return RANKS[
            index + 1
        ];
    }


    function getRankProgress(
        unlockedCount,
        currentRank,
        nextRank
    ) {

        if (!nextRank) {
            return 100;
        }


        const start =
            currentRank.min;


        const target =
            nextRank.min;


        const range =
            Math.max(
                1,
                target - start
            );


        const progress =
            (
                unlockedCount -
                start
            ) /
            range;


        return Math.max(
            0,
            Math.min(
                100,
                progress * 100
            )
        );
    }


    function refresh() {

        const nameElement =
            document.getElementById(
                "museum-rank-name"
            );


        const iconElement =
            document.getElementById(
                "museum-rank-icon"
            );


        const progressLabel =
            document.getElementById(
                "museum-rank-progress-label"
            );


        const progressFill =
            document.getElementById(
                "museum-rank-progress-fill"
            );


        const collectionCount =
            document.getElementById(
                "museum-collection-count"
            );


        if (
            !nameElement ||
            !iconElement ||
            !progressLabel ||
            !progressFill ||
            !collectionCount
        ) {
            return;
        }


        const unlockedCount =
            getUnlockedCount();


        const currentRank =
            getRank(
                unlockedCount
            );


        const nextRank =
            getNextRank(
                currentRank
            );


        nameElement.textContent =
            currentRank.name;


        iconElement.textContent =
            currentRank.icon;


        collectionCount.textContent =
            `${unlockedCount} / ${TOTAL_ITEMS}`;


        if (nextRank) {

            const remaining =
                Math.max(
                    0,
                    nextRank.min -
                    unlockedCount
                );


            progressLabel.textContent =
                remaining === 1
                    ? `1 pieza para ${nextRank.name}`
                    : `${remaining} piezas para ${nextRank.name}`;


            progressFill.style.width =
                `${
                    getRankProgress(
                        unlockedCount,
                        currentRank,
                        nextRank
                    )
                }%`;

        } else {

            progressLabel.textContent =
                "Colección completa";


            progressFill.style.width =
                "100%";
        }


        document
            .getElementById(
                "museum-rank-card"
            )
            ?.setAttribute(
                "title",
                nextRank
                    ? `${unlockedCount}/${TOTAL_ITEMS} piezas · Próximo rango: ${nextRank.name}`
                    : `${TOTAL_ITEMS}/${TOTAL_ITEMS} piezas · Rango máximo`
            );
    }


    function init() {

        refresh();


        /*
         * app.js reemplaza el interior de #app-content al
         * navegar. Las compras de la galería también vuelven
         * a renderizar ese contenido, así que observándolo
         * mantenemos el encabezado sincronizado sin tocar app.js.
         */
        const appContent =
            document.getElementById(
                "app-content"
            );


        if (
            appContent &&
            !window.__museumRankObserver
        ) {

            const observer =
                new MutationObserver(
                    () => {

                        requestAnimationFrame(
                            refresh
                        );
                    }
                );


            observer.observe(
                appContent,
                {
                    childList: true,
                    subtree: true
                }
            );


            window.__museumRankObserver =
                observer;
        }


        window.addEventListener(
            "storage",
            event => {

                if (
                    event.key ===
                    COLLECTION_KEY
                ) {
                    refresh();
                }
            }
        );


        window.addEventListener(
            "museumPointsChanged",
            refresh
        );
    }


    window.MuseumRankSystem = {
        refresh,
        getUnlockedCount,
        getRank,
        ranks: RANKS
    };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );

    } else {

        init();
    }

})();