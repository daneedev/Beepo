import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import Config from "../../models/config"


export default {
    data: new SlashCommandBuilder()
        .setName("configure")
        .setDescription("Enable/Disable feature of the bot")
        .addStringOption(option =>
            option.setName("feature")
                .setDescription("Feature name")
                .addChoices(
                    {name: "TempBan system", value: "tempban"},
                    {name: "Warn system", value: "warnsys"},
                    {name: "Level system", value: "levelsys"}
                )
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("value")
                .setDescription("Enable/Disable")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const feature = interaction.options.getString("feature", true)
        const value = interaction.options.getBoolean("value", true)

        let guildConfig = await Config.findOne({ where: { guildId: interaction.guildId }})

        if (!guildConfig) {
            guildConfig = await Config.create({
                guildId: interaction.guildId,
                tempBan: false,
                warnSys: false,
                levelSys: false
            })
        }

        switch (feature) {
            case "tempban":
                guildConfig.tempBan = value;
                break;
            case "warnsys":
                guildConfig.warnSys = value;
                break;
            case "levelsys":
                guildConfig.levelSys = value;
                break;
        }

        guildConfig.save()

        const successEmbed = new EmbedBuilder()
            .setTitle("Configuration changed")
            .setDescription(`Module **${feature}** has been **${value === true ? "enabled" : "disabled"}**.`)
            .setColor("Random")

        interaction.reply({embeds: [successEmbed]})

    }
}