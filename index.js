//=======================//
// Mariote's Discord Bot //
//=======================//

// Imports and instances
import { Client, Intents } from 'discord.js';
import config from './config.js';
import fs from 'fs';

const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
discordClient.login(config.token);


//Event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const { default: event } = await import(`./events/${file}`);
	if (event.once) {
		discordClient.once(event.name, (...args) => event.execute(...args));
	} else {
		discordClient.on(event.name, (...args) => event.execute(...args));
	}
}