const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
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

module.exports = {
    callback: async (client, interaction) => {
        if (client.battleOngoing == true)
        {
            await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
         return;
        }
        const leaderboardData = Object.entries(storedData)
            .map(([username, sawpillows]) => ({ username, sawpillowCount: Array.isArray(sawpillows) ? sawpillows.length : 0 }))
            .sort((a, b) => b.sawpillowCount - a.sawpillowCount)
            .slice(0, 10); // Take the top 10 entries

        // Create an embed for the leaderboard
        const embed = new EmbedBuilder()
            .setTitle('Leaderboard ⭐')
            .setColor('#FF4E3A')
            .setDescription(
                leaderboardData.length > 0
                    ? leaderboardData.map((entry, index) => `**${index + 1}.** ${entry.username}: **${entry.sawpillowCount}** SawPillows`).join('\n')
                    : 'No data available.'
            );

        // Send the embed as a reply
        await interaction.reply({ embeds: [embed] });
    },

    name: 'leaderboard',
    description: 'Displays the Leaderboard',
    options: [],
};