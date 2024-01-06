const updateProfile = require('../../commands/achievements/utils/updateProfile');
const achievementProfiles = require('../../Data/achievementProfiles.json');

const _UPDATE_PROFILES = false

module.exports = () => {
    if (!_UPDATE_PROFILES) {
        return;
    }
    Object.keys(achievementProfiles).forEach((username) => {
        updateProfile(username);
    });
};