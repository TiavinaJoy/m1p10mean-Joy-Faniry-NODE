function timezoneDateTime(dateString) {
    const datySplit = dateString.split(' ');
    const dString = datySplit[0].split('-');
    const hString = datySplit[1].split(':');
    return new Date(
        dString[0],
        dString[1] - 1,
        dString[2],
        (Number(hString[0]) + 3).toString(),
        hString[1]
    );
   
}

module.exports = {
    timezoneDateTime
}