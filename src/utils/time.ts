import dayjs from 'dayjs';

// 将日期字符串转换为 ISO 格式
export const formatDateToISO = (date: string) => {
    return dayjs(date).toISOString();
};

// 将 ISO 格式转换为日期字符串
export const formatISOToDate = (date: string) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
