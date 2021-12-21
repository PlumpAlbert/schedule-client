export enum WEEK_TYPE {
	GREEN = 1,
	WHITE = 0
}

export enum WEEKDAY {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 7
}

export type Course = "1" | "2" | "3" | "4";

export interface ISpecialty {
	title: string;
	courses: {
		[courseNumber in Course]?: number;
	};
}

export enum SUBJECT_TYPE {
	ЛЕКЦИЯ = 0,
	ПРАКТИКА = 1,
	ЛАБОРАТОРНАЯ = 2
}

export interface ISubject {
	id: number;
	audience: string;
	type: number;
	title: string;
	time: number;
	weekday: WEEKDAY;
	weekType: WEEK_TYPE;
	teacher: IUser;
}

export enum UserType {
	ADMIN = 1,
	TEACHER = 2,
	STUDENT = 0
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
	ФТФ = "ФТФ"
}
