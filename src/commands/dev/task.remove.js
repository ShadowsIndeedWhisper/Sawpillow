const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const fs = require('fs');

const storedDataPath = "C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\storedData.json";

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

// Function to remove the specified SawPillow name from the user's data
const removeUserData = (userName, pillowName) => {
    // Read the existing data from the file
    const storedData = readData();

    // Check if the user exists in the data
    if (storedData[userName]) {
        // Remove the specified SawPillow name from the array
        storedData[userName] = storedData[userName].filter(name => name !== pillowName);

        // Write the updated data to the file
        writeData(storedData);
    }
};

module.exports = {
    callback: async (client, interaction) => {
        try {
            const targetUser = interaction.options.getUser('user');
            const pillowName = interaction.options.getString('name');

            if (!targetUser || !pillowName) {
                await interaction.reply("Please provide the target user and the name of the pillow to remove.");
                return;
            }

            // Remove the specified SawPillow name from the array
            removeUserData(targetUser.username, pillowName);

            await interaction.reply(`Successfully removed the pillow named ${pillowName} from ${targetUser.username}.`);
        } catch (error) {
            console.error('Error in task-remove:', error);
            await interaction.reply('An error occurred while running the task-remove command.');
        }
    },

    name: 'task-remove',
    description: 'DEVELOPER OVERRIDE: Removes a Pillow from a User',
    devOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user to remove the pillow from',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'name',
            description: 'Pillow Name',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
};
