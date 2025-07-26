import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageFlags, User} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the server.")
        .addStringOption(option =>
            option.setName("user_id")
                .setDescription("The ID of the user to unban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("The reason for the unban")
                .setRequired(false)),
        async execute(interaction: ChatInputCommandInteraction) {
            const userId = interaction.options.getString("user_id", true)
            const reason = interaction.options.getString("reason") || "No reason provided"

            const user = interaction.client.users.cache.get(userId) as User

            const errorEmbed = new EmbedBuilder()
                .setColor("#ff0000")

            try {
                await interaction.guild?.members.unban(user, reason)

                const successEmbed = new EmbedBuilder()
                    .setTitle(`User ${user.username} has been unbanned`)
                    .addFields(
                        { name: "Reason", value: reason, inline: true}
                    )
                    .setColor("#00ff00")
                interaction.reply({ embeds: [successEmbed]})
            } catch (error) {
                errorEmbed.setTitle("An error occured while unbanning user")
                return interaction.reply({embeds: [errorEmbed], flags: MessageFlags.Ephemeral})
            }
        }
}