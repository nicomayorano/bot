// ====================== //
// Mariote's Discord Bot  //
// ====================== //

// Imports and instances
import { Client, Intents } from 'discord.js';
import fs from 'fs';
// eslint-disable-next-line import/extensions
import config from './config.js';

const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
discordClient.login(config.token);

// Event handling
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (let i = 0; i < eventFiles.length; i += 1) {
  // eslint-disable-next-line no-await-in-loop
  const { default: event } = await import(`../events/${eventFiles[i]}`);
  if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args));
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args));
  }
}
