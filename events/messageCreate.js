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
				let team = await buscarEquipo(splitString.join(' '));
				if (team.length === 0) {
					message.reply("No reconozco el equipo");
				} else if (team.length > 1) {
					let str = 'Hay mas de un equipo con ese nombre. Opciones: ';
					let response = str.concat(team.join(', '));
					message.reply(response);
				} else {
					let data = await buscarProximoOponente(team);
					let isHome = data.teams.home.id === team ? true : false;
					message.reply(`Contra ${isHome ? data.teams.away.name : data.teams.home.name} el ${new Date(data.fixture.timestamp * 1000).toLocaleDateString('es-ES')} a las ${new Date(data.fixture.timestamp * 1000).toLocaleTimeString('es-ES')}`)
					.then(() => console.log(`Replied to message "${message.content}"`))
  					.catch(console.error);
				}
				break;	
		}
	}
}