module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		
		if (!interaction.isCommand()) return;
		const { commandName } = interaction;

		switch(commandName) {
			case 'help':
				interaction.reply('En construccion');
				break;
		}
	}
}