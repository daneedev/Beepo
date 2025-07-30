import { SlashCommandBuilder, EmbedBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js";
import Level from "../../models/level";
import Config from "../../models/config";

function getNeededXP(level: number) : number {
    return 5 * level * level + 50;
}

export default {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Show your/someones level")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User")
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user") || interaction.user

        const guildConfig = await Config.findOne({ where: { guildId: interaction.guildId }})

        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")

        if (!guildConfig?.levelSys) {
            errorEmbed.setTitle("Module is disabled")
                .setDescription("Module `levelsys` is disabled\nEnable it using `/configure`")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }

        let level = await Level.findOne({ where: {
            guildId: interaction.guildId,
            userId: user.id
        }})

        if (!level) {
            level = await Level.create({
                guildId: interaction.guildId,
                userId: user.id,
                currentLevel: 0,
                currentXp: 0
            })
        }

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s level`)
            .setDescription(`Level: **${level.currentLevel}**\nXP: **${level.currentXp}**/${getNeededXP(level.currentLevel + 1)} XP`)
            .setColor("Random")
        interaction.reply({ embeds: [embed]})
    }
}