import moment from 'moment';

export const dateFormat = (date) => {
    const targetDate = moment(date);
    const today = moment();
    if (today.isSame(targetDate, 'day')) return targetDate.format('HH:MM');
    if (today.isSame(targetDate, 'year')) return targetDate.format('MM.DD');
    return targetDate.format('YYYY.MM.DD');
};

export const formatFullDate = (date) => {
    return moment(date).format('YYYY.MM.DD HH:MM:SS');
};