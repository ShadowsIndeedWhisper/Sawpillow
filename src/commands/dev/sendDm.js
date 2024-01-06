const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
} = require('discord.js');


module.exports = {
    callback: async (client, interaction) => {

// Function to send a DM to the user with the specified ID
     try {
        const user = await client.users.fetch( interaction.options.getUser('user').id);
        await user.send(interaction.options.getString('message'));
    }   catch (error) {
        console.error(`Error sending DM to user with ID ${interaction.options.getUser('user').id}:`, error.message);
    }
   

    },

    name: 'task-dm',
    description: 'DEVELOPER OVERRIDE: DM a user',
    devOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user to give the pillow to',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'message',
            description: 'The message',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
};
