// Gunshot - Sound Studios
// ShadowX, 2023

const fs = require('fs')

module.exports = (path, data) =>
{
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
};