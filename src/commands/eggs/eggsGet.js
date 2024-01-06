const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
} = require('discord.js');

const storedData = require("../../../storedData.json")
const clans = require("../../Data/clans.json")
const eggsProfiles = require("../../Data/eggProfiles.json")

const eggsCreateProfile = require('./utils/createEggProfile')
const eggGive = require('./utils/eggGive')
const readJSON = require('../../utils/readJSON')


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        if (client.battleOngoing == true) {
            await interaction.reply('Another battle is already in progress. Please finish the current one before running a command.');
            return;
        }

        

        const targetUser = interaction.options.get('target-user').user;
        const eggProfile = eggsProfiles[targetUser.username];


        if (!eggProfile) {
            // If the user doesn't have an egg profile, create one
            eggsCreateProfile(targetUser.username);
            await interaction.reply('The user now has an egg profile.\nPlease re-run the command.');
        } else {
            if (eggProfile.currentEgg === null) {
                await interaction.reply('They have no eggs.');
            } else {
                const embed = new EmbedBuilder()
                    .setTitle(`${targetUser.username}'s Eggs 🥚`)
                    .setColor('#4972ED')
                    .addFields(
                        {name: 'Current Egg: ', value: eggProfile.currentEgg},
                        {name: 'Battles left until Hatch: ', value: eggProfile.battlesLeft.toString()}
                        
                    )

                await interaction.reply({ embeds: [embed] });
            }
        }
    },

    name: 'eggsget',
    description: 'Gets the user\'s eggs',
    options: [
        {
            name: 'target-user',
            description: 'The user you view.',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
};
