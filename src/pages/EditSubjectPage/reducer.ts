import {PayloadAction} from "@reduxjs/toolkit";
import subjectReducer, {
	actions as SubjectActions,
	SubjectState,
	SubjectStateAttendTime,
} from "../../store/schedule/subject";
import {IAttendTime} from "../../types";

type HistoryActionType =
	| ReturnType<
			typeof SubjectActions[keyof Omit<typeof SubjectActions, "addAttendTime">]
	  >
	| PayloadAction<
			{isCreated: true; time: IAttendTime},
			ReturnType<typeof SubjectActions.addAttendTime>["type"]
	  >;

interface IState {
	history: Array<HistoryActionType>;
	state: SubjectState;
}

function shallowCompare<T>(a: T, b: T) {
	return (Object.keys(a) as Array<keyof T>).every(key => a[key] === b[key]);
}

const reducer = (
	{history, state}: IState,
	action: ReturnType<typeof SubjectActions[keyof typeof SubjectActions]>
) => {
	const newState = subjectReducer(state, action);
	switch (action.type) {
		case "schedule/subject/update":
		case "schedule/subject/updateSubject": {
			break;
		}
		case "schedule/subject/addAttendTime": {
			let addAction: any = action;
			if (action.payload.isCreated) {
				const newAttendTime = newState.times[newState.times.length - 1];
				addAction.payload.time.id = newAttendTime.id;
			}
			return {state: newState, history: [...history, addAction]};
		}
		case "schedule/subject/deleteAttendTime": {
			const removedId = action.payload;
			// If we delete object that was previously created - we need to delete
			// action with creation to prevent dummy work on server
			const attendTime = state.times.find(({id}) => id === removedId);
			let filteredHistory: HistoryActionType[] = [];
			if (attendTime?.isCreated) {
				// Filter all actions with this time
				filteredHistory = history.filter(a => {
					switch (a.type) {
						case "schedule/subject/addAttendTime": {
							return a.payload.time.id === removedId;
						}
						case "schedule/subject/updateAttendTime":
						case "schedule/subject/updateAttendTimeProperty": {
							return a.payload.id === removedId;
						}
					}
				});
			} else {
				// Filter all update actions with this time and append delete action
				filteredHistory = history.filter(a => {
					switch (a.type) {
						case "schedule/subject/updateAttendTime":
						case "schedule/subject/updateAttendTimeProperty": {
							return a.payload.id === removedId;
						}
					}
				});
				filteredHistory.push(action);
			}
			return {state: newState, history: filteredHistory};
			break;
		}
		case "schedule/subject/updateAttendTimeProperty": {
			let previousUpdateIndex = history.findIndex(
				h =>
					h.type === action.type &&
					h.payload.id === action.payload.id &&
					h.payload.property === action.payload.property
			);
			let newHistory = [];
			if (previousUpdateIndex !== -1) {
				newHistory = [
					...history.slice(0, previousUpdateIndex),
					action,
					...history.slice(previousUpdateIndex + 1),
				];
			} else {
				newHistory = [...history, action];
			}
			return {state: newState, history: newHistory};
		}
	}
	const historyIndex = history.findIndex(a => a.type === action.type);
	if (historyIndex === -1) {
		return {state: newState, history: [...history, action]};
	}
};
