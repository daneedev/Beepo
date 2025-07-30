import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides information about available commands.')
        .addStringOption(option => 
            option.setName("category")
                .setDescription("Category of commands")
                .addChoices(
                    {name: "Fun", value: "fun"},
                    {name: "Moderation", value: "moderation"},
                    {name: "Utility", value: "utility"},
                    {name: "Levels", value: "levels"}
                )
                .setRequired(false)),
    async execute(interaction : ChatInputCommandInteraction) {
        const category = interaction.options.getString("category")
        switch (category) {
            case "fun":
                const fun = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Help - Fun")
                    .setDescription("/8ball - Ask your question and get your answer\n/cat - Returns random cat image\n/coinflip -  Flip a coin and see if you win or lose!\n/howgay - It measures percentage of user gay level\n/meme - Fetch a random meme from subreddit of your choice.\n/ship - Ship two users together")
                interaction.reply({ embeds: [fun], flags: MessageFlags.Ephemeral })
                break;
            case "moderation":
                const moderation = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Help - Moderation")
                    .setDescription("/ban - Ban a user from the server.\n/clear - Bulk delete number of messages\n/kick - Kick a user from the server.\n/lock - Lock a channel to prevent members from sending messages\n/tempban - Temporarily bans user from the server\n/unban - Unban a user from the server.\n/unlock - Unlock a locked channel\n/warn - Add warning to user")
                interaction.reply({ embeds: [moderation], flags: MessageFlags.Ephemeral })
                break;
            case "utility":
                const utility = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle("Help - Utility")
                    .setDescription("/configure - Enable/Disable feature of the bot\n/help - Provides information about available commands.\n/info - Show information about the bot\n/ping - Replies with Pong! (and latency)\n/serverinfo - Fetch information about the server.\n/userinfo - Fetch information about a user.")
                interaction.reply({ embeds: [utility], flags: MessageFlags.Ephemeral })
                break;
            case "levels":
                const levels = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Help - Levels")
                    .setDescription("/rank - Show your/someones level\n/level - Manage user's level\n/leaderboard - Shows top 10 users in the guild")
                interaction.reply({ embeds: [levels], flags: MessageFlags.Ephemeral })
            default:
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Available Commands')
                    .addFields(
                        { name: "🎈 Fun", value: "/help fun", inline: true},
                        { name: "⚒️ Moderation", value: "/help moderation", inline: true },
                        { name: "🔷 Utility", value: "/help utility", inline: true },
                        { name: "⭐ Levels", value: "/help levels", inline: true}
                    )

                    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
                break;
        }
    }
};