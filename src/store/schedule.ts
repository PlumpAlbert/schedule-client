import {createAction, createSlice} from "@reduxjs/toolkit";
import {RootState} from ".";
import {GetWeekType} from "../Helpers";
import {
	IAttendTime,
	ISubject,
	SUBJECT_TYPE,
	WEEKDAY,
	WEEK_TYPE
} from "../types";

interface IAttendTimePayload {
	id: number;
	property: keyof Omit<IAttendTime, "id">;
	value: IAttendTime[keyof Omit<IAttendTime, "id">];
}

interface ISubjectPayload extends SubjectIndex {
	property: keyof Omit<ISubject, "times">;
	value: ISubject[keyof Omit<ISubject, "times">];
}

type SubjectIndex = Omit<ISubject, "times" | "teacher"> & {teacher: number};

interface SchedulePageState {
	subjects: ISubject[];
	currentDay: WEEKDAY;
	currentWeek: WEEK_TYPE;
	editMode: "create" | "edit" | undefined;
}

const today = new Date();
const initialState: SchedulePageState = {
	editMode: undefined,
	subjects: [],
	currentDay: today.getDay() === 0 ? 7 : today.getDay(),
	currentWeek: GetWeekType(today)
};

export const actions = {
	// View actions
	setWeekday: createAction<WEEKDAY>("setWeekday"),
	setWeekType: createAction<WEEK_TYPE>("setWeekType"),
	toggleWeekType: createAction("toggleWeekType"),
	// Editing actions
	toggleEditing: createAction<"create" | "edit" | undefined>("toggleEditing"),
	// Schedule actions
	setSchedule: createAction<ISubject[]>("setSchedule"),
	addSubject: createAction<ISubject>("addSubject"),
	deleteSubject: createAction<SubjectIndex>("deleteSubject"),
	updateSubject: createAction<ISubjectPayload>("updateSubject"),
	// Attend time actions
	addAttendTime: createAction<{value: IAttendTime} & Omit<ISubject, "times">>(
		"addAttendTime"
	),
	deleteAttendTime: createAction<number>("deleteAttendTime"),
	updateAttendTime: createAction<IAttendTimePayload>("updateAttendTime")
};

/**
 *	Helper that creates callback for array `find` method to find subject
 *	@param teacherId - The identifier of teacher
 *	@param type - Subject's type
 *	@param title - Subject's title
 *	@returns Callback for `find` method of array
 */
const findSubjectCallback =
	(teacherId: number, type: SUBJECT_TYPE, title: string) => (s: ISubject) =>
		s.teacher.id === teacherId && s.type === type && s.title === title;

const scheduleSlice = createSlice({
	name: "schedule",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			// View actions
			.addCase(actions.setWeekday, (state, {payload}) => {
				state.currentDay = payload;
			})
			.addCase(actions.setWeekType, (state, {payload}) => {
				state.currentWeek = payload;
			})
			.addCase(actions.toggleWeekType, state => {
				state.currentWeek =
					state.currentWeek === WEEK_TYPE.WHITE
						? WEEK_TYPE.GREEN
						: WEEK_TYPE.WHITE;
			})
			// Editing actions
			.addCase(actions.toggleEditing, (state, {payload}) => {
				state.editMode = payload;
			})
			// Schedule actions
			.addCase(actions.setSchedule, (state, {payload}) => {
				state.subjects = payload;
			})
			.addCase(actions.addSubject, ({subjects}, {payload}) => {
				subjects.push(payload);
			})
			.addCase(actions.deleteSubject, ({subjects}, {payload}) => {
				const index = subjects.findIndex(
					findSubjectCallback(
						payload.teacher,
						payload.type,
						payload.title
					)
				);
				if (!index) return;
				subjects.splice(index, 1);
			})
			.addCase(actions.updateSubject, ({subjects}, {payload}) => {
				const {teacher, type, title, property, value} = payload;
				const subject = subjects.find(
					findSubjectCallback(teacher, type, title)
				);
				if (!subject) return;
				(subject[property] as ISubject[typeof property]) = value;
			})
			// Attend time actions
			.addCase(actions.addAttendTime, ({subjects}, {payload}) => {
				const {type, title, teacher, value} = payload;
				const subject = subjects.find(
					findSubjectCallback(teacher.id, type, title)
				);
				if (!subject) return;
				subject.times.push(value);
			})
			.addCase(actions.deleteAttendTime, ({subjects}, {payload}) => {
				let timeIndex = -1;
				const subject = subjects.find(s => {
					timeIndex = s.times.findIndex(t => t.id === payload);
					return timeIndex !== -1;
				});
				if (!subject) return;
				subject.times.splice(timeIndex, 1);
			})
			.addCase(actions.updateAttendTime, ({subjects}, {payload}) => {
				const {id, property, value} = payload;
				let timeIndex = -1;
				const subject = subjects.find(s => {
					timeIndex = s.times.findIndex(t => t.id === id);
					return timeIndex !== -1;
				});
				if (!subject) return;
				(subject.times[timeIndex][
					property
				] as IAttendTime[typeof property]) = value;
			});
	}
});

export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
