/* eslint-disable import/extensions */
// Imports
import { fetchParsedDataFromAPI, buildUrl, buildHeader } from '../src/functions.js';
import config from '../src/config.js';

// Constants
const API_FOOTBALL_TEAMS = 'https://v3.football.api-sports.io/teams';
const API_FOOTBALL_FIXTURE = 'https://v3.football.api-sports.io/fixtures';

// Helper function
function strBuilder(gameData, isHome, isArgentinian, otherTeams) {
  const response = `${
    isHome ? gameData.teams.home.name : gameData.teams.away.name
  } juega de ${isHome ? 'local' : 'visitante'} contra ${
    isHome ? gameData.teams.away.name : gameData.teams.home.name
  } el ${new Date(gameData.fixture.timestamp * 1000).toLocaleDateString(
    'es-MX',
  )} a las ${new Date(gameData.fixture.timestamp * 1000).toLocaleTimeString(
    'es-MX',
    { hour: '2-digit', minute: '2-digit' },
  )} horas`;

  if (!isArgentinian) {
    return response.concat(
      ' (mostrando al equipo extranjero de mas renombre, no se encontraron equipos de Argentina)',
    );
  } if (otherTeams.length !== 0) {
    return response.concat(
      ` (mostrando al equipo de mas renombre, se encontraron tambien: ${otherTeams.join(
        ', ',
      )})`,
    );
  }
  return response;
}

// !cuandojuega implementation
export default async function cuandoJuega(args) {
  args.shift(); // removes "cuandojuega" from array of arguments

  // Fetches parsed data and stores both every and argentinian teams
  let allTeams;
  {
    const rawData = await fetchParsedDataFromAPI(
      buildUrl(API_FOOTBALL_TEAMS, { search: args.join(' ') }),
      'GET',
      buildHeader({ 'x-apisports-key': config.apisportsToken }),
    );
    allTeams = rawData.response;
  }
  if (allTeams.length === 0) return 'No reconozco el equipo buscado'; // No team found at all
  const argentinianTeams = allTeams.filter(
    (element) => element.team.country === 'Argentina' && element.team.founded != null,
  );

  // In case of no argentian team, return the lowest id offshore team
  if (argentinianTeams.length === 0) {
    const offshoreTeam = allTeams[0].team;
    let gameData;
    {
      const rawGameData = await fetchParsedDataFromAPI(
        buildUrl(API_FOOTBALL_FIXTURE, { team: offshoreTeam.id, next: 1 }),
        'GET',
        buildHeader({ 'x-apisports-key': config.apisportsToken }),
      );
      // eslint-disable-next-line prefer-destructuring
      gameData = rawGameData.response[0];
    }
    const isHome = gameData.teams.home.id === offshoreTeam.id;
    return strBuilder(gameData, isHome, false);
  }

  // Argentinian team
  const argentinianTeam = argentinianTeams[0].team;
  const otherTeamsNames = [];
  if (argentinianTeams.length > 1) {
    for (let i = 1; i < argentinianTeams.length; i += 1) {
      otherTeamsNames.push(argentinianTeams[i].team.name);
    }
  }
  let gameData;
  {
    const rawGameData = await fetchParsedDataFromAPI(
      buildUrl(API_FOOTBALL_FIXTURE, { team: argentinianTeam.id, next: 1 }),
      'GET',
      buildHeader({ 'x-apisports-key': config.apisportsToken }),
    );
    // eslint-disable-next-line prefer-destructuring
    gameData = rawGameData.response[0];
  }

  const isHome = gameData.teams.home.id === argentinianTeam.id;
  return strBuilder(gameData, isHome, true, otherTeamsNames);
}
