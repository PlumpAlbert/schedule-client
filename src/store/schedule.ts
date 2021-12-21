import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from ".";
import {ISubject} from "../types";

type ScheduleState = ISubject[];

const initialState: ScheduleState = [];

interface ISubjectPayload {
	id: number;
	property: keyof ISubject;
	value: ISubject[keyof ISubject];
}

const actions = {
	setSchedule: createAction<ISubject[]>("setSchedule"),
	addSubject: createAction<ISubject>("addSubject"),
	deleteSubject: createAction<ISubject>("deleteSubject"),
	updateSubject: createAction<ISubjectPayload>("updateSubject")
};

export const scheduleSlice = createSlice({
	name: "schedule",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(
				actions.setSchedule,
				(_, action: PayloadAction<ISubject[]>) => {
					return action.payload;
				}
			)
			.addCase(
				actions.addSubject,
				(state, action: PayloadAction<ISubject>) => {
					state.push(action.payload);
				}
			)
			.addCase(
				actions.deleteSubject,
				(state, action: PayloadAction<ISubject>) => {
					const index = state.findIndex(
						s => s.id === action.payload.id
					);
					state.splice(index, 1);
				}
			)
			.addCase(
				actions.updateSubject,
				(
					state: ScheduleState,
					action: PayloadAction<ISubjectPayload>
				) => {
					const {id, property, value} = action.payload;
					const subject = state.find(s => s.id === id);
					if (!subject) return;
					subject[property] = value as never;
				}
			);
	}
});

export const {addSubject, setSchedule, deleteSubject, updateSubject} =
	scheduleSlice.actions;

export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
