const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
} = require('discord.js');

const storedData = require("../../../storedData.json")
const moneyProfiles = require("../../Data/moneyProfiles.json")

const moneyCreateProfile = require('./utils/createMoneyProfile')
const moneyGive = require('./utils/moneyGive')
const readJSON = require('../../utils/readJSON');
const createMoneyProfile = require('./utils/createMoneyProfile');


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
        let moneyProfile = moneyProfiles[targetUser.username]

       if (!moneyProfile)
       {
        moneyProfile = createMoneyProfile(targetUser.username)
       }

       const embed = new EmbedBuilder()
                    .setTitle(`${targetUser.username}'s Money 💵`)
                    .setColor('#86FF4F')
                    .addFields(
                        {name: 'Money: ', value: `$${moneyProfile.money.toString()}`}
                    )

                await interaction.reply({ embeds: [embed] });
        

            

    },

    name: 'moneyget',
    description: 'Gets the user\'s money',
    options: [
        {
            name: 'target-user',
            description: 'The user you view.',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
};
