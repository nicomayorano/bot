module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		
		if (!interaction.isCommand()) return;

		const { commandName } = interaction;
		if (commandName === 'ping') {
			interaction.reply('Pong!');
		}
	}
};