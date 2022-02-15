const MESSAGE_COMMAND_SUFFIX = '!';

function parseMessage(string) {
    let str = string.trim();
    let iterator = str[Symbol.iterator]();
    let theChar = iterator.next();
    let command = '';

    while (!theChar.done && theChar.value !== ' ') {
        command += theChar.value;
        theChar = iterator.next();
    }
    return command;
}

module.exports = {
	name: 'messageCreate',
	execute(message) {
        let parsedMessage = parseMessage(message.content);
        if (!parsedMessage.startsWith(MESSAGE_COMMAND_SUFFIX)) return;

        switch(parsedMessage.substring(1)) {
			case 'ping':
				message.reply('Pong!');
				break;
		}
	}
}