const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
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
        try {

            for (const clan of Object.values(clans)) {
                updateClanTotalPillows(clan);
            }

            const leaderboardData = Object.entries(clans)
                .map(([clanName, clanData]) => ({ clanName, totalPillows: clanData.TotalPillows }))
                .sort((a, b) => b.totalPillows - a.totalPillows)
                .slice(0, 10); // Take the top 10 entries

            // Create an embed for the clan leaderboard
            const embed = new EmbedBuilder()
                .setTitle('Clan Leaderboard 🏆')
                .setColor('#42f578')
                .setDescription(
                    leaderboardData.length > 0
                        ? leaderboardData.map((entry, index) => `**${index + 1}.** ${entry.clanName}: **${entry.totalPillows}** Pillows`).join('\n')
                        : 'No data available.'
                );

            // Send the embed as a reply
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `An error occurred while processing your request. Please try again later.`,
            });
        }
    },

    name: 'clanleaderboard',
    description: 'Displays the Clan Leaderboard',
    options: [],
};

function updateClanTotalPillows(clan) {
    const totalPillows = clan.Members.reduce((total, member) => {
        return total + (storedData[member] ? storedData[member].length : 0);
    }, 0);
    clan.TotalPillows = totalPillows;
}