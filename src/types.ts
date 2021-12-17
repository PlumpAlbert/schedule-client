export enum WEEK_TYPE {
	GREEN = 1,
	WHITE = 0
}

export enum SUBJECT_TYPE {
	ЛЕКЦИЯ = 0,
	ПРАКТИКА = 1,
	ЛАБОРАТОРНАЯ = 2
}

export type Course = "1" | "2" | "3" | "4";

export interface ISpecialty {
	title: string;
	courses: {
		[courseNumber in Course]?: number;
	};
}

export interface ISubject {
	id: number;
	audience: string;
	type: number;
	title: string;
	time: Date;
	weekday: number;
	weekType: number;
	teacher: {
		id: number;
		name: string;
	};
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
	id?: number;
	name: string;
	login: string;
	type?: UserType;
	group: IGroup;
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
