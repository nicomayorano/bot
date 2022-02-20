// Imports
import { buscarEquipo, buscarProximoOponente } from '../api-football/cuandojuega.js';

// Constants
const MESSAGE_COMMAND_SUFFIX = '!';

export default {
	name: 'messageCreate',
	async execute(message) {
        if (!message.content.startsWith(MESSAGE_COMMAND_SUFFIX)) return;
		let splitString = message.content.substring(1).replace(/\s+/g, ' ').trim().split(' '); //removes suffix and repeated whitespaces, splits in an array of strings

        switch(splitString[0]) {
			case 'cuandojuega':
				splitString.shift();
				let teamID = await buscarEquipo(splitString.join(' '));
				if (teamID.length === 0) {
					message.reply("No reconozco el equipo o hay varios con ese nombre");
					break;
				}
				let data = await buscarProximoOponente(teamID);
				let isHome = data.teams.home.id === teamID ? true : false;
				message.reply(`Contra ${isHome ? data.teams.away.name : data.teams.home.name} el ${new Date(data.fixture.timestamp * 1000).toLocaleDateString()}`)
  				.then(() => console.log(`Replied to message "${message.content}"`))
  				.catch(console.error);
				break;
		}
	}
}