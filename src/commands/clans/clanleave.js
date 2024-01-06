const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
} = require('discord.js');

const fs = require('fs');
const storedData = require("../../../storedData.json");
const clans = require("../../Data/clans.json");
const gameData = require('../../Data/gameData.json')

const filePath = './storedData.json';

module.exports = {
    callback: async (client, interaction) => {
        if (client.battleOngoing == true)
        {
            await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
         return;
        }
        const clanName = interaction.options.getString('clan-name');
        const userName = interaction.user.username;

        // Check if the clan exists
        if (clans[clanName]) {
            const clan = clans[clanName];
            const owner = clan.owner;
            const members = clan.Members;

            // Check if the user is the owner of the clan
            if (userName === owner) {
                await interaction.reply({
                    content: `You cannot leave your own clan. If you want to disband it, use the \`delete-clan\` command.`,
                });
                return;
            }

            // Check if the user is a member of the clan
            if (members.includes(userName)) {
                // Remove the user from the clan
                const userIndex = members.indexOf(userName);
                members.splice(userIndex, 1);

                // Update total pillows in the clan
                clan.TotalPillows -= storedData[userName].length;

                // Save the updated clan data
                writeClanData(clans);

                await interaction.reply({
                    content: `You have left the clan "${clanName}".`,
                });
            } else {
                await interaction.reply({
                    content: `You are not a member of the clan "${clanName}".`,
                });
            }
        } else {
            await interaction.reply({
                content: `The clan "${clanName}" does not exist.`,
            });
        }
    },

    name: 'leaveclan',
    description: 'Leaves a clan.',
    options: [
        {
            name: 'clan-name',
            description: 'The name of the clan.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};

// Function to write clan data to the clans.json file
function writeClanData(data) {
    const filePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\clans.json'; // Update the path based on your actual file location
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData);
        console.log('Clan data written to clans.json successfully.');
    } catch (error) {
        console.error('Error writing clan data to clans.json:', error);
    }
}
