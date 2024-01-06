const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js');

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

        // Check if the clan exists
        if (clans[clanName]) {
            const clan = clans[clanName];
            const owner = clan.owner;
            const members = clan.Members.length.toString();
            const totalPillows = clan.TotalPillows.toString();

            console.log(owner)
            console.log(members.length)
            console.log(totalPillows)
            // Create an embed with clan information
            const embed = new EmbedBuilder()
                .setTitle(`Clan Information - ${clanName}`)
                // .addFields(
                //     { name: 'Owner', value: owner },
                //     { name: 'Members', value:  members.join('\n') || 'No members' },
                //     { name: 'Total SawPillows', value: totalPillows},
                   
                // )
                .addFields(
                    { name: 'Owner', value: owner, inline: false },
                    {  name: 'Members', value: members, inline: false },
                   { name: 'Total SawPillows', value: totalPillows, inline: false },
                )
                .setColor('#0099ff');

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({
                content: `The clan "${clanName}" does not exist.`,
            });
        }
    },

    name: 'claninfo',
    description: 'Displays information about a clan.',
    options: [
        {
            name: 'clan-name',
            description: 'The name of the clan.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};
