const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
  } = require('discord.js');
  
  const fs = require('fs');
  const storedData = require("../../../storedData.json");
const achievementGive = require('../achievements/utils/achievementGive');
  
  const filePath = './storedData.json'; // Update the path based on your actual file location
  
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
  
  module.exports = {
    callback: async (client, interaction) => {
      if (client.battleOngoing == true)
      {
        await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
       return;
      }
      const oldName = interaction.options.getString('old-name');
      const newName = interaction.options.getString('new-name');
  
      // Check if the user has a pillow with the old name
      const userPillows = storedData[interaction.user.username];
      const matchingPillow = userPillows.find(pillow => pillow.Name === oldName);
  
      if (matchingPillow) {
        // Rename the pillow
        matchingPillow.Name = newName;
  
        // Write the updated data to the file
        writeData(storedData);

        if (newName.toLowerCase() == "gnarpy" && matchingPillow.Type == "Alien")
        {
          achievementGive(client, interaction.user, interaction, "Gnarpy", "Normal")
        }
  
        await interaction.reply(`Successfully renamed the pillow from "${oldName}" to "${newName}".`);
      } else {
        await interaction.reply(`You don't own a pillow with the name "${oldName}".`);
      }
    },
  
    name: 'rename-pillow',
    description: 'Renames a Pillow',
    options: [
      {
        name: 'old-name',
        description: 'The Old name.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'new-name',
        description: 'The New name.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  };