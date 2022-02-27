/* eslint-disable no-console */
// Imports
// eslint-disable-next-line import/extensions
import cuandoJuega from '../api-football/cuandojuega.js';

// Constants
const MESSAGE_COMMAND_SUFFIX = '!';

export default {
  name: 'messageCreate',
  async execute(message) {
    if (!message.content.startsWith(MESSAGE_COMMAND_SUFFIX)) return;
    const args = message.content
      .substring(1)
      .replace(/\s+/g, ' ')
      .trim()
      .split(' '); // removes suffix and repeated whitespaces, splits in an array of strings
    let reply;

    switch (args[0]) {
      case 'cuandojuega':
        reply = await cuandoJuega(args);
        message
          .reply(reply)
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error);
        break;

      case 'precio':
        reply = await cuandoJuega(args);
        message
          .reply(reply)
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error);
        // Powered by CoinGecko
        break;

      default:
        break;
    }
  },
};
