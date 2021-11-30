import { WEEK_TYPE } from "./Types";

export function GetWeekdayName(weekday: number) {
    const monday = "2021-11-22";
    let date = new Date(monday);
    date.setDate(date.getDate() + weekday - 1);
    let locale = "ru";
    // if (navigator.languages.length) locale = navigator.languages[0];
    return date.toLocaleDateString(locale, { weekday: "long" });
}

/**
 * Returns week type for provided date (or today)
 * @param {number|Date?} date Date to calculate week type
 * @returns {WEEK_TYPE} Type of week for provided date (or today)
 */
export function GetWeekType(date?: number | Date): WEEK_TYPE {
    if (typeof date === "number") date = new Date(date);
    if (!date) date = new Date();
    let firstWeek;
    if (date.getMonth() >= 8) {
        firstWeek = new Date(date.getFullYear() + "-09-01");
    } else {
        firstWeek = new Date(`${date.getFullYear() - 1}-09-01`);
    }

    if (firstWeek.getDay() !== 1) {
        firstWeek.setDate(firstWeek.getDate() - (firstWeek.getDay() - 1));
    }
    let weeksPassed = Math.floor(
        (date.getTime() - firstWeek.getTime()) / 604800000
    );
    return weeksPassed % 2 ? WEEK_TYPE.GREEN : WEEK_TYPE.WHITE;
}
