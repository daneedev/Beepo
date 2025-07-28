import { ChatInputCommandInteraction, Events, MessageFlags, EmbedBuilder, PermissionsBitField } from "discord.js"
import logger from "../handlers/logger";

export default {
    name: Events.InteractionCreate,
    async execute(interaction : ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`)
            return;
        }
        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000");
        
        if (!(interaction.member?.permissions as Readonly<PermissionsBitField>).has(command.permission)) {
            errorEmbed.setTitle("You don't have permissions to execute this command!")
            errorEmbed.setDescription(`You need to have **${command.permission}** permission`)
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }

        if (!interaction.guild?.members.me?.permissions.has(command.permission)) {
            errorEmbed.setTitle("I don't have permissions to complete this command!")
            errorEmbed.setDescription(`I need to have **${command.permission}** permission`)
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }

        try {
            await command.execute(interaction);
        } catch (error : string | any) {
            logger.error(error)
            if (interaction.replied || interaction.deferred ) {
                await interaction.followUp({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral })
            } else {
                await interaction.reply({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral })
            }
        }
    }
}