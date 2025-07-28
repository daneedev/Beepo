import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock a channel to prevent members from sending messages")
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for locking the channel")
                .setRequired(false)),
    permission: "ManageChannels",
    async execute(interaction: ChatInputCommandInteraction) {
        const reason = interaction.options.getString("reason") || "No reason provided"
        const channel = interaction.channel

        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")
        if (!channel || !channel.isTextBased() || channel.isDMBased() ) {
            errorEmbed.setTitle("This command can only be used in text channels!")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }

        if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) {
            errorEmbed.setTitle("I don't have permission to manage channels!")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }

        try {
            const everyoneRole = interaction.guild.roles.everyone
            
            const permissions = channel.permissionsFor(everyoneRole)
            if (permissions && !permissions.has(PermissionFlagsBits.SendMessages)) {
                errorEmbed.setTitle("This channel is already locked!")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }

            await (channel as TextChannel).permissionOverwrites.edit(everyoneRole, {
                SendMessages: false
            })

            const successEmbed = new EmbedBuilder()
                .setTitle("🔒 Channel locked")
                .addFields(
                    { name: "Channel", value: `<#${channel.id}>`, inline: true},
                    { name: "Locked by", value: `<@${interaction.user.id}>`, inline: true },
                    { name: "Reason", value: reason, inline: true}
                )
                .setColor("#ff9900")

            await interaction.reply({ embeds: [successEmbed] })
        } catch (error) {
            errorEmbed.setTitle("An error occurred while locking the channel!")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }
    }
}