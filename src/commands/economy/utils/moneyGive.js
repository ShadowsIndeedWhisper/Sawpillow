// Gunshot - Sound Studios
// ShadowX, 2023

const moneyProfiles = require('../../../Data/moneyProfiles.json');
const readJSON = require('../../../utils/readJSON');
const writeJSON = require('../../../utils/writeJSON');
const moneyCreateProfile = require('./createMoneyProfile')

const moneyProfilesPath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\moneyProfiles.json';

module.exports = (targetUser, amount) => {

    const storedData = readJSON(moneyProfilesPath);
    let moneyProfile = storedData[targetUser.username]
    

    if (!moneyProfile)
    {
        moneyProfile = moneyCreateProfile(targetUser.username)
    }

    moneyProfile.money += amount

    writeJSON(moneyProfilesPath, storedData)

    return moneyProfile
};
