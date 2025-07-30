import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import Config from "../../models/config"
import Level from "../../models/level"

export default {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays top 10 users in level system"),
    async execute(interaction: ChatInputCommandInteraction) {
        const guildConfig = await Config.findOne({ where: {
            guildId: interaction.guildId
        }})

        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")

        if (!guildConfig?.levelSys) {
            errorEmbed.setTitle("Module is disabled")
                .setDescription("Module `levelsys` is disabled\nEnable it using `/configure`")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }

        const levels = await Level.findAll({ where: {
            guildId: interaction.guildId
        }})

        levels.sort((a, b) => b.currentLevel - a.currentLevel)

        let levelsDescription = ""

        const levelsEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Levels leaderboard")

        let i = 1;
        for (const level of levels) {
            levelsDescription += `${i}. <@${level.userId}> - Level **${level.currentLevel}**\n`
            i++
        }

        levelsEmbed.setDescription(levelsDescription)

        interaction.reply({ embeds: [levelsEmbed] })
    }
}