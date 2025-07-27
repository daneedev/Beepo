import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask your question and get your answer")
        .addStringOption(option => 
            option.setName("question")
                .setDescription("Your question")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const question = interaction.options.getString("question", true)

        const responses = [
            "Yes",
            "No",
            "Maybe",
            "Try it later",
            "Surely!",
            "Definitely no",
            "I don't know, ask me again",
            "100% yes",
            "100% no"
        ]

        const answer = responses[Math.floor(Math.random() * responses.length)]

        const embed = new EmbedBuilder()
            .setTitle("🎱 8ball")
            .setDescription(`Your question: **${question}**\nAnswer: **${answer}**`)
            .setColor("Random")
        interaction.reply({ embeds: [embed]})
    }
}