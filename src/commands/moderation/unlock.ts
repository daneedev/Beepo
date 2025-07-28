import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock a locked channel"),
    permission: "ManageChannels",
    async execute(interaction: ChatInputCommandInteraction) {
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

            if (permissions && permissions.has(PermissionFlagsBits.SendMessages)) {
                errorEmbed.setTitle("This channel is already unlocked!")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }

            await (channel as TextChannel).permissionOverwrites.edit(everyoneRole, {
                SendMessages: true
            })

            const successEmbed = new EmbedBuilder()
                .setTitle("🔓 Channel unlocked")
                .setDescription(`Channel has been successfully unlocked by <@${interaction.user.id}>`)
                .setColor("#00ff00")

            await interaction.reply({ embeds: [successEmbed]})
        } catch (error) {
            errorEmbed.setTitle("An error occurred while unlocking the channel!")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }
    }
}