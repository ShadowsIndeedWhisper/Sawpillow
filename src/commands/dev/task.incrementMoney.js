const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
} = require('discord.js');

const fs = require("fs")

const addMoney = require('../economy/utils/moneyGive')

module.exports = {
    callback: async (client, interaction) => {
        try {
            const targetUser = interaction.options.getUser('user');
            const moneyAmount = interaction.options.getNumber('money');

            addMoney(targetUser, moneyAmount)
            await interaction.reply('✅');
         return true;
        } catch (error) {
            console.error('Error in task-give:', error);
            await interaction.reply('An error occurred while running the task-give command.');
        }
    },

    name: 'task-addmoney',
    description: 'DEVELOPER OVERRIDE: Adds x to a Users money',
    devOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user to give the money to',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'money',
            description: 'Money Amount',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
};
