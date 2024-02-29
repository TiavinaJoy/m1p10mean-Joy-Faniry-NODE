function timezoneDateTime(dateString) {
    const daty = new Date(dateString);
    const part1 = dateString.split(' ')[1];
    const hourString = part1.split(':')[0];
    const hour = parseInt(hourString);
    daty.getHours() == hour ? true : daty.setHours(daty.getHours() + 3);
    return daty;
}

module.exports = {
    timezoneDateTime
}