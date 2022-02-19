// Imports
const { dirname } = require('path');
const appDir = dirname(require.main.filename); // not an import
const funciones = require(appDir + '/functions.js');
const { apisportsToken } = require(appDir + '/config.json')

// Constants
const API_FOOTBALL_TEAMS = "https://v3.football.api-sports.io/teams";



const cuandoJuega = {
    buscarEquipo(string) {
        let parsedTeams = funciones.fetchParsedDataFromAPI(funciones.buildUrl(API_FOOTBALL_TEAMS, {search: string}), 'GET', funciones.buildHeader({'x-apisports-key': apisportsToken }));
        return parsedTeams;
    }
}

module.exports = cuandoJuega;