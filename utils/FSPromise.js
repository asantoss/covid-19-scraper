const fs = require('fs').promises;
const path = require('path')

const fsWritePromise = (name, data) => {
    const absolutePath = path.join(__dirname, '/data/', name)
    return fs.writeFile(absolutePath, data)
}
module.exports = { fsWritePromise }