const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
} = require('discord.js');

const storedData = require("../../../storedData.json");
const fs = require("fs")

const storedDataPath = "C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\storedData.json"
const giveAchievement = require('../achievements/utils/achievementGive')

const readData = () => {
    try {
      const data = fs.readFileSync(storedDataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or is invalid JSON, return an empty object
      return {};
    }
  };
  
  // Function to write the data to the file
  const writeData = (data) => {
    fs.writeFileSync(storedDataPath, JSON.stringify(data, null, 2), 'utf-8');
  };
  
  // Function to find or create user data and add SawPillow name
  const findOrCreateUserData = (userName, sawpillowName) => {
    // Read the existing data from the file
    const storedData = readData();
  
    // Check if the user exists in the data
    if (storedData[userName]) {
      console.log(`User ${userName} found in storedData.`);
      // Add the new SawPillow name to the array
      storedData[userName].push(sawpillowName);
    } else {
      // If the user doesn't exist, create an array with the SawPillow name
      storedData[userName] = [sawpillowName];
      console.log(`User ${userName} not found. Creating an array with the SawPillow name for them.`);
    }
  
    // Write the updated data to the file
    writeData(storedData);
  
    // Return the array of SawPillow names
    return storedData[userName];
  };
  

module.exports = {
    callback: async (client, interaction) => {
        try {
            const targetUser = interaction.options.getUser('user');
            const pillowName = interaction.options.getString('name');
            const pillowType = interaction.options.getString('type');

            if (!targetUser || !pillowName || !pillowType) {
                await interaction.reply("Please provide the target user, pillow name, and pillow type.");
                return;
            }

            // Add the new SawPillow name to the array
            findOrCreateUserData(targetUser.username, { Name: pillowName, Type: pillowType });

            giveAchievement(client, targetUser, interaction, "Thou Art Divine", "Secret")

         return true;
        } catch (error) {
            console.error('Error in task-give:', error);
            await interaction.reply('An error occurred while running the task-give command.');
        }
    },

    name: 'task-give',
    description: 'DEVELOPER OVERRIDE: Gives a Pillow to a User',
    devOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user to give the pillow to',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'name',
            description: 'Pillow Name',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'type',
            description: 'Pillow Type',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
};
