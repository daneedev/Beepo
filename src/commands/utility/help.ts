import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides information about available commands.'),
    async execute(interaction : CommandInteraction) {
        const commands = interaction.client.commands.map(command => `/${command.data.name}: ${command.data.description}`).join('\n'); // TODO: Add more information about commands, add categories if needed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setDescription(commands || 'No commands available.');

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
};