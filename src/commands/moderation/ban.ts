import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, User, Invite } from "discord.js";
import ms from "ms";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the server.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to ban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("The reason for the ban")
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName("msg")
                .setDescription("The number of messages to delete")
                .addChoices(
                    { name: "Don't delete any", value: 0 },
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
            const reason = interaction.options.getString("reason") || "No reason provided";
            const msg = interaction.options.getInteger("msg") || 0;
            const member = interaction.guild?.members.cache.get(user.id);

            const errorEmbed = new EmbedBuilder()
                .setColor("#ff0000");
            if (!member) {
                errorEmbed.setTitle("User not found in this server.");
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
            }
            if (!member.bannable) {
                errorEmbed.setTitle("I cannot ban this user. They might have a higher role or I lack permissions. ")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }
            try {
                const userEmbed = new EmbedBuilder()
                    .setTitle(`You have been permanently banned from ${interaction.guild?.name}`)
                    .addFields(
                        { name: "Reason", value: reason, inline: true},
                        { name: "Banned by", value: `<@${interaction.user.id}>`, inline: true}
                    )
                    user.send({ embeds: [userEmbed]}).then(async (m) => {
                        await member.ban({ reason: reason, deleteMessageSeconds: msg})
                    })
                const successEmbed = new EmbedBuilder()
                    .setTitle(`User ${user.username} has been successfully banned!`)
                    .addFields(
                        { name: "User", value: user.username, inline: true},
                        { name: "User ID", value: user.id, inline: true},
                        { name: "Reason", value: reason, inline: true},
                        { name: "Messages deleted", value: msg === 0 ? "No messages deleted" : ms(msg * 1000, {long: true}), inline: true}
                    )
                    .setColor("#00ff00")
                    .setFooter({ text: `Bannned by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                    interaction.reply({ embeds: [successEmbed] })

            } catch (error) {
                errorEmbed.setTitle("An error occured while banning user")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }

        }
        
}