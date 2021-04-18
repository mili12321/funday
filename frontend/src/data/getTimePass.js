import moment from 'moment'

export function getTime(date) {
    const time = moment(date).fromNow()
    switch (true) {
        case time.includes('a few seconds ago'):
            return 'now';
        case time.includes('a minute ago'):
            return time.replace('a minute ago', '1m');
        case time.includes('minutes'):
            return time.replace(' minutes ago', 'm');
        case time.includes('an hour ago'):
            return time.replace('an hour ago', '1h');
        case time.includes('hours'):
            return time.replace(' hours ago', 'h');
        case time.includes('a day ago'):
            return time.replace('a day ago', '1d');
        case time.includes('days'):
            return time.replace(' days ago', 'd');
        case time.includes('a month ago'):
            return time.replace('a month ago', '1M');
        case time.includes('months'):
            return time.replace(' months ago', 'M');
        default:
            return time;
    }
}