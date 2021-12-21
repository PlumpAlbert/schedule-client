import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from ".";
import {GetWeekType} from "../Helpers";
import {ISubject, WEEKDAY, WEEK_TYPE} from "../types";

interface ScheduleState {
	subjects: ISubject[];
	weekday: WEEKDAY;
	weekType: WEEK_TYPE;
	isEditing: boolean;
}

const today = new Date();
const initialState: ScheduleState = {
	isEditing: false,
	subjects: [],
	weekday: today.getDay() === 0 ? 7 : today.getDay(),
	weekType: GetWeekType(today)
};

interface ISubjectPayload {
	id: number;
	property: keyof ISubject;
	value: ISubject[keyof ISubject];
}

export const actions = {
	// View actions
	setWeekday: createAction<WEEKDAY>("setWeekday"),
	setWeekType: createAction<WEEK_TYPE>("setWeekType"),
	toggleWeekType: createAction("toggleWeekType"),
	// Editing actions
	toggleEditing: createAction("toggleEditing"),
	// Schedule actions
	setSchedule: createAction<ISubject[]>("setSchedule"),
	addSubject: createAction<ISubject>("addSubject"),
	deleteSubject: createAction<ISubject>("deleteSubject"),
	updateSubject: createAction<ISubjectPayload>("updateSubject")
};

const scheduleSlice = createSlice({
	name: "schedule",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			// View actions
			.addCase(actions.setWeekday, (state, {payload}) => {
				state.weekday = payload;
			})
			.addCase(actions.setWeekType, (state, {payload}) => {
				state.weekType = payload;
			})
			.addCase(actions.toggleWeekType, state => {
				state.weekType =
					state.weekType === WEEK_TYPE.WHITE
						? WEEK_TYPE.GREEN
						: WEEK_TYPE.WHITE;
			})
			// Editing actions
			.addCase(actions.toggleEditing, state => {
				state.isEditing = !state.isEditing;
			})
			// Schedule actions
			.addCase(actions.setSchedule, (state, {payload}) => {
				state.subjects = payload;
			})
			.addCase(actions.addSubject, ({subjects}, {payload}) => {
				subjects.push(payload);
			})
			.addCase(actions.deleteSubject, ({subjects}, {payload}) => {
				const index = subjects.findIndex(s => s.id === payload.id);
				subjects.splice(index, 1);
			})
			.addCase(actions.updateSubject, ({subjects}, {payload}) => {
				const {id, property, value} = payload;
				const subject = subjects.find(s => s.id === id);
				if (!subject) return;
				subject[property] = value as never;
			});
	}
});

export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
