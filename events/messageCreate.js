// Imports
import { cuandoJuega } from '../api-football/cuandojuega.js';

// Constants
const MESSAGE_COMMAND_SUFFIX = '!';

export default {
	name: 'messageCreate',
	async execute(message) {
        if (!message.content.startsWith(MESSAGE_COMMAND_SUFFIX)) return;
		let args = message.content.substring(1).replace(/\s+/g, ' ').trim().split(' '); //removes suffix and repeated whitespaces, splits in an array of strings

        switch(args[0]) {
			case 'cuandojuega':
				let reply = await cuandoJuega(args);
				message.reply(reply)
				.then(() => console.log(`Replied to message "${message.content}"`))
  				.catch(console.error);
				break;	
		}
	}
}