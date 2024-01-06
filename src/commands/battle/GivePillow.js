const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
} = require('discord.js');

const fs = require('fs');
const storedData = require("../../../storedData.json");

const filePath = './storedData.json';

// Function to write data to storedData.json
function writeData(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData);
        console.log('Data written to storedData.json successfully.');
    } catch (error) {
        console.error('Error writing data to storedData.json:', error);
    }
}

const getUsernamePillowCount = (storedData, username) => {
    const userPillows = storedData[username];
    const pillowCount = Array.isArray(userPillows) ? userPillows.length : 0;
    return pillowCount;
  };

module.exports = {
    callback: async (client, interaction) => {
        if (client.battleOngoing == true)
        {
            await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
         return;
        }
        const targetUser = interaction.options.get('target-user').user;
        const ballName = interaction.options.get('ball-name').value;

        // Check if the user executing the command has the specified pillow
        const userSawpillows = storedData[interaction.user.username];
        const userHasPillow = userSawpillows && userSawpillows.some(pillow => pillow.Name === ballName || pillow === ballName);

        if (!userHasPillow) {
            return interaction.reply(`You don't have a pillow named ${ballName}.`);
        }

        // Remove the pillow from the user executing the command
        const updatedUserPillows = userSawpillows.filter(pillow => pillow.Name !== ballName && pillow !== ballName);
        storedData[interaction.user.username] = updatedUserPillows;

        // Add the pillow to the target user
        const targetUsername = targetUser.username;
        if (!storedData[targetUsername]) {
            storedData[targetUsername] = [];
        }
        storedData[targetUsername].push({ Name: ballName, Type: "Normal" });

        // Save the updated data
        writeData(storedData);

        if (getUsernamePillowCount(storedData,interaction.user) >= 69)
              {
                giveAchievement(client, interaction.user, interaction, "nice", "Normal")
              }

        return interaction.reply(`You gave your pillow named ${ballName} to ${targetUser}.`);
    },

    name: 'give-pillow',
    description: 'Gives a Pillow',
    options: [
        {
            name: 'target-user',
            description: 'The User you\'re gifting to',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'ball-name',
            description: 'The name of the ball you\'re giving.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};
