import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from ".";
import {ISubject} from "../types";

type ScheduleState = ISubject[];

const initialState: ScheduleState = [];

interface ISubjectPayload<T> {
	id: number;
	property: keyof ISubject;
	value: T;
}

export const scheduleSlice = createSlice({
	name: "schedule",
	initialState,
	reducers: {
		setSchedule: (_, action: PayloadAction<ISubject[]>) => {
			return action.payload;
		},
		addSubject: (state, action: PayloadAction<ISubject>) => {
			return [...state, action.payload];
		},
		deleteSubject: (state, action: PayloadAction<ISubject>) => {
			const index = state.findIndex(s => s.id === action.payload.id);
			return [...state.slice(0, index), ...state.slice(index + 1)];
		},
		updateSubject: <T>(
			state: ScheduleState,
			action: PayloadAction<ISubjectPayload<T>>
		) => {
			const {id, property, value} = action.payload;
			const index = state.findIndex(s => s.id === id);
			return [
				...state.slice(0, index),
				{...state[index], [property]: value},
				...state.slice(index + 1)
			];
		}
	}
});

export const {addSubject, setSchedule, deleteSubject, updateSubject} =
	scheduleSlice.actions;

export const selectSchedule = (state: RootState) => state.schedule;

export default scheduleSlice.reducer;
