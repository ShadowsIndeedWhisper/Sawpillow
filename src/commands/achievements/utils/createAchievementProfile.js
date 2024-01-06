// Gunshot - Sound Studios
// ShadowX, 2023

const achievementProfiles = require('../../../Data/achievementProfiles.json');
const achievementProfilesPath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\achievementProfiles.json';

const fs = require('fs')
const readJSON = require('../../../utils/readJSON')
const writeJSON = require('../../../utils/writeJSON')
const achievements = require('../../../Data/achievements.json')

module.exports = (username) => {
    const storedData = readJSON(achievementProfilesPath);

    if (!storedData[username]) {
        storedData[username] = {
            Achievements: {},
            Secret: {},
            Incompleted: {}
        };

        // Move all arrays from 'Normal' to 'Incompleted'
        const normalAchievements = achievements.Normal;
        storedData[username].Incompleted.Normal = { ...normalAchievements };

        // Move all arrays from 'Secret' to 'Incompleted'
        const secretAchievements = achievements.Secret;
        storedData[username].Incompleted.Secret = { ...secretAchievements };

        writeJSON(achievementProfilesPath, storedData);
        return storedData[username];
    }
}
