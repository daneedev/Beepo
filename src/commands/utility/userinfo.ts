import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Fetch information about a user.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to fetch information about")
                .setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = interaction.guild?.members.cache.get(user.id)

        const userEmbed = new EmbedBuilder()
        .setTitle(`${user.username}'s info`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            { name: 'Username', value: user.username, inline: true },
            { name: 'ID', value: user.id, inline: true},
            { name: "Created At", value: user.createdAt.toDateString(), inline: true},
            { name: "Joined At", value: member?.joinedAt?.toDateString() || 'N/A', inline: true },
            { name: "Roles", value: member?.roles.cache.map(role => role.name).join(', ') || 'No roles', inline: true },
        )
        .setColor("#0099ff")
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        interaction.reply({ embeds: [userEmbed] })
    }
}