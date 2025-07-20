import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import wait from 'node:timers/promises';


export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong! (and latency)'),
    async execute(interaction : CommandInteraction) {
        const pingingEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Pinging...')
            .setDescription('Calculating latency...');
        const sent = await interaction.reply({ embeds: [pingingEmbed], withResponse: true });
        await wait.setTimeout(1000); // Wait for 1 second to simulate processing time
        const pingedEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription(`Websocket latency: ${interaction.client.ws.ping}ms\nAPI latency: ${sent.resource?.message?.createdTimestamp !== undefined ? sent.resource.message.createdTimestamp - interaction.createdTimestamp : 'N/A'}ms`);
        await interaction.editReply({ embeds: [pingedEmbed] });
    }
};