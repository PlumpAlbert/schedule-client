import {BACHELOR_MAX, Course, SUBJECT_TYPE, WEEK_TYPE} from "./types";

/**
 * Returns string representation of a weekday
 *
 * @param weekday - weekday to pretty-print
 * @returns String representation of a weekday
 */
export function GetWeekdayName(weekday: number) {
	const monday = "2021-11-22";
	let date = new Date(monday);
	date.setDate(date.getDate() + weekday - 1);
	let locale = "ru";
	// if (navigator.languages.length) locale = navigator.languages[0];
	return date.toLocaleDateString(locale, {weekday: "long"});
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
	let weeksPassed = Math.floor((date.getTime() - firstWeek.getTime()) / 604800000);
	return weeksPassed % 2 ? WEEK_TYPE.GREEN : WEEK_TYPE.WHITE;
}

/**
 * Returns string representation of `SUBJECT_TYPE`
 *
 * @param {SUBJECT_TYPE} type - type of subject
 * @returns {string} Localized string for `type`
 */
export function GetSubjectTypeAsString(type: SUBJECT_TYPE): string {
	switch (type) {
		case 0: {
			return "Лекция";
		}
		case 1: {
			return "Практика";
		}
		case 2: {
			return "Лабораторная";
		}
		default:
			return "";
	}
}

/**
 * Calculates group's course from year
 * @param groupYear Group's year
 * @returns Group's course
 */
export function calculateCourse(groupYear: number): Course {
	const date = new Date();
	let number = date.getFullYear() - groupYear;
	if (date.getMonth() > 9) {
		number += 1;
	}
	return number as Course;
}

/**
 * Calculates group's year from their course
 *
 * @param {Course} course - Course number of a group
 * @returns {number} Year of group
 */
export function calculateYear(course: Course): number {
	const today = new Date();
	let year = today.getFullYear() - course;
	if (today.getMonth() > 9) {
		year += 1;
	}
	return year;
}

/**
 * Pretty printing of subject's start and end time
 * @param time Start time of subject
 */
export function renderTime(time: number = Date.now()) {
	const endTime = new Date(time);
	endTime.setHours(endTime.getHours() + 1);
	endTime.setMinutes(endTime.getMinutes() + 30);
	let locale = "ru";
	if (navigator.languages.length > 1) {
		locale = navigator.languages[1];
	}
	return `${new Date(time).toLocaleTimeString(locale, {
		hour: "2-digit",
		minute: "2-digit",
	})} - ${endTime.toLocaleTimeString(locale, {
		hour: "2-digit",
		minute: "2-digit",
	})}`;
}

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
	obj: X,
	prop: Y
): obj is X & Record<Y, unknown> {
	return obj.hasOwnProperty(prop);
}
