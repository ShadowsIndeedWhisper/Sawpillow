// Gunshot - Sound Studios
// ShadowX, 2023

const fs = require('fs');

const eggProfiles = require('../../../Data/eggProfiles.json');
const eggProfilesPath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\eggProfiles.json';

const eggsTypes = require('../../../Data/eggTypes.json')

const eggsCreateProfile = require('./createEggProfile')

const readJSON = require('../../../utils/readJSON')
const writeJSON = require('../../../utils/writeJSON')

const plrPillows = require('../../../../storedData.json')


const achievementGive = require('../../achievements/utils/achievementGive');
const internal = require('stream');
const storedDataPath = "C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\storedData.json"

const rndNames = [
    "jeff",
    "bob",
    "onix",
    "random guy",
    "gordon freeman",
    "hatched egg",
    "rename me pls",
    "preston",
    "thing",
    "thing 1",
    "thing 2",
    "south america",
    "america",
    "north america",
    "canada",
    "asia",
    "europe",
    "earth",
    "mars",
    "jeffery",
    "onix bbg"
]

module.exports = (client, targetUser, channel, interaction) => {
    const storedData = readJSON(eggProfilesPath);

    // Ensure user profile exists
    if (!storedData[targetUser.username]) {
        storedData[targetUser.username] = {
            currentEgg: null,
            battlesLeft: null
        };
    }

    const userCurrentEgg = storedData[targetUser.username].currentEgg;
    const userBattlesLeft = storedData[targetUser.username].battlesLeft;

    eggsCreateProfile(targetUser.username);

    if (userCurrentEgg && userBattlesLeft > 0) {
        // If the user has an egg and battles left, decrement battlesLeft
        storedData[targetUser.username].battlesLeft--;

        if (storedData[targetUser.username].battlesLeft <= 0) {
            // If battlesLeft is 0 or less, the egg hatches
            const eggType = userCurrentEgg;
            const pillow = selectPillow(eggType);

            // You can add a message indicating that the egg has hatched and which pillow they got
            client.channels.cache.get(channel.id).send(`<@${targetUser.id}>\n*You just hatched a **${pillow} pillow** from your **${eggType}** egg!*`)

           if (pillow === "Shiny")
           {
            achievementGive(client, targetUser, interaction, "An 'Eggcelent' Discovery", "Secret")
           }

            let storeMain = readJSON(storedDataPath)

            storeMain[targetUser.username].push({
                "Name": rndNames[Math.floor(Math.random() * rndNames.length)],
                "Type": pillow
              });

            writeJSON(storedDataPath, storeMain)

            storedData[targetUser.username].currentEgg = null;
            storedData[targetUser.username].battlesLeft = null;
        }

        // Save the updated data
        writeJSON(eggProfilesPath, storedData);
    }
};

function selectPillow(eggType) {
    // Use the egg type to determine the chances and select the pillow
    const pillowChances = eggsTypes[eggType].Chances;
    const totalChances = Object.values(pillowChances).reduce((total, chance) => total + chance, 0);
    const randomNum = Math.floor(Math.random() * totalChances) + 1;

    let cumulativeChances = 0;
    for (const [pillow, chance] of Object.entries(pillowChances)) {
        cumulativeChances += chance;
        if (randomNum <= cumulativeChances) {
            return pillow;
        }
    }

    // Default to 'Normal' pillow if something goes wrong
    return 'Normal';
}


  // Function to find or create user data and add SawPillow name
  