import { SlashCommandBuilder, EmbedBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js"
import Warn from "../../models/warn"

export default {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Display all user's warnings")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User you want to list it's warnings")
                .setRequired(true)),
    permission: "KickMembers",
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true)

        const warnings = await Warn.findAll({ where: {
            guildId: interaction.guildId,
            userId: user.id
        }})

        let warningsMsg = ""
        let i = 0;
        for (const warning of warnings) {
            i++
            warningsMsg += `${i}. ${warning.createdAt.toDateString()} - **${warning.reason}** - Added by <@${warning.addedBy}> \n`
        }

        const successEmbed = new EmbedBuilder()
            .setTitle(`⚠️ ${user.username}'s warnings`)
            .setColor("Random")
            .setDescription(warningsMsg)
        
            interaction.reply({ embeds: [successEmbed]})
    }
}