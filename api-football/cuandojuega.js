/* eslint-disable import/extensions */
// Imports
import { MessageEmbed } from 'discord.js';
import { fetchParsedDataFromAPI, buildUrl, buildHeader } from '../src/functions.js';
import config from '../src/config.js';

// Constants
const API_FOOTBALL_TEAMS = 'https://v3.football.api-sports.io/teams';
const API_FOOTBALL_FIXTURE = 'https://v3.football.api-sports.io/fixtures';

// Helper function
function embedBuilder(isHome, gameData, isArgentinian = false, otherTeams = []) {
  const date = new Date(gameData.fixture.timestamp * 1000).toLocaleDateString('es-MX');
  const time = new Date(gameData.fixture.timestamp * 1000).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const embed = new MessageEmbed()
    .setTitle('Proximo partido')
    .addFields(
      { name: 'Fecha', value: `${date} ${time}` },
      { name: 'Rival', value: isHome ? gameData.teams.away.name : gameData.teams.home.name },
      { name: 'Estadio', value: gameData.fixture.venue.name },
    )
    .setImage(isHome ? gameData.teams.home.logo : gameData.teams.away.logo);
  if (isArgentinian && otherTeams.length) embed.setFooter(`Otros equipos: ${otherTeams.join(', ')}`);
  return embed;
}

// !cuandojuega implementation
export default async function cuandoJuega(args) {
  args.shift(); // removes command from array of arguments

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
  if (allTeams.length === 0) { // No team found at all
    const embed = new MessageEmbed().setTitle('Equipo no encontrado');
    return embed;
  }
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
    if (!gameData) { // No team found at all
      const embed = new MessageEmbed().setTitle('Proximo partido indefinido');
      return embed;
    }
    return embedBuilder(gameData.teams.home.id === offshoreTeam.id, gameData);
  }

  // Argentinian team
  const argentinianTeam = argentinianTeams[0].team;
  const otherTeams = [];
  if (argentinianTeams.length > 1) {
    for (let i = 1; i < argentinianTeams.length; i += 1) {
      otherTeams.push(argentinianTeams[i].team.name);
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
  if (!gameData) { // No team found at all
    const embed = new MessageEmbed().setTitle('Proximo partido indefinido');
    return embed;
  }
  return embedBuilder(gameData.teams.home.id === argentinianTeam.id, gameData, true, otherTeams);
}
