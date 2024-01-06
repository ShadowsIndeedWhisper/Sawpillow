// Gunshot - Sound Studios
// ShadowX, 2023

const fs = require('fs')

module.exports = ( JSONPath ) => 
{
    try {
        const data = fs.readFileSync(JSONPath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.error(`Utils/readJSON Error, line: '9': ${error}`)
        return {};
      }
}