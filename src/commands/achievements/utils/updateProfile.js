// updateAchievements.js

const fs = require('fs');
const readJSON = require('../../../utils/readJSON');
const writeJSON = require('../../../utils/writeJSON');
const achievementsData = require('../../../Data/achievements.json');

module.exports = (username) => {
    const achievementProfilesPath = `C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\achievementProfiles.json`;
    const storedData = readJSON(achievementProfilesPath);
    
    const userAchievements = storedData[username];

    if (userAchievements) {
        // Iterate through 'Normal' and 'Secret' achievements
        for (const category of ['Normal', 'Secret']) {
            // Get incompleted achievements from achievements.json
            const incompletedAchievements = achievementsData[category] || {};

            // Filter only the incompleted achievements
            const filteredIncompleted = Object.keys(incompletedAchievements)
                .filter(achievement => !userAchievements.Achievements[achievement])
                .reduce((acc, achievement) => {
                    acc[achievement] = incompletedAchievements[achievement];
                    return acc;
                }, {});

            // Update the 'Incompleted' field in achievementProfiles.json
            storedData[username].Incompleted[category] = filteredIncompleted;
        }

        // Save the updated data
        writeJSON(achievementProfilesPath, storedData);
    } 
};
