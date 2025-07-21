import { SlashCommandBuilder, CommandInteraction, EmbedBuilder} from 'discord.js';
import wait from 'node:timers/promises';

export default {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flip a coin and see if you win or lose!"),
    async execute(interaction: CommandInteraction) {
        const outcomes = ["Heads", "Tails"];
        const result = outcomes[Math.floor(Math.random() * outcomes.length)]
        const embed = new EmbedBuilder()
        .setTitle("Coin Flip")
        .setColor('#0099ff')
        .setDescription(`Coin is flying...`)
        await interaction.reply({ embeds: [embed] });
        await wait.setTimeout(1500);
        embed.setDescription(`Coin landed on: ${result}`);
        await interaction.editReply({ embeds: [embed] });
    }
}