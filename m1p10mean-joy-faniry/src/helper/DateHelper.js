function timezoneDateTime(dateString) {
    const daty = new Date(dateString);
    daty.setHours(daty.getHours() + 3);
    console.log(daty);
    return daty;
}

module.exports = {
    timezoneDateTime
}