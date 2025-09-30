import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
  NewsChannel,
  MessageFlags,
} from "discord.js";
import ms, { StringValue } from "ms";

export default {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Manages giveaways")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start a giveaway")
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("Prize of the giveaway")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration of the giveaway (e. g. 1d, 1h, 1m)")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Number of winners")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to host the giveaway in")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("end")
        .setDescription("End a giveaway")
        .addStringOption((option) =>
          option
            .setName("giveawayid")
            .setDescription("The ID of the giveaway to end")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reroll")
        .setDescription("Reroll a giveaway")
        .addStringOption((option) =>
          option
            .setName("giveawayid")
            .setDescription("The ID of the giveaway to reroll")
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const errEmbed = new EmbedBuilder().setColor("#ff0000");
    const successEmbed = new EmbedBuilder().setColor("#00ff00");

    if (!interaction.memberPermissions?.has("ManageMessages")) {
      errEmbed.setTitle(
        "You need the Manage Messages permission to use this command"
      );
      return interaction.reply({
        embeds: [errEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
    switch (subcommand) {
      case "start":
        const prize = interaction.options.getString("prize", true);
        const duration = interaction.options.getString("duration", true);
        const winners = interaction.options.getInteger("winners", true);
        const channel =
          (interaction.options.getChannel("channel") as
            | TextChannel
            | NewsChannel) || interaction.channel;
        if (!channel || !channel.isTextBased()) {
          errEmbed.setTitle("You need to use a text channel for giveaways");
          return interaction.reply({
            embeds: [errEmbed],
            flags: MessageFlags.Ephemeral,
          });
        }
        interaction.client.giveawaysManager
          .start(channel, {
            prize: prize,
            duration: ms(duration as StringValue),
            winnerCount: winners,
            hostedBy: interaction.user,
          })
          .then(() => {
            successEmbed.setTitle(`Giveaway started in <#${channel.id}>`);
            interaction.reply({
              embeds: [successEmbed],
              flags: MessageFlags.Ephemeral,
            });
          });

        break;
      case "reroll":
        const giveawayId = interaction.options.getString("giveawayid", true);
        interaction.client.giveawaysManager.reroll(giveawayId).then(() => {
          successEmbed.setTitle("Giveaway rerolled!");
          interaction.reply({
            embeds: [successEmbed],
            flags: MessageFlags.Ephemeral,
          });
        });
        break;
      case "end":
        const giveawayId2 = interaction.options.getString("giveawayid", true);
        interaction.client.giveawaysManager.end(giveawayId2).then(() => {
          successEmbed.setTitle("Giveaway ended!");
          interaction.reply({
            embeds: [successEmbed],
            flags: MessageFlags.Ephemeral,
          });
        });
        break;
    }
  },
};
