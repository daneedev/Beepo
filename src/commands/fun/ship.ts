import { SlashCommandBuilder, EmbedBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("ship")
        .setDescription("Ship two users together")
        .addUserOption(option =>
            option.setName("user1")
                .setDescription("The first user to ship")
                .setRequired(true))
        .addUserOption(option =>
            option.setName("user2")
                .setDescription("The second user to ship")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const user1 = interaction.options.getUser("user1", true)
        const user2 = interaction.options.getUser("user2", true)

        const percentage = Math.floor(Math.random() * 101)

        const embed = new EmbedBuilder()
            .setTitle(`💘 ${user1.username} & ${user2.username}`)
            .setDescription(`${user1.username} and ${user2.username} are **${percentage}%** compatible!`)
            .setColor("Random")

        interaction.reply({ embeds: [embed] })
    }
}