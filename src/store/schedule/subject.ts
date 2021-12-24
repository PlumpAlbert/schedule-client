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

export type SubjectState = ISubject;

export const initialState: SubjectState = {
	type: SUBJECT_TYPE.ЛЕКЦИЯ,
	times: [],
	title: "",
	teacher: {id: 0, name: ""}
};

export const actions = {
	updateProperty: createAction<SubjectPayload>("updateSubject"),
	// Attend time actions
	addAttendTime: createAction<Omit<IAttendTime, "id">>("addAttendTime"),
	deleteAttendTime: createAction<number>("deleteAttendTime"),
	updateAttendTime: createAction<IAttendTimePayload>("updateAttendTime")
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
				state.times.push({...payload, id: Date.now()});
			})
			.addCase(actions.deleteAttendTime, (state, {payload}) => {
				const index = state.times.findIndex(t => t.id === payload);
				state.times.splice(index, 1);
			})
			.addCase(actions.updateAttendTime, (state, {payload}) => {
				const {id, property, value} = payload;
				const index = state.times.findIndex(t => t.id === id);
				(state.times[index][property] as IAttendTime[typeof property]) =
					value;
			});
	}
});

export default slice.reducer;
