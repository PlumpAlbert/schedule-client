export enum WEEK_TYPE {
	GREEN = 1,
	WHITE = 0,
}

export enum WEEKDAY {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 7,
}

export const BACHELOR_MAX = 4;
export const MAGISTRACY_MAX = 2;
export type Course = 1 | 2 | 3 | 4 | 5 | 6;

export interface ISpecialty {
	title: string;
	courses: {
		[courseNumber in Course]?: number;
	};
}

export enum SUBJECT_TYPE {
	ЛЕКЦИЯ = 0,
	ПРАКТИКА = 1,
	ЛАБОРАТОРНАЯ = 2,
}

export interface IAttendTime {
	id: number;
	weekType: WEEK_TYPE;
	weekday: WEEKDAY;
	time: number;
	audience: string;
}

export interface ISubject {
	title: string;
	type: SUBJECT_TYPE;
	teacher: IUser;
	times: IAttendTime[];
}

export enum UserType {
	ADMIN = 1,
	TEACHER = 2,
	STUDENT = 0,
}

export interface IGroup {
	id: number;
	faculty: FACULTY;
	specialty: string;
	year: number;
}

export interface IUser {
	id: number;
	name: string;
	login?: string;
	type?: UserType;
	group?: IGroup;
}

export interface IAuthenticated {
	password: string;
}

export enum FACULTY {
	ФАИ = "ФАИ",
	ИСФ = "ИСФ",
	ФГСНиП = "ФГСНиП",
	ИМ = "ИМ",
	ЭФ = "ЭФ",
	МИ = "МИ",
	ФТФ = "ФТФ",
}
