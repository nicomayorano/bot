// Imports
import { fetchParsedDataFromAPI, buildUrl, buildHeader } from '../functions.js'
import config from '../config.js';

// Constants
const API_FOOTBALL_TEAMS = "https://v3.football.api-sports.io/teams";
const API_FOOTBALL_FIXTURE = "https://v3.football.api-sports.io/fixtures";

// !cuandojuega implementation
export async function buscarEquipo(string) {
    let parsedTeams = await fetchParsedDataFromAPI(buildUrl(API_FOOTBALL_TEAMS, {search: string}), 'GET', buildHeader({'x-apisports-key': config.apisportsToken }));
    let argentinianTeams = parsedTeams.response.filter(element => element.team.country === "Argentina");
    if (argentinianTeams.length != 1) return []; 
    return argentinianTeams[0].team.id;
}

export async function buscarProximoOponente(teamID) {
    let data = await fetchParsedDataFromAPI(buildUrl(API_FOOTBALL_FIXTURE, {team: teamID, next: 1, season: new Date().getFullYear()}), 'GET', buildHeader({'x-apisports-key': config.apisportsToken }));
    return data.response[0];
}