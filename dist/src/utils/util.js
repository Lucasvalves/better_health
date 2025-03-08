"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunk = exports.splitByvalue = exports.addMinutesToDate = exports.breakTimeRange = void 0;
const date_fns_1 = require("date-fns");
const breakTimeRange = (startDate, startTime, endTime, intervalMinutes) => {
    const result = [];
    const startDateTime = (0, date_fns_1.addHours)((0, date_fns_1.parse)(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date()), 0);
    const endDateTime = (0, date_fns_1.addHours)((0, date_fns_1.parse)(`${startDate} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date()), 0);
    let currentDateTime = startDateTime;
    while ((0, date_fns_1.isBefore)(currentDateTime, endDateTime)) {
        const nextDateTime = (0, date_fns_1.addMinutes)(currentDateTime, intervalMinutes);
        // Verificar se o próximo intervalo ultrapassa o horário de término
        if ((0, date_fns_1.isAfter)(nextDateTime, endDateTime)) {
            break;
        }
        result.push((0, date_fns_1.format)(currentDateTime, 'HH:mm'));
        currentDateTime = nextDateTime;
    }
    return result;
};
exports.breakTimeRange = breakTimeRange;
const addMinutesToDate = (date, duration) => {
    const minutesToDate = (0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(date, (0, date_fns_1.getHours)((0, date_fns_1.addHours)(duration, +3))), (0, date_fns_1.getMinutes)(duration));
    return (0, date_fns_1.format)(minutesToDate, 'HH:mm');
};
exports.addMinutesToDate = addMinutesToDate;
const splitByvalue = (array, value) => {
    let newArray = [[]];
    array?.forEach((item) => {
        if (item != value) {
            newArray[newArray.length - 1].push(item);
        }
        else {
            newArray.push([]);
        }
    });
    return newArray;
};
exports.splitByvalue = splitByvalue;
const chunk = (array, size) => {
    if (!Array.isArray(array) || size <= 0) {
        return [];
    }
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};
exports.chunk = chunk;
