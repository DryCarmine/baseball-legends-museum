/*
 * Baseball Legends Museum
 * Catálogo oficial de equipos MLB
 *
 * Este archivo contiene únicamente los datos de los equipos.
 * La lógica de selección y personalización permanece en app.js.
 */

const MLB_TEAMS = [

    // =========================================================
    // LIGA AMERICANA
    // =========================================================

    {
        id: "baltimore_orioles",
        name: "Baltimore Orioles",
        shortName: "Orioles",
        league: "American",
        division: "AL East",
        logo: "assets/images/team_logos/National/baltimore_orioles.webp"
    },

    {
        id: "boston_red_sox",
        name: "Boston Red Sox",
        shortName: "Red Sox",
        league: "American",
        division: "AL East",
        logo: "assets/images/team_logos/National/boston_red_sox.webp"
    },

    {
        id: "new_york_yankees",
        name: "New York Yankees",
        shortName: "Yankees",
        league: "American",
        division: "AL East",
        logo: "assets/images/team_logos/National/new_york_yankees.webp"
    },

    {
        id: "tampa_bay_rays",
        name: "Tampa Bay Rays",
        shortName: "Rays",
        league: "American",
        division: "AL East",
        logo: "assets/images/team_logos/National/tampa_bay_rays_logo.webp"
    },

    {
        id: "toronto_blue_jays",
        name: "Toronto Blue Jays",
        shortName: "Blue Jays",
        league: "American",
        division: "AL East",
        logo: "assets/images/team_logos/National/toronto_blue_jays.webp"
    },

    {
        id: "chicago_white_sox",
        name: "Chicago White Sox",
        shortName: "White Sox",
        league: "American",
        division: "AL Central",
        logo: "assets/images/team_logos/National/chicago_white_sox.webp"
    },

    {
        id: "cleveland_guardians",
        name: "Cleveland Guardians",
        shortName: "Guardians",
        league: "American",
        division: "AL Central",
        logo: "assets/images/team_logos/National/cleveland_guardians.webp"
    },

    {
        id: "detroit_tigers",
        name: "Detroit Tigers",
        shortName: "Tigers",
        league: "American",
        division: "AL Central",
        logo: "assets/images/team_logos/National/detroit_tigers.webp"
    },

    {
        id: "kansas_city_royals",
        name: "Kansas City Royals",
        shortName: "Royals",
        league: "American",
        division: "AL Central",
        logo: "assets/images/team_logos/National/kansas-city-royals.webp"
    },

    {
        id: "minnesota_twins",
        name: "Minnesota Twins",
        shortName: "Twins",
        league: "American",
        division: "AL Central",
        logo: "assets/images/team_logos/National/minnesota_twins.webp"
    },

    {
        id: "houston_astros",
        name: "Houston Astros",
        shortName: "Astros",
        league: "American",
        division: "AL West",
        logo: "assets/images/team_logos/National/houston_astros.webp"
    },

    {
        id: "los_angeles_angels",
        name: "Los Angeles Angels",
        shortName: "Angels",
        league: "American",
        division: "AL West",
        logo: "assets/images/team_logos/National/los_angeles_angels.webp"
    },

    {
        id: "athletics",
        name: "Athletics",
        shortName: "Athletics",
        league: "American",
        division: "AL West",
        logo: "assets/images/team_logos/National/athletics.webp"
    },

    {
        id: "seattle_mariners",
        name: "Seattle Mariners",
        shortName: "Mariners",
        league: "American",
        division: "AL West",
        logo: "assets/images/team_logos/National/seattle_mariners.webp"
    },

    {
        id: "texas_rangers",
        name: "Texas Rangers",
        shortName: "Rangers",
        league: "American",
        division: "AL West",
        logo: "assets/images/team_logos/National/texas_rangers.webp"
    },

    // =========================================================
    // LIGA NACIONAL
    // =========================================================

    {
        id: "atlanta_braves",
        name: "Atlanta Braves",
        shortName: "Braves",
        league: "National",
        division: "NL East",
        logo: "assets/images/team_logos/American/atlanta_braves.webp"
    },

    {
        id: "miami_marlins",
        name: "Miami Marlins",
        shortName: "Marlins",
        league: "National",
        division: "NL East",
        logo: "assets/images/team_logos/American/miami_marlins.webp"
    },

    {
        id: "new_york_mets",
        name: "New York Mets",
        shortName: "Mets",
        league: "National",
        division: "NL East",
        logo: "assets/images/team_logos/American/new_york_mets.webp"
    },

    {
        id: "philadelphia_phillies",
        name: "Philadelphia Phillies",
        shortName: "Phillies",
        league: "National",
        division: "NL East",
        logo: "assets/images/team_logos/American/philadelphia_phillies.webp"
    },

    {
        id: "washington_nationals",
        name: "Washington Nationals",
        shortName: "Nationals",
        league: "National",
        division: "NL East",
        logo: "assets/images/team_logos/American/washington_nationals.webp"
    },

    {
        id: "chicago_cubs",
        name: "Chicago Cubs",
        shortName: "Cubs",
        league: "National",
        division: "NL Central",
        logo: "assets/images/team_logos/American/chicago_cubs.webp"
    },

    {
        id: "cincinnati_reds",
        name: "Cincinnati Reds",
        shortName: "Reds",
        league: "National",
        division: "NL Central",
        logo: "assets/images/team_logos/American/cincinnati_reds.webp"
    },

    {
        id: "milwaukee_brewers",
        name: "Milwaukee Brewers",
        shortName: "Brewers",
        league: "National",
        division: "NL Central",
        logo: "assets/images/team_logos/American/milwaukee_brewers.webp"
    },

    {
        id: "pittsburgh_pirates",
        name: "Pittsburgh Pirates",
        shortName: "Pirates",
        league: "National",
        division: "NL Central",
        logo: "assets/images/team_logos/American/pittsburgh_pirates.webp"
    },

    {
        id: "st_louis_cardinals",
        name: "St. Louis Cardinals",
        shortName: "Cardinals",
        league: "National",
        division: "NL Central",
        logo: "assets/images/team_logos/American/stlouis_cardinals.webp"
    },

    {
        id: "arizona_diamondbacks",
        name: "Arizona Diamondbacks",
        shortName: "D-backs",
        league: "National",
        division: "NL West",
        logo: "assets/images/team_logos/American/arizona_diamondbacks.webp"
    },

    {
        id: "colorado_rockies",
        name: "Colorado Rockies",
        shortName: "Rockies",
        league: "National",
        division: "NL West",
        logo: "assets/images/team_logos/American/colorado_rockies.webp"
    },

    {
        id: "los_angeles_dodgers",
        name: "Los Angeles Dodgers",
        shortName: "Dodgers",
        league: "National",
        division: "NL West",
        logo: "assets/images/team_logos/American/los_angeles_dodgers.webp"
    },

    {
        id: "san_diego_padres",
        name: "San Diego Padres",
        shortName: "Padres",
        league: "National",
        division: "NL West",
        logo: "assets/images/team_logos/American/san-diego-padres.webp"
    },

    {
        id: "san_francisco_giants",
        name: "San Francisco Giants",
        shortName: "Giants",
        league: "National",
        division: "NL West",
        logo: "assets/images/team_logos/American/san_francisco_giants.webp"
    }

];