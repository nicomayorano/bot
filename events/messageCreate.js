/* eslint-disable no-console */
/* eslint-disable import/extensions */

// Imports
import cuandoJuega from '../api-football/cuandojuega.js';
import precio from '../crypto/precio.js';

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
    let channel;

    switch (args[0]) {
      case 'juega':
        reply = await cuandoJuega(args);
        channel = message.channel;
        channel.send({ embeds: [reply] });
        break;

      case 'precio':
        reply = await precio(args);
        channel = message.channel;
        channel.send({ embeds: [reply] });
        break;

      default:
        break;
    }
  },
};
