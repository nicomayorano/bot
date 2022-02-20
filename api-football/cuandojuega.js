// Imports
import { fetchParsedDataFromAPI, buildUrl, buildHeader } from "../functions.js";
import config from "../config.js";

// Constants
const API_FOOTBALL_TEAMS = "https://v3.football.api-sports.io/teams";
const API_FOOTBALL_FIXTURE = "https://v3.football.api-sports.io/fixtures";

// Helper function
function strBuilder(gameData, isHome, isArgentinian, otherTeams) {
  let response = `${
    isHome ? gameData.teams.home.name : gameData.teams.away.name
  } juega de ${isHome ? "local" : "visitante"} contra ${
    isHome ? gameData.teams.away.name : gameData.teams.home.name
  }, el ${new Date(gameData.fixture.timestamp * 1000).toLocaleDateString(
    "es-AR"
  )} a las ${new Date(gameData.fixture.timestamp * 1000).toLocaleTimeString(
    "es-AR",
    { second: undefined }
  )} horas`;

  if (!isArgentinian) {
    return response.concat(
      "(mostrando al equipo extranjero de mas renombre, no se encontraron equipos de Argentina)"
    );
  } else if (otherTeams.length != 0) {
    return response.concat(
      `(mostrando al equipo de mas renombre, se encontraron tambien: ${otherTeams.join(
        ", "
      )})`
    );
  }
  return response;
}

// !cuandojuega implementation
export async function cuandoJuega(args) {
  args.shift(); // removes "cuandojuega" from array of arguments

  // Fetches parsed data and stores both every and argentinian teams
  let allTeams;
  {
    let rawData = await fetchParsedDataFromAPI(
      buildUrl(API_FOOTBALL_TEAMS, { search: args.join(" ") }),
      "GET",
      buildHeader({ "x-apisports-key": config.apisportsToken })
    );
    allTeams = rawData.response;
  }
  if (allTeams.length === 0) return "No reconozco el equipo buscado"; // No team found at all
  let argentinianTeams = allTeams.filter(
    (element) =>
      element.team.country === "Argentina" && element.team.founded != null
  );

  // In case of no argentian team, return the lowest id offshore team
  if (argentinianTeams.length === 0) {
    let offshoreTeam = allTeams[0].team;
    let gameData;
    {
      let rawGameData = await fetchParsedDataFromAPI(
        buildUrl(API_FOOTBALL_FIXTURE, { team: offshoreTeam.id, next: 1 }),
        "GET",
        buildHeader({ "x-apisports-key": config.apisportsToken })
      );
      gameData = rawGameData.response[0];
    }
    let isHome = gameData.teams.home.id === offshoreTeam.id ? true : false;
    return strBuilder(gameData, isHome, false);
  }

  // Argentinian team
  let argentinianTeam = argentinianTeams[0].team;
  let otherTeamsNames = [];
  if (argentinianTeams.length > 1) {
    for (const element of argentinianTeams)
      otherTeamsNames.push(element.team.name);
  }
  let gameData;
  {
    let rawGameData = await fetchParsedDataFromAPI(
      buildUrl(API_FOOTBALL_FIXTURE, { team: argentinianTeam.id, next: 1 }),
      "GET",
      buildHeader({ "x-apisports-key": config.apisportsToken })
    );
    gameData = rawGameData.response[0];
  }

  let isHome = gameData.teams.home.id === argentinianTeam.id ? true : false;
  return strBuilder(gameData, isHome, true, otherTeamsNames);
}
