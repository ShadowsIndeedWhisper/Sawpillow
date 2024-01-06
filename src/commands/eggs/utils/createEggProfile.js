// Gunshot - Sound Studios
// ShadowX, 2023

const eggProfiles = require('../../../Data/eggProfiles.json');
const eggProfilesPath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\eggProfiles.json';

const fs = require('fs')
const readJSON = require('../../../utils/readJSON')
const writeJSON = require('../../../utils/writeJSON')
const eggs = require('../../../Data/eggTypes.json')

module.exports = (username) => {
    const storedData = readJSON(eggProfilesPath);

    if (!storedData[username]) {
        storedData[username] = {
            currentEgg: null,
            battlesLeft: null
        };
        
        writeJSON(eggProfilesPath, storedData);
        return storedData[username];
    }
}
