export function GetWeekdayName(weekday: number) {
    const monday = "2021-11-22";
    let date = new Date(monday);
    date.setDate(date.getDate() + weekday - 1);
    let locale = "ru";
    // if (navigator.languages.length) locale = navigator.languages[0];
    return date.toLocaleDateString(locale, { weekday: "long" });
}
