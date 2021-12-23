import {createSlice, createAction, nanoid} from "@reduxjs/toolkit";
import {IUser, SUBJECT_TYPE, WEEKDAY, WEEK_TYPE} from "../../types";

export interface ISubjectTime {
	id: string;
	weekday: WEEKDAY;
	time: number;
	audience: string;
}

export interface IEditSubjectPageState {
	title: string;
	type: SUBJECT_TYPE;
	teacher: IUser;
	times: Record<WEEK_TYPE, ISubjectTime[]>;
	weekType: WEEK_TYPE;
}

export const initialState: IEditSubjectPageState = {
	title: "",
	type: SUBJECT_TYPE.ЛЕКЦИЯ,
	teacher: {id: 0, name: ""},
	times: {
		[WEEK_TYPE.WHITE]: [],
		[WEEK_TYPE.GREEN]: []
	},
	weekType: WEEK_TYPE.WHITE
};

export const actions = {
	setProperty: createAction<{
		property: keyof Omit<IEditSubjectPageState, "times" | "id">;
		value: IEditSubjectPageState[keyof Omit<
			IEditSubjectPageState,
			"times" | "id"
		>];
	}>("setProperty"),
	// Time related actions
	addTime: createAction<Omit<ISubjectTime, "id">>("addTime"),
	deleteTime: createAction<ISubjectTime>("deleteTime"),
	updateTime: createAction<{
		id: string;
		property: keyof Omit<ISubjectTime, "id">;
		value: ISubjectTime[keyof Omit<ISubjectTime, "id">];
	}>("updateTime")
};

const store = createSlice({
	name: "application/EditSubjectPage",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(actions.setProperty, (state, {payload}) => {
				const {property, value} = payload;
				(state[property] as IEditSubjectPageState[typeof property]) =
					value;
			})
			.addCase(actions.addTime, ({times, weekType}, {payload}) => {
				times[weekType].push({...payload, id: nanoid()});
			})
			.addCase(actions.deleteTime, ({times, weekType}, {payload}) => {
				const index = times[weekType].findIndex(
					t => t.id === payload.id
				);
				times[weekType].splice(index, 1);
			})
			.addCase(actions.updateTime, ({times, weekType}, {payload}) => {
				const {id, property, value} = payload;
				const time = times[weekType].find(t => t.id === id);
				if (time) {
					(time[property] as ISubjectTime[typeof property]) = value;
				}
			});
	}
});

export default store.reducer;
