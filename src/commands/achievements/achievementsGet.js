const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require('discord.js');
  
  const storedData = require("../../../storedData.json")
  const clans = require("../../Data/clans.json")
  const achievementProfiles = require("../../Data/achievementProfiles.json")
  
const achievementCreateProfile = require('./utils/createAchievementProfile')
const achievementGive = require('../achievements/utils/achievementGive')
const readJSON = require('../../utils/readJSON')
const updateProfile = require('./utils/updateProfile')

  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => {
        if (client.battleOngoing == true)
        {
         await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
         return;
        }
        const targetUser = interaction.options.get('target-user').user;

        achievementCreateProfile(targetUser.username)

        achievementGive(client, interaction.user, interaction, "Taking Inventory", "Normal")

        const mainEmbed = new EmbedBuilder()
        .setTitle(`${targetUser.username}'s Achievements ✨`)
        .setColor('#FFBB56');
    
    const userAchievements = achievementProfiles[targetUser.username];
    
    if (userAchievements && (userAchievements.Normal || userAchievements.Secret)) {
        const normalAchievements = userAchievements.Achievements
            ? Object.entries(userAchievements.Achievements)
                .map(([name, achievement]) => `🏆 **${name}:** ${achievement.Description}`)
                .join('\n')
            : '';

        const secretAchievements = userAchievements.Secret
            ? Object.entries(userAchievements.Secret)
                .map(([name, achievement]) => `✨ **${name}:** ${achievement.Description}`)
                .join('\n')
            : '';
    
        if (normalAchievements) {
            mainEmbed.addFields({name: 'NORMAL', value: normalAchievements});
        }
    
        if (secretAchievements) {
            mainEmbed.addFields({name: 'SECRET',value: secretAchievements});
        }
    
        if (!normalAchievements && !secretAchievements) {
            mainEmbed.setDescription('No Achievements Available');
        }
    } else {
        mainEmbed.setDescription('No Data Available');
    }

        await interaction.reply({ embeds: [mainEmbed] });
    },
  
    name: 'achievementsget',
    description: 'Gets the users achievements',
    options: [
      {
        name: 'target-user',
        description: 'The user you view.',
        type: ApplicationCommandOptionType.User,
        required: true,
      }
    ],
  };