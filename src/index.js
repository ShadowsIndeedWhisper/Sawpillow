// SaWasTaken Technologies, 2023
// Based on the TSUBOT Framework
// Compiled from SRC -> JS 

// [2023]

// dotEnv lib
require('dotenv').config();

// Get relevant details from lib: 'Discord.js'
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client  = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, // Guild Support
        IntentsBitField.Flags.GuildMembers, // Member Support
        IntentsBitField.Flags.GuildMessages, // Message support
        IntentsBitField.Flags.MessageContent, // Get content from messages
    ]
})

// evenHandler init
eventHandler(client);

client.login(process.env.TOKEN);
