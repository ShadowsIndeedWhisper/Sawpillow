// Gunshot - Sound Studios
// ShadowX, 2023

const moneyProfilesPath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\moneyProfiles.json';

const fs = require('fs')
const readJSON = require('../../../utils/readJSON')
const writeJSON = require('../../../utils/writeJSON')

module.exports = (username) => {
    const storedData = readJSON(moneyProfilesPath);

    if (!storedData[username]) {
        storedData[username] = {
            money: 0
        };
        
        writeJSON(moneyProfilesPath, storedData);
        return storedData[username];
    }
}
