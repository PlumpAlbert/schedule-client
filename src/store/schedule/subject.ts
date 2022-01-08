import {createAction, createSlice} from "@reduxjs/toolkit";
import {hasOwnProperty} from "../../Helpers";
import {DisplaySubject} from "../../pages/ScheduleView/SubjectView";
import {IAttendTime, ISubject, SUBJECT_TYPE, WithID} from "../../types";

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
	teacher: {id: 0, name: "", login: ""}
};

type addAttendTimePayload =
	| {isCreated: true; time: Omit<IAttendTime, "id">}
	| {isCreated: false; time: IAttendTime};

export const actions = {
	update: createAction<WithID<Partial<DisplaySubject>>, "schedule/subject/update">(
		"schedule/subject/update"
	),
	updateProperty: createAction<SubjectPayload, "schedule/subject/updateSubject">(
		"schedule/subject/updateSubject"
	),
	// Attend time actions
	addAttendTime: createAction<addAttendTimePayload, "schedule/subject/addAttendTime">(
		"schedule/subject/addAttendTime"
	),
	deleteAttendTime: createAction<number, "schedule/subject/deleteAttendTime">(
		"schedule/subject/deleteAttendTime"
	),
	updateAttendTimeProperty: createAction<
		IAttendTimePayload,
		"schedule/subject/updateAttendTimeProperty"
	>("schedule/subject/updateAttendTimeProperty"),
	updateAttendTime: createAction<
		WithID<Partial<IAttendTime>>,
		"schedule/subject/updateAttendTime"
	>("schedule/subject/updateAttendTime")
};

export const slice = createSlice({
	name: "schedule/subject",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(actions.update, (state, {payload}) => {
				const {id, ...data} = payload;
				const time = state.times.find(t => t.id === id);
				// Iterate over all of updated properties
				(Object.keys(data) as Array<keyof typeof data>).forEach(key => {
					if (typeof data[key] === "undefined") return;
					// If state property was change - update it
					if (hasOwnProperty(state, key)) {
						(state[key] as any) = data[key];
					}
					// If attend time property was ask
					else if (time && hasOwnProperty(time, key)) {
						(time[key] as any) = data[key];
					}
				});
				// If attend time was created by user - untag it
				if (time?.isCreated) time.isCreated = undefined;
			})
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
			.addCase(actions.updateAttendTimeProperty, (state, {payload}) => {
				const {id, property, value} = payload;
				const index = state.times.findIndex(t => t.id === id);
				(state.times[index][property] as IAttendTime[typeof property]) = value;
			})
			.addCase(actions.updateAttendTime, (state, {payload}) => {
				const {id, ...time} = payload;
				const index = state.times.findIndex(t => t.id === id);
				state.times[index] = {...state.times[index], ...time};
			});
	}
});

export default slice.reducer;
