import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Embed } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Show information about the bot"),
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Beepo Info")
            .addFields(
                { name: "Version", value: "beta", inline: true },
                { name: "Developer", value: "<@525704336869687316>", inline: true },
                { name: "Support Server", value: "[Join here](https://discord.gg/bbdBxPsuzK)", inline: true },
                { name: "GitHub", value: "[View on GitHub](https://github.com/daneedev/Beepo)", inline: true },
                { name: "Invite", value: "[Invite me to your server](https://discord.com/api/oauth2/authorize?client_id=1396203993281073213&permissions=8&scope=bot%20applications.commands)", inline: true }
            )
            .setColor('#0099ff')
            interaction.reply({ embeds: [embed] });
    }
}