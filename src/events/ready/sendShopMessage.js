const gameData = require('../../Data/gameData.json');

const prices = {
    Beginner: 50,
    Ametuer: 80,
    Intermediate: 130,
    Advanced: 235,
    Expert: 350,
    Master: 550,
    Legendary: 850,
    Mythical: 1300,
    Deity: 1900,
    Champion: 2500,
};

const roleIDs = {
    Beginner: "1192413479391469639",
    Ametuer: "1192413626976448552",
    Intermediate: "1192413795201593435",
    Advanced: "1192413844094591017",
    Expert: "1192413895353172039",
    Master: "1192413993185325067",
    Legendary: "1192414041298182164",
    Mythical: "1192414125452689439",
    Deity: "1192414175327166474",
    Champion: "1192414262749036584",
}

const readJSON = require('../../utils/readJSON');
const writeJSON = require('../../utils/writeJSON');

const createProfileMoney = require('../../commands/economy/utils/createMoneyProfile')



module.exports = async (client) => {
    const channelId = gameData.shopChannelID; // Replace with your channel ID

    const initialMessageData = {
        content: "**SHOP**\n*Shop here for different roles that give you boosts!*\n*Defeat Sawpillows to gain money, and use money to buy roles*\n**NOTICE: ** *Only 1 person can have the Champion role at a time, that person, being the person with the most amount of money. Ping Saw if you would like the role.*\n\n** *Roles STACK!* **",
        embeds: null,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 2,
                        label: 'Open Shop',
                        custom_id: 'OpenShop',
                        emoji: {
                            name: '🎁',
                        },
                    },
                ],
            },
        ],
    };


    const channel = client.channels.cache.get(channelId);

    if (channel) {
        try {
            // Delete previous messages in the channel
            const fetchedMessages = await channel.messages.fetch({ limit: 100 });
            await channel.bulkDelete(fetchedMessages);

            // Send the initial message
            await channel.send(initialMessageData);

            // Listen for the 'interactionCreate' event
            client.on('interactionCreate', async (interaction) => {
                if (!interaction.isButton() || !interaction.message) return;

                // Handle button click
                if (interaction.customId === 'OpenShop') {
                    // Send an ephemeral message to the user who clicked the button
                    await interaction.reply({
                        content: "**Buy Here**",
                        ephemeral: true, // Set to true for ephemeral message
                        "components": [
                            {
                             "type": 1,
                             "components": [
                              {
                               "type": 3,
                               "custom_id": "Beginner ",
                               "options": [
                                {
                                 "label": "Beginner",
                                 "description": "$50",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "value": "Beginner",
                                 "default": false
                                },
                                {
                                 "label": "Ametuer",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$80",
                                 "value": "Ametuer",
                                 "default": false
                                },
                                {
                                 "label": "Intermediate",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$130",
                                 "value": "Intermediate",
                                 "default": false
                                },
                                {
                                 "label": "Advanced",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$235",
                                 "value": "Advanced",
                                 "default": false
                                },
                                {
                                 "label": "Expert",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$ 350",
                                 "value": "Expert",
                                 "default": false
                                },
                                {
                                 "label": "Master",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$550",
                                 "value": "Master",
                                 "default": false
                                },
                                {
                                 "label": "Legendary",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$850",
                                 "value": "Legendary",
                                 "default": false
                                },
                                {
                                 "label": "Mythical",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$1300",
                                 "value": "Mythical",
                                 "default": false
                                },
                                {
                                 "label": "Deity",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$1900",
                                 "value": "Deity",
                                 "default": false
                                },
                                {
                                 "label": "Champion",
                                 "emoji": {
                                  "name": "💰",
                                  "animated": false
                                 },
                                 "description": "$2500",
                                 "value": "Champion",
                                 "default": false
                                }
                               ],
                               "placeholder": "Choose a role to get!",
                               "min_values": 1,
                               "max_values": 1
                              }
                             ]
                            }
                           ]
                    });


                }
            });

            client.on('interactionCreate', async (interaction) => {
                if (interaction.isStringSelectMenu()) {
                    let guildMember = interaction.guild.members.cache.get(interaction.user.id);

                    const selectedItemMenu = interaction.values[0]
                    const chosenPrice = prices[selectedItemMenu]
                    const role = interaction.guild.roles.cache.get(roleIDs[selectedItemMenu]);

                    let moneyProfiles = readJSON("C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\moneyProfiles.json")
                    
                    let plrProfile

                    if (!moneyProfiles[interaction.user.username])
                    {
                        plrProfile = createProfileMoney(interaction.user.username)
                    } else {
                        plrProfile = moneyProfiles[interaction.user.username]
                    }

                    let plrMoney = plrProfile.money
                    let canAfford = false

                    if (plrMoney - chosenPrice >= 0)
                    {
                        canAfford = true;
                    }

                    if (guildMember.roles.cache.has(role.id)) {
                        await interaction.reply({
                            content: `You already have this role!`,
                            ephemeral: true
                        })
                        return
                    }

                    

                    if (!canAfford)
                    {
                        await interaction.reply({
                            content: `You cannot afford this! You need $${chosenPrice - plrMoney} more to do this!`,
                            ephemeral: true
                        })
                    } else {
                        if (selectedItemMenu == "Champion")
                        {

                            await interaction.reply({
                                content: `DM <@751000055229448192> for the role.`,
                                ephemeral: true
                            })
                            return
                        }

                        await interaction.reply({
                            content: `You just bought the '${selectedItemMenu}' rank!`,
                            ephemeral: true
                        })

                        moneyProfiles[interaction.user.username].money -= chosenPrice

                        

                        if (guildMember) {
                            // Get the role
                           
                        
                            if (role) {
                                // Add the role to the member
                                guildMember.roles.add(role)
                                    .then(() => {
                                        console.log(`Role ${role.name} added to ${interaction.user.tag}`);
                                    })
                                    .catch(error => {
                                        console.error('Error adding role:', error);
                                    });
                            } 
                        } 
                    }

                    writeJSON("C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\moneyProfiles.json", moneyProfiles)
                }
            });
        } catch (error) {
            console.error('Error deleting messages or sending a new one:', error);
        }
    } else {
        console.error(`Channel with ID ${channelId} not found.`);
    }
};
