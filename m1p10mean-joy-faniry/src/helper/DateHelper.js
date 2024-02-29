function timezoneDateTime(dateString) {
        const daty = new Date(dateString);
        const part1 = dateString.split(' ')[1];
        const hourString = part1.split(':')[0];
        const hour = parseInt(hourString);
        daty.setHours(daty.getHours() +3);
    
        if(daty.getUTCHours() != hour ){
            daty.setUTCHours(daty.getUTCHours() + 3);
        }
        return daty;
    }
module.exports = {
    timezoneDateTime
}