module.exports = function () {
    const date = new Date();
    return `${date.getMonth() +
        1}_${date.getDate()}_${date.getFullYear()}`
}