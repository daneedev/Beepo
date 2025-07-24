import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Fetch information about the server."),
    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        if (!guild) {
            return interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
        }
        try {
        const serverEmbed = new EmbedBuilder()
            .setTitle(`${guild.name} Server Info`)
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Created At', value: guild.createdAt.toDateString(), inline: true },
                { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Roles', value: guild.roles.cache.map(role => `<@&${role.id}>`).join(', ') || 'No roles', inline: true },
                { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true }
            )
            .setColor("#0099ff")
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        if (guild.iconURL()) {
            serverEmbed.setThumbnail(guild.iconURL());
        }
        interaction.reply({ embeds: [serverEmbed] });
        } catch (error) {
            console.error("Error fetching server info:", error);
            interaction.reply({ content: "There was an error fetching the server information.", ephemeral: true });
        }
    }
}