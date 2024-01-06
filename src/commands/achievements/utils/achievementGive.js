// Gunshot - Sound Studios
// ShadowX, 2023

const achievementProfiles = require('../../../Data/achievementProfiles.json');
const achievementProfilesPath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\achievementProfiles.json';

const fs = require('fs');
const readJSON = require('../../../utils/readJSON');
const writeJSON = require('../../../utils/writeJSON');
const achievementsData = require('../../../Data/achievements.json');
const updateProfile = require('./updateProfile');
const createAchievementProfile = require('./createAchievementProfile');

module.exports = (client, targetUser, interaction ,achievementName, achievementType) => {
    const storedData = readJSON(achievementProfilesPath);
    const userAchievements = storedData[targetUser.username]?.Incompleted;

    createAchievementProfile(targetUser.username)
    updateProfile(targetUser.username)
    console.log(achievementName)
    if (userAchievements) {
        // Check if the achievement exists in 'Normal'
        if (!storedData[targetUser.username].Achievements[achievementName] && !storedData[targetUser.username].Secret[achievementName]) {
            // Send the achievement message
            client.channels.cache.get(interaction.channel.id).send(`<@${targetUser.id}>\n🏆 Achievement unlocked: '**${achievementName}**'`);
        } 
        if (userAchievements.Normal && userAchievements.Normal[achievementName] || userAchievements.Secret && userAchievements.Secret[achievementName]) {
            const achievement = userAchievements[achievementType][achievementName];
            
            // Move the achievement to 'Achievements' or 'Secret' based on the type
            if (achievement.Type === 'Secret') {
                storedData[targetUser.username].Secret[achievementName] = achievement;
                delete userAchievements.Secret[achievementName]
            } else {
                storedData[targetUser.username].Achievements[achievementName] = achievement;
                delete userAchievements.Norma;[achievementName]
            }

              
            writeJSON(achievementProfilesPath, storedData);

           
        }
    } 

    updateProfile(targetUser.username)
};