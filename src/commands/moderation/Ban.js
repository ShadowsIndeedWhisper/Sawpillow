const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const storedData = require("../../../storedData.json")

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason =
      interaction.options.get('reason')?.value || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't ban that user because they're the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't ban that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "You can't ban that user because they have the same/higher role than Firework."
      );
      return;
    }

    // Ban the targetUser
    try {
      const banEmbed = new EmbedBuilder()
      .setColor('#77B255') // You can set the color based on your preference
      .setDescription(`✅: ${targetUser} has been banned.`)

      await interaction.editReply({ embeds: [banEmbed] });

      await targetUser.ban({ reason });
     

    // Edit the interaction reply with the embed
  
    } catch (error) {
      const banEmbed = new EmbedBuilder()
      .setColor('#F04947') // You can set the color based on your preference
      .setDescription(`:red_square:: Ban error: '${error}'.`)

      await interaction.editReply({ embeds: [banEmbed] });
    }
  },

  name: 'ban',
  description: 'Bans a member from this server.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};