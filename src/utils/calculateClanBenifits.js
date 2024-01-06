// Gunshot - Sound Studios
// ShadowX, 2023

const fs = require('fs');

module.exports = (username, clans) => {
    const leaderboardData = Object.entries(clans)
        .map(([clanName, clanData]) => ({ clanName, totalPillows: clanData.TotalPillows }))
        .sort((a, b) => b.totalPillows - a.totalPillows);

    for (let i = 0; i < leaderboardData.length; i++) {
        const { clanName, totalPillows } = leaderboardData[i];

        if (clans[clanName].Members.includes(username)) {
            return i + 1; // Return the rank if found
        }
    }

    return 0; // Return 0 if the user is not in any clan
};
