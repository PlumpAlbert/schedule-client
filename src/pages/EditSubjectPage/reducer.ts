import {AnyAction, createAction} from "@reduxjs/toolkit";
import subjectReducer, {
	actions as SubjectActions,
	SubjectState,
	SubjectStateAttendTime,
} from "../../store/schedule/subject";

type SubjectActionType = ReturnType<
	typeof SubjectActions[keyof typeof SubjectActions]
>;

interface IState {
	history: Array<SubjectActionType>;
	state: SubjectState;
}

function shallowCompare<T>(a: T, b: T) {
	return (Object.keys(a) as Array<keyof T>).every(key => a[key] === b[key]);
}

const reducer = ({history, state}: IState, action: SubjectActionType) => {
	const newState = subjectReducer(state, action);
	switch (action.type) {
		case "schedule/subject/update":
		case "schedule/subject/updateSubject": {
			break;
		}
		case "schedule/subject/deleteAttendTime": {
			// If we delete object that was previosly created - we need to delete
			// action with creation to prevent dummy work on server
			const attendTime = state.times.find(({id}) => id === action.payload);
			// If we found deleted time from old state and it was created by user
			if (attendTime?.isCreated) {
				// Find index in history where we inserting this attend time
				const deleteHistoryIndex = history.findIndex(
					({type, payload}) =>
						type === "schedule/subject/addAttendTime" &&
						shallowCompare(payload.time, attendTime)
				);
				return {
					state: newState,
					history: [
						...history.slice(0, deleteHistoryIndex),
						...history.slice(deleteHistoryIndex + 1),
					],
				};
			}
			break;
		}
	}
	const historyIndex = history.findIndex(a => a.type === action.type);
	if (historyIndex === -1) {
		return {state: newState, history: [...history, action]};
	}
};
