const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const storedData = require("../../../storedData.json");
const achievementGive = require('../achievements/utils/achievementGive')
const gameData = require('../../Data/gameData.json')


const emojiMap = {
  Normal: '<:sawpillow:1190660027246182461>',
  Shiny: '<:sawpillowshiny:1190708696586649651>',
  Thicc: '<:sawpillowthick:1190710789233987594>',
  Error: '<:sawpillowerror:1190717716831670272>',
  Alien: '<:sawpillowAlien:1190720138438250666>',
  Egg:   '<:sawpillowEgg:1190721964759846912>',
  RuntimeError: '<:sawPillowRuntime:1190728018860191877>',
  Val: '<:sawpillowval:1192474258425786458>',
  Slime: '<:sawpillowSlime:1192479024379871282>',
  GoldenGait: '<:GoldenGait:1192574962477838346>'
};

module.exports = {
  callback: async (client, interaction) => {
      try {
       if (client.battleOngoing == true)
       {
        await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
        return;
       }

          const targetUserId = interaction.options.get('target-user').value;
          const targetUser = await client.users.fetch(targetUserId);

          if (!targetUser) {
              await interaction.reply({
                  content: 'Unable to fetch target user information.',
              });
              return;
          }

          const targetUserName = targetUser.username;
          const userSawpillows = storedData[targetUserName];

          if (targetUserName == "frnotpixel")
          {
            achievementGive(client, interaction.user, interaction, "240p Pixel", "Normal")
          }

          

          if (!userSawpillows || userSawpillows.length === 0) {
              await interaction.reply({
                  content: `**@${targetUserName}**\n**${targetUserName}** doesn't have any Sawpillows.`,
              });
              return;
          }

          const MAX_MESSAGE_LENGTH = 2000;

// Function to truncate the message and remove the last line if it exceeds 2000 characters
function truncateMessage(message) {
    if (message.length > MAX_MESSAGE_LENGTH) {
        const lines = message.split('\n');
        let truncatedMessages = [];
        let currentMessage = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (currentMessage.length + line.length < MAX_MESSAGE_LENGTH) {
                currentMessage += line + '\n';
            } else {
                truncatedMessages.push(currentMessage.trim());
                currentMessage = line + '\n';
            }
        }

        if (currentMessage.trim().length > 0) {
            truncatedMessages.push(currentMessage.trim());
        }

        return truncatedMessages;
    }

    return [message];
}

// Assuming userSawpillows is an array of Sawpillows
const formattedSawpillows = userSawpillows.map(sawpillow => {
    const name = sawpillow.Name || sawpillow;
    const type = sawpillow.Type || 'Normal'; // Assuming 'Normal' as the default type
    const emoji = emojiMap[type] || '<:defaultEmoji:123456789012345678>'; // Replace 'defaultEmoji' with the actual emoji ID for the default type
    return `${emoji} ${name}`;
}).join('\n');

// Truncate the formattedSawpillows to ensure it's under 2000 characters
const truncatedMessages = truncateMessage(`**@${targetUserName}**\n${formattedSawpillows}`);

// Reply with each truncated message in a loop
let x = 0
for (const truncatedMessage of truncatedMessages) {
    x+= 1
    if (x == 1)
    {
        await interaction.reply({
            content: truncatedMessage,
        });
    } else {
        await interaction.followUp({
            content: truncatedMessage,
        });
    }
}

        
        // Wait for a reply
        const filter = (response) => response.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
        
        if (collected.size > 0) {
            // User replied
            const userReply = collected.first().content;
        
            if (targetUserName === "onix13" || userReply == ":3") 
            {
                achievementGive(client, interaction.user, interaction, ":3", "Normal")
            }
        }
      } catch (error) {
          console.error(error);
          await interaction.reply({
              content: `An error occurred while processing your request. Please try again later.`,
          });
      }
  },

  name: 'view-sawpillows',
  description: 'Shows Saw Pillows',
  options: [
      {
          name: 'target-user',
          description: 'The user you want to view.',
          type: ApplicationCommandOptionType.User,
          required: true,
      },
  ],
};
