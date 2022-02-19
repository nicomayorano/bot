// Imports
let cuandoJuega  = require('./api-football/cuandojuega');

// Constants
const MESSAGE_COMMAND_SUFFIX = '!';

module.exports = {
	name: 'messageCreate',
	execute(message) {
        if (!message.content.startsWith(MESSAGE_COMMAND_SUFFIX)) return;
		let splitString = message.content.substring(1).replace(/\s+/g, ' ').trim().split(' '); //removes suffix and repeated whitespaces, splits in an array of strings

        switch(splitString[0]) {
			case 'cuandojuega':
				splitString.shift();
				let equipo = splitString.join(' ');
				console.log(cuandoJuega.buscarEquipo(equipo));
				



				;
				break
		}
	}
}