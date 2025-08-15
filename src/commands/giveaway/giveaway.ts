import {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import ms, { StringValue } from "ms";

export default {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Manage giveaways")
    .addSubcommand((option) =>
      option
        .setName("start")
        .setDescription("Start a giveaway")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel for the giveaway")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option.setName("prize").setDescription("Prize").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration of the giveaway (5h, 1d)")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Number of winners")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("reroll")
        .setDescription("Reroll an existing giveaway")
        .addStringOption((option) =>
          option
            .setName("messageid")
            .setDescription("ID of giveaway message")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("end")
        .setDescription("End an existing giveaway")
        .addStringOption((option) =>
          option
            .setName("messageid")
            .setDescription("ID of giveaway message")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand(true);

    const errorEmbed = new EmbedBuilder().setColor("#ff0000");
    const successEmbed = new EmbedBuilder().setColor("#00ff00");

    try {
      switch (subcommand) {
        case "start":
          const channel =
            interaction.options.getChannel("channel") || interaction.channel;
          const prize = interaction.options.getString("prize", true);
          const duration = interaction.options.getString(
            "duration",
            true
          ) as StringValue;
          const winners = interaction.options.getInteger("winners", true);

          const parsedDuration = ms(duration);
          if (!parsedDuration) {
            errorEmbed
              .setTitle("Invalid duration format")
              .setDescription("Please use format like '5h', '1d', '30m'.");
            await interaction.reply({
              embeds: [errorEmbed],
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          await interaction.client.manager.start({
            channelId: channel!.id,
            prize,
            duration: parsedDuration,
            winnerCount: winners,
          });

          successEmbed.setTitle("Giveaway started successfully!");

          await interaction.reply({
            embeds: [successEmbed],
            flags: MessageFlags.Ephemeral,
          });
          break;
        case "reroll":
          const messageId = interaction.options.getString("messageId", true);
          await interaction.client.manager.reroll(messageId);

          successEmbed.setTitle("Giveaway rerolled successfully!");
          await interaction.reply({
            embeds: [successEmbed],
            flags: MessageFlags.Ephemeral,
          });
          break;
        case "end":
          const msgId = interaction.options.getString("messageId", true);
          await interaction.client.manager.end(msgId, false);

          successEmbed.setTitle("Giveaway ended successfully!");
          await interaction.reply({
            embeds: [successEmbed],
            flags: MessageFlags.Ephemeral,
          });
          break;
      }
    } catch (error) {
      await interaction.reply({
        content: "An error occurred while executing the command.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
