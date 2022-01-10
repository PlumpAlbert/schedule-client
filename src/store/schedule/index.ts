import {createAction, createSlice} from "@reduxjs/toolkit";
import {RootState} from "..";
import {GetWeekType} from "../../Helpers";
import subjectReducer, {actions as subjectActions} from "./subject";
import {ISubject, SUBJECT_TYPE, WEEK_TYPE, WEEKDAY} from "../../types";

type SubjectIndex = Omit<ISubject, "times" | "teacher"> & {teacher: number};

type ForwardedAction = SubjectIndex & {
	action: ReturnType<typeof subjectActions[keyof typeof subjectActions]>;
};

export type EditMode = "create" | "edit" | undefined;

interface SchedulePageState {
	currentGroup: number;
	subjects: ISubject[];
	currentDay: WEEKDAY;
	currentWeek: WEEK_TYPE;
	editMode: EditMode;
}

const today = new Date();

const initialState: SchedulePageState = {
	currentGroup: 0,
	editMode: undefined,
	subjects: [],
	currentDay: today.getDay() === 0 ? 7 : today.getDay(),
	currentWeek: GetWeekType(today),
};

export const actions = {
	// View actions
	setCurrentGroup: createAction<number>("setCurrentGroup"),
	setWeekday: createAction<WEEKDAY>("setWeekday"),
	setWeekType: createAction<WEEK_TYPE>("setWeekType"),
	toggleWeekType: createAction("toggleWeekType"),
	// Editing actions
	toggleEditing: createAction<"create" | "edit" | undefined>("toggleEditing"),
	// Schedule actions
	setSchedule: createAction<ISubject[]>("setSchedule"),
	addSubject: createAction<ISubject>("addSubject"),
	deleteSubject: createAction<SubjectIndex>("deleteSubject"),
	// Forwarded actions
	updateSubject: createAction<ForwardedAction>("schedule/updateSubject"),
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

/**
 * Reducer to perform action on single subject via `subjectReducer`
 *
 * @param state - Main state of `SchedulePage`
 * @param action - Action to be forwarded
 */
const forwardSubjectAction = <T extends {payload: ForwardedAction}>(
	{subjects}: SchedulePageState,
	{payload}: T
) => {
	const {title, type, teacher, action} = payload;
	let index = subjects.findIndex(findSubjectCallback(teacher, type, title));
	if (index === -1) return;
	subjects[index] = subjectReducer(subjects[index], action);
};

const scheduleSlice = createSlice({
	name: "schedule",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			// View actions
			.addCase(actions.setCurrentGroup, (state, {payload}) => {
				state.currentGroup = payload;
			})
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
					findSubjectCallback(payload.teacher, payload.type, payload.title)
				);
				if (index === -1) return;
				subjects.splice(index, 1);
			})
			.addCase(actions.updateSubject, forwardSubjectAction);
	},
});

export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
