export enum WEEK_TYPE {
	GREEN = 1,
	WHITE = 0
}

export enum SUBJECT_TYPE {
	LECTURE = 0,
	PRACTICE = 1,
	LAB = 2
}

export type Course = "1" | "2" | "3" | "4";

export interface ISpecialty {
	title: string;
	courses: {
		[courseNumber in Course]: number;
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
