// Command template

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows bot usage'),
}

// Los comandos deben ser exactos, salvo espacios por error al princio del mismo. Ejemplo: '   !ping' es un comando valido. '!ping   ' es un comando invalido.