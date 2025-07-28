import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, TextBasedChannel, GuildTextBasedChannel, TextChannel, AnySelectMenuInteraction } from "discord.js"

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Bulk delete number of messages")
        .addIntegerOption(option => 
            option.setName("number")
                .setDescription("Number of messages to delete")
                .setRequired(true)),
    permission: "ManageMessages",
    async execute(interaction: ChatInputCommandInteraction) {
        const number = interaction.options.getInteger("number", true)
        
        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000");
        
        try {
            const channel = interaction.channel
            if (!channel || !channel.isTextBased() || channel.isDMBased() ) {
                errorEmbed.setTitle("This command can only be used in text channels!")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }

            const messages = await channel.messages.fetch({ limit: number })

            const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000)
            const validMessages = messages.filter(msg => msg.createdTimestamp > twoWeeksAgo)

            if (validMessages.size === 0) {
                errorEmbed.setTitle("No messages found to delete!")
                    .setDescription("Messages older than 14 days cannot be bulk deleted.")
                return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
            }

            const deletedMessages = await (channel as any).bulkDelete(validMessages, true)

            const successEmbed = new EmbedBuilder()
                .setTitle("Messages cleared successfully")
                .setDescription(`Successfully deleted **${deletedMessages.size.toString()}** *(${number.toString()})* messages!`)
                .setColor("#00ff00")
                
            await interaction.reply({ embeds: [successEmbed]})

            setTimeout(async () => {
                try {
                    await interaction.deleteReply()
                } catch (error) {

                }
            }, 5000)
            
        } catch (error) {
            errorEmbed.setTitle("An error occurred while clearing messages!")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral})
        }
    }
}