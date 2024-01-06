const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
} = require('discord.js');

const fs = require('fs');
const storedData = require("../../../storedData.json");
const clans = require("../../Data/clans.json");
const gameData = require('../../Data/gameData.json')

module.exports = {
    callback: async (client, interaction) => {
        if (client.battleOngoing == true)
        {
            await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
         return;
        }
        const clanName = interaction.options.getString('clan-name');
        const username = interaction.user.username;

        // Check if the user is trying to join their own clan
        const userClan = getUserClan(username);
        if (userClan && userClan.owner === username && userClan.Name === clanName) {
            await interaction.reply({
                content: `You cannot join your own clan.`,
            });
            return;
        }

        // Leave current clan if in one
        if (userClan) {
            if (userClan.owner === username) {
                // User owns a clan, delete it
                delete clans[userClan.Name];
                await interaction.reply({
                    content: `You have successfully deleted your clan "${userClan.Name}".`,
                });
            } else {
                // User is a member, leave the clan
                const memberIndex = userClan.Members.indexOf(username);
                userClan.Members.splice(memberIndex, 1);
                updateClanTotalPillows(userClan);
                writeClanData(clans);
                await interaction.reply({
                    content: `You have successfully left the clan "${userClan.Name}".`,
                });
            }
        }

        // Join the new clan or create it if it doesn't exist
        if (clans[clanName]) {
            const newClan = clans[clanName];
            // Check if the user is already a member of the clan
            if (!newClan.Members.includes(username)) {
                newClan.Members.push(username);
                updateClanTotalPillows(newClan);
                writeClanData(clans);
                await interaction.reply({
                    content: `You have successfully joined the clan "${clanName}".`,
                });
            } else {
                await interaction.reply({
                    content: `You are already a member of the clan "${clanName}".`,
                });
            }
        } else {
            await interaction.reply({
                content: `The clan "${clanName}" does not exist.`,
            });
        }
    },

    name: 'joinclan',
    description: 'Joins a clan',
    options: [
        {
            name: 'clan-name',
            description: 'The name of the clan you\'re joining.',
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