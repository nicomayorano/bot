// Imports
import { fetchParsedDataFromAPI, buildUrl, buildHeader } from '../functions.js'
import config from '../config.js';

// Constants
const API_FOOTBALL_TEAMS = "https://v3.football.api-sports.io/teams";

// !cuandojuega implementation
export function buscarEquipo(string) {
    let parsedTeams = fetchParsedDataFromAPI(buildUrl(API_FOOTBALL_TEAMS, {search: string}), 'GET', buildHeader({'x-apisports-key': config.apisportsToken }));
    return parsedTeams;
}