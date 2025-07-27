import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Returns random cat image")
        .addStringOption(option =>
            option.setName("tags")
                .setDescription("Tags for images (e.g. cute,orange)")
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const tags = interaction.options.getString("tags")

        if (tags) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("😺 Here's cat")
            .setImage(`https://cataas.com/cat/${tags}`)
            .setDescription(`Tags: **${tags}**\nUsing [CATAAS](https://cataas.com/)`)
            interaction.reply({ embeds: [embed]})
        } else {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("😺 Here's cat")
            .setImage("https://cataas.com/cat")
            .setDescription("Using [CATAAS](https://cataas.com/)")
            interaction.reply({ embeds: [embed]})
        }
    }
}