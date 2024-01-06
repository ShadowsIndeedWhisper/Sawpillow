// Gunshot - Sound Studios
// ShadowX, 2023

const fs = require('fs');

const eggProfiles = require('../../../Data/eggProfiles.json');
const eggProfilesPath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\eggProfiles.json';

const eggsTypes = require('../../../Data/eggTypes.json')

const eggsCreateProfile = require('./createEggProfile')

const readJSON = require('../../../utils/readJSON')
const writeJSON = require('../../../utils/writeJSON')

module.exports = (client, targetUser, channel) => {
    const storedData = readJSON(eggProfilesPath);

    // Ensure user profile exists
    if (!storedData[targetUser.username]) {
        storedData[targetUser.username] = {
            currentEgg: null,
            battlesLeft: null
        };
    }

    const userCurrentEgg = storedData[targetUser.username].currentEgg;

    eggsCreateProfile(targetUser.username);
    
    if (!userCurrentEgg) {
        // If the user doesn't have a current egg, randomly select an egg type
        const { eggType, battlesReq } = selectRandomEggType();
        
        // Assign the selected egg type to the user
        storedData[targetUser.username].currentEgg = eggType;
        storedData[targetUser.username].battlesLeft = battlesReq;
        writeJSON(eggProfilesPath, storedData);
        console.log(channel)
        client.channels.cache.get(channel.id).send(`You have collected the '**${eggType}**' egg.`,)
        
       

    }
        
};

function selectRandomEggType() {
    const eggTypes = Object.keys(eggsTypes);
    const chances = {
        Normal: 55,
        Rare: 35,
        Epic: 15,
        Legendary: 10,
        Mythical: 7,
        Deity: 5,
    };

    // Calculate total chances
    const totalChances = Object.values(chances).reduce((total, chance) => total + chance, 0);

    // Generate a random number between 1 and the total chances
    const randomNum = Math.floor(Math.random() * totalChances) + 1;

    // Determine the selected egg type based on the random number
    let cumulativeChances = 0;
    for (const type of eggTypes) {
        cumulativeChances += chances[type];
        if (randomNum <= cumulativeChances) {
            return { eggType: type, battlesReq: eggsTypes[type].BattlesReq };
        }
    }

    // Default to 'Normal' if something goes wrong
    return { eggType: 'Normal', battlesReq: eggsTypes['Normal'].BattlesReq };
}