import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, User, MessageFlags, Invite, Embed } from "discord.js"
import ms, { StringValue } from "ms";
import TempBan from "../../models/tempban";

export default {
    data: new SlashCommandBuilder()
        .setName("tempban")
        .setDescription("Temporarily bans user from the server")
        .addUserOption(option => 
            option.setName("user")
                .setDescription("User you want to ban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("duration")
                .setDescription("Duration of the ban (e.g. 5m, 1h, 3d)")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for the ban")
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName("msg")
                .setDescription("The number of messages to delete")
                .addChoices(
                    { name: "Don't delete any", value: 0},
                    { name: "Previous hour", value: 3600 },
                    { name: "Previous 6 hours", value: 21600 },
                    { name: "Previous 12 hours", value: 43200 },
                    { name: "Previous 24 hours", value: 86400 },
                    { name: "Previous 3 days", value: 259200 },
                    { name: "Previous 7 days", value: 604800 }
                )
                .setRequired(false)),
        async execute(interaction: ChatInputCommandInteraction) {
            const user = interaction.options.getUser("user") as User;
            const duration = interaction.options.getString("duration", true)
            const reason = interaction.options.getString("reason") || "No reason provided"
            const msg = interaction.options.getInteger("msg") || 0
            const member = interaction.guild?.members .cache.get(user.id)
            const durationMs = ms(duration as StringValue)

            const errorEmbed = new EmbedBuilder()
                .setColor("#ff0000")
            if (!member) {
                errorEmbed.setTitle("User not found in this server.")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }
            if (!member.bannable) {
                errorEmbed.setTitle("I cannot ban this user. They might have a higher role or I lack permissions.")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }
            try {
                const dateUnban = Date.now() + durationMs
                const invite = await interaction.guild?.invites.create(interaction.channelId, { maxAge: durationMs / 1000 + 259200, maxUses: 1}) as Invite
                const userEmbed = new EmbedBuilder()
                    .setTitle(`You have been temporarily banned from ${interaction.guild?.name}`)
                    .addFields(
                        { name: "Reason", value: reason, inline: true },
                        { name: "Banned by", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "Banned until", value: `<t:${dateUnban}:R>`, inline: true}
                    )
                    .setDescription(`<t:${dateUnban}:R> you can rejoin back to the server [here](https://discord.gg/${invite.code})`)
                user.send({ embeds: [userEmbed]}).then(async (m) => {
                    TempBan.create({
                        guildId: interaction.guildId,
                        userId: user.id,
                        unbanTimestamp: dateUnban,
                    })
                    await member.ban({reason: reason, deleteMessageSeconds: msg})
                })
                const successEmbed = new EmbedBuilder()
                    .setTitle(`User ${user.username} has been temporarily banned!`)
                    .addFields(
                        { name: "User", value: user.username, inline: true },
                        { name: "User ID", value: user.id, inline: true },
                        { name: "Reason", value: reason, inline: true },
                        { name: "Messages deleted", value: msg == 0 ? "No messages deleted" : ms(msg * 1000, {long: true}), inline: true },
                        { name: "Ban duration", value:`<t:${dateUnban}:R>`, inline: true }
                    )
                    .setColor("#00ff00")
                    .setFooter({ text: `Banned by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                interaction.reply({ embeds: [successEmbed] })
    
            } catch (error) {
                errorEmbed.setTitle("An error occured while banning user")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }
            
        }
}