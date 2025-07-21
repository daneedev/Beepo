import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Fetch a random meme from subreddit of your choice.")
        .addStringOption(option => 
            option.setName("subreddit")
                .setDescription("Chooose a meme subreddit")
                .setRequired(true)
                .addChoices(
                    { name: "memes", value: "memes"},
                    { name: "dankmemes", value: "dankmemes"},
                    { name: "funny", value: "funny"},
                    { name: "wholesomememes", value: "wholesomememes" },
                    { name: "programmerhumor", value: "programmerhumor" }
                )
        ),
        async execute(interaction: ChatInputCommandInteraction) {
            const subreddit = interaction.options.getString("subreddit");

            try {
                const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=50`);
                if (!response.ok) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Error fetching meme')
                        .setDescription(`Failed to fetch meme from r/${subreddit}. Please try again later.`);
                    return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
                }
                const data = await response.json();
                const post = data.data.children[Math.floor(Math.random() * 50)].data;

                const memeEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(post.title.length > 256 ? post.title.slice(0, 253) + '...' : post.title)
                .setImage(post.url)
                .setURL(`https://reddit.com${post.permalink}`)
                .setFooter({ text: `👍 ${post.ups} | 💬 ${post.num_comments}` });
                return await interaction.reply({ embeds: [memeEmbed] });

            } catch (error) {
                console.error('Error fetching meme:', error);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Error fetching meme')
                    .setDescription(`An unexpected error occurred. Please try again later.`);
                return await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
            }
        }
}