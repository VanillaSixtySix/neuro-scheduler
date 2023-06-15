export function getDateWithOffset(date: Date, offset: number) {
    const withOffset = new Date(date.getTime());
    withOffset.setDate(withOffset.getDate() + offset);
    return withOffset;
}

export function getDayWithOffset(date: Date, offset: number, short = true) {
    const dateWithOffset = getDateWithOffset(date, offset);
    const str = dateWithOffset.toLocaleString('en-us', { weekday: short ? 'short' : 'long' });
    if (short) {
        return str.toUpperCase();
    }
    return str;
}

export function getMonday(date: Date) {
    let monday: Date;
    if (date.getDay() === 1) {
        monday = date;
    } else {
        monday = new Date(date.setDate(date.getDate() - (date.getDay() || 7) + 1));
    }
    return monday;
}

/**
 * Returns the date in the formay YYYY-MM-DD without UTC conversion
 */
export function getDateStr(date: Date) {
    const components = date.toLocaleString('en-us', { timeZoneName: 'short' }).split(',')[0].split('/');
    const year = components[2].padStart(2, '0');
    const month = components[0].padStart(2, '0');
    const day = components[1].padStart(2, '0');
    return `${year}-${month}-${day}`;
}


