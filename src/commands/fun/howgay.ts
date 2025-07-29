import { SlashCommandBuilder, EmbedBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("howgay")
        .setDescription("It measures percentage of user gay level")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User you want to measure")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true)
        
        const percentage = Math.floor(Math.random() * 101)

        const embed = new EmbedBuilder()
            .setTitle(`🏳️‍🌈 How gay is ${user.username}?`)
            .setDescription(`<@${user.id}> is **${percentage}%** gay`)
            .setColor("Random")

        interaction.reply({ embeds: [embed]})
    }
}