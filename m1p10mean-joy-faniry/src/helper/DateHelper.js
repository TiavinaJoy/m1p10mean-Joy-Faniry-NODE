function timezoneDateTime(dateString) {
    const daty = new Date(dateString);
    const part1 = dateString.split(' ')[1];
    const hourString = part1.split(':')[0];
    const hour = parseInt(hourString);
    if(daty.getHours() != hour ){
        console.log(hour - daty.getHours());
        daty.setHours(daty.getHours() + 3);
    }
    const iso = daty.toISOString();
    return daty;
}

module.exports = {
    timezoneDateTime
}