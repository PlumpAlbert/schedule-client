import {createAction, createSlice} from "@reduxjs/toolkit";
import {IAttendTime, ISubject, SUBJECT_TYPE} from "../../types";

interface IAttendTimePayload {
	id: number;
	property: keyof Omit<IAttendTime, "id">;
	value: IAttendTime[keyof Omit<IAttendTime, "id">];
}

type SubjectPayload = {
	property: keyof Omit<ISubject, "times">;
	value: ISubject[keyof Omit<ISubject, "times">];
};

export type SubjectStateAttendTime = IAttendTime & {isCreated?: boolean};

export type SubjectState = Omit<ISubject, "times"> & {
	times: SubjectStateAttendTime[];
};

export const initialState: SubjectState = {
	type: SUBJECT_TYPE.ЛЕКЦИЯ,
	times: [],
	title: "",
	teacher: {id: 0, name: ""},
};

type addAttendTimePayload =
	| {isCreated: true; time: Omit<IAttendTime, "id">}
	| {isCreated: false; time: IAttendTime};

export const actions = {
	updateProperty: createAction<SubjectPayload>("updateSubject"),
	// Attend time actions
	addAttendTime: createAction<addAttendTimePayload>("addAttendTime"),
	deleteAttendTime: createAction<number>("deleteAttendTime"),
	updateAttendTime: createAction<IAttendTimePayload>("updateAttendTime"),
};

export const slice = createSlice({
	name: "schedule/subject",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(actions.updateProperty, (state, {payload}) => {
				const {property, value} = payload;
				(state[property] as ISubject[typeof property]) = value;
			})
			.addCase(actions.addAttendTime, (state, {payload}) => {
				const {isCreated, time} = payload;
				const id = isCreated ? Date.now() : (time as IAttendTime).id;
				state.times.push({...time, id, isCreated});
			})
			.addCase(actions.deleteAttendTime, (state, {payload}) => {
				const index = state.times.findIndex(t => t.id === payload);
				state.times.splice(index, 1);
			})
			.addCase(actions.updateAttendTime, (state, {payload}) => {
				const {id, property, value} = payload;
				const index = state.times.findIndex(t => t.id === id);
				(state.times[index][property] as IAttendTime[typeof property]) = value;
			});
	},
});

export default slice.reducer;
