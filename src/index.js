// ====================== //
// Mariote's Discord Bot  //
// ====================== //

// Imports and instances
import { Client, Intents } from 'discord.js';
import fs from 'fs';
import config from './config';

const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
discordClient.login(config.token);

// Event handling
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (let i = 0; i < eventFiles.length; i += 1) {
  const { default: event } = import(`./events/${eventFiles[i]}`); // ante era async, ver si deja de funcionar
  if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args));
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args));
  }
}
