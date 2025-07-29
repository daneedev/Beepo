import { SlashCommandBuilder, EmbedBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js"
import Warn from "../../models/warn"

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Add warning to user")
        .addSubcommand(option =>
            option.setName("add")
                .setDescription("Add warning to user")
                .addUserOption(option => 
                    option.setName("user")
                    .setDescription("User that you want to warn")
                    .setRequired(true))
                .addStringOption(option => 
                    option.setName("reason")
                        .setDescription("Reason for warning")
                        .setRequired(false))
        )
        .addSubcommand(option =>
            option.setName("list")
                .setDescription("Display all user's warnings")
                .addUserOption(option =>
                    option.setName("user")
                        .setDescription("User you want to list it's warnings")
                        .setRequired(true))
        ),
    permission: "KickMembers",
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand(true)

       if (subcommand === "add") {
            const user = interaction.options.getUser("user", true)
            const reason = interaction.options.getString("reason") || "No reason provided"
            const member = interaction.guild?.members.cache.get(user.id)

            const errorEmbed = new EmbedBuilder()
                .setColor("#ff0000")
            if (!member) {
                errorEmbed.setTitle("Member not found!")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral})
            }
            if (!member.kickable) {
                errorEmbed.setTitle("I cannot warn this user. They might have a higher role or I lack permissions.");
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }

            Warn.create({
                guildId: interaction.guildId,
                userId: user.id,
                reason: reason,
                addedBy: interaction.user.id
            })

            const warnings = await Warn.count({where: {
                guildId: interaction.guildId,
                userId: user.id
            }})

            const successEmbed = new EmbedBuilder()
                .setTitle("⚠️ User has been warned")
                .addFields(
                    { name: "User", value: `<@${user.id}>`, inline: true},
                    { name: "Reason", value: reason, inline: true},
                    { name: "Warned by", value: `<@${interaction.user.id}>`, inline: true}
                )
                .setDescription(`This is ${user.username}'s ${warnings}. warning`)
                .setColor("Yellow")

            interaction.reply({ embeds: [successEmbed] })
                
        } else if (subcommand === "list") {
            const user = interaction.options.getUser("user", true)

            const warnings = await Warn.findAll({ where: {
                guildId: interaction.guildId,
                userId: user.id
            }})

            let warningsMsg = ""
            let i = 0;
            for (const warning of warnings) {
                i++
                warningsMsg += `*(ID: ${warning.id})* ${warning.createdAt.toDateString()} - **${warning.reason}** - Added by <@${warning.addedBy}> \n`
            }
            if (warningsMsg.length == 0) {
                warningsMsg = `User has no warnings.`
            }

            const successEmbed = new EmbedBuilder()
                .setTitle(`⚠️ ${user.username}'s warnings`)
                .setColor("Random")
                .setDescription(warningsMsg)
            
                interaction.reply({ embeds: [successEmbed]})
        }
        
    }
}