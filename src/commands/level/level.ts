import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import Config from "../../models/config"
import Level from "../../models/level"

export default {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("Manage user's level")
        .addSubcommand(option =>
            option.setName("clear")
                .setDescription("Clear user's level")
                .addUserOption(option => 
                    option.setName("user")
                        .setDescription("User")
                        .setRequired(true))
        )
        .addSubcommand(option =>
            option.setName("set")
                .setDescription("Set user's level to specified value")
                .addUserOption(option =>
                    option.setName("user")
                        .setDescription("User")
                        .setRequired(true)       
                )
                .addIntegerOption(option => 
                    option.setName("level")
                        .setDescription("Level number")
                        .setRequired(true))
        )
        .addSubcommand(option =>
            option.setName("add")
                .setDescription("Add level to user's level")
                .addUserOption(option => 
                    option.setName("user")
                        .setDescription("User")
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("level")
                        .setDescription("Level number")
                        .setRequired(true))
        ),
    permission: "ManageMessages",
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand(true)

        const errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")

        const guildConfig = await Config.findOne({ where: { guildId: interaction.guildId }})

        if (!guildConfig?.levelSys) {
            errorEmbed.setTitle("Module is disabled")
                .setDescription("Module `levelsys` is disabled\nEnable it using `/configure`")
            return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }

        const user = interaction.options.getUser("user", true)
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

        const successEmbed = new EmbedBuilder()
            .setColor("#00ff00")
        switch (subcommand) {
            case "clear":
                level.currentLevel = 0;
                level.currentXp = 0;
                level.save()

                    successEmbed.setTitle("Level cleared")
                    .setDescription(`<@${user.id}>'s level has been cleared to 0.`)
                interaction.reply({ embeds: [successEmbed]})
                break;
            case "set":
                let targetLevel = interaction.options.getInteger("level", true)

                level.currentLevel = targetLevel
                level.currentXp = 0;
                level.save()

                successEmbed.setTitle("Level changed")
                    .setDescription(`<@${user.id}>'s level has been set to **${targetLevel}**.`)
                interaction.reply({ embeds: [successEmbed]})
                break;
            case "add":
                targetLevel = interaction.options.getInteger("level", true)
                
                level.currentLevel += targetLevel;
                level.currentXp = 0;
                level.save()

                successEmbed.setTitle("Level added")
                    .setDescription(`**${targetLevel} levels** has been added to <@${user.id}>`)
                interaction.reply({ embeds: [successEmbed]})
                break;
        }
    }
}