const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
} = require('discord.js');

const fs = require('fs');
const clans = require("../../Data/clans.json");
const storedData = require("../../../storedData.json");
const gameData = require('../../Data/gameData.json')

module.exports = {
    callback: async (client, interaction) => {
        if (client.battleOngoing == true)
       {
        await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
        return;
       }
        const clanName = interaction.options.getString('clan-name');
        const ownerUsername = interaction.user.username;

        // Check if the user is already in a clan or owns a clan
        const userClan = getUserClan(ownerUsername);

        if (userClan) {
            if (userClan.owner === ownerUsername) {
                // User owns a clan, delete it
                delete clans[userClan.Name];
                await interaction.reply({
                    content: `You have successfully deleted your clan "${userClan.Name}".`,
                });
            } else {
                // User is a member, leave the clan
                const memberIndex = userClan.Members.indexOf(ownerUsername);
                userClan.Members.splice(memberIndex, 1);
                updateClanTotalPillows(userClan);
                writeClanData(clans);
                await interaction.reply({
                    content: `You have successfully left the clan "${userClan.Name}".`,
                });
            }
        }

        // Check if the clan already exists
        if (clans[clanName]) {
            await interaction.reply({
                content: `A clan with the name "${clanName}" already exists.`,
            });
            return;
        }

        // Retrieve the number of pillows for the owner
        const ownerPillows = storedData[ownerUsername] ? storedData[ownerUsername].length : 0;

        // Create a new clan object with initial data
        const newClan = {
            Name: clanName,
            owner: ownerUsername,
            TotalPillows: ownerPillows,
            Members: [ownerUsername],
        };

        // Add the new clan to the clans object
        clans[clanName] = newClan;

        // Save the updated clan data
        writeClanData(clans);

        await interaction.reply({
            content: `Clan "${clanName}" has been created successfully.`,
        });
    },

    name: 'newclan',
    description: 'Creates a new Clan',
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

// Function to get the clan that a user is currently in
function getUserClan(username) {
    for (const clan of Object.values(clans)) {
        if (clan.owner === username || clan.Members.includes(username)) {
            return clan;
        }
    }
    return null;
}

// Function to update the TotalPillows for a clan
function updateClanTotalPillows(clan) {
    const totalPillows = clan.Members.reduce((total, member) => {
        return total + (storedData[member] ? storedData[member].length : 0);
    }, 0);
    clan.TotalPillows = totalPillows;
}
