import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, User, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the server.")
        .addUserOption(option => 
            option.setName("user")
                .setDescription("The user to kick")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("The reason for the kick")
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user") as User;
        const reason = interaction.options.getString("reason") || "No reason provided";
        const member = interaction.guild?.members.cache.get(user.id);

        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")
        if (!member) {
           errorEmbed.setTitle("User not found in this server.");
           return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
        if (!member.kickable) {
            errorEmbed.setTitle("I cannot kick this user. They might have a higher role or I lack permissions.");
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
        try {
            await member.kick(reason)
            const successEmbed = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle(`Successfully kicked ${user.username} from the server.`)
                .addFields(
                    { name: "User", value: user.username, inline: true },
                    { name: "User ID", value: user.id, inline: true },
                    { name: "Reason", value: reason, inline: true }
                )
                .setFooter({ text: `Kicked by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });
            return interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            errorEmbed.setTitle("An error occurred while trying to kick the user.");
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

    }
}