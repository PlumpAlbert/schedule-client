import {PayloadAction} from "@reduxjs/toolkit";
import {assert} from "console";
import subjectReducer, {
	actions as SubjectActions,
	SubjectState,
} from "../../store/schedule/subject";
import {IAttendTime} from "../../types";

type HistoryActionType =
	| ReturnType<typeof SubjectActions["deleteAttendTime"]>
	| ReturnType<typeof SubjectActions["update"]>
	| PayloadAction<
			{isCreated: true; time: IAttendTime},
			ReturnType<typeof SubjectActions["addAttendTime"]>["type"]
	  >;

export interface IEditSubjectPageStore {
	history: Array<HistoryActionType>;
	state: SubjectState;
}

export type ActionType = ReturnType<typeof SubjectActions[keyof typeof SubjectActions]>;

const reducer = (
	{history, state}: IEditSubjectPageStore,
	action: ActionType
): IEditSubjectPageStore => {
	const newState = subjectReducer(state, action);
	switch (action.type) {
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
			// Filter all edits of deleted attend time
			let newHistory: HistoryActionType[] = history.filter(a => {
				switch (a.type) {
					case "schedule/subject/addAttendTime": {
						return a.payload.time.id !== removedId;
					}
					case "schedule/subject/update": {
						return a.payload.id !== removedId;
					}
				}
			});
			const attendTime = state.times.find(({id}) => id === removedId);
			// If this attend time wasn't created by user - append delete action
			if (!attendTime?.isCreated) {
				newHistory.push(action);
			}
			return {state: newState, history: newHistory};
		}
		case "schedule/subject/updateAttendTime":
		case "schedule/subject/update": {
			// Replacing properties for each update action for attend time with ID
			// equal to `action.payload.id` in `history`
			return {
				state: newState,
				history: history.map<HistoryActionType>(oldAction => {
					if (
						oldAction.type !== "schedule/subject/update" ||
						oldAction.payload.id !== action.payload.id
					) {
						return oldAction;
					}
					return {
						type: oldAction.type,
						payload: {...oldAction.payload, ...action.payload},
					};
				}),
			};
		}
		case "schedule/subject/updateSubject": {
			// Replacing property for each update action in `history`
			const {property, value} = action.payload;
			return {
				state: newState,
				history: history.map<HistoryActionType>(oldAction => {
					if (oldAction.type !== "schedule/subject/update") return oldAction;
					return {
						type: oldAction.type,
						payload: {...oldAction.payload, [property]: value},
					};
				}),
			};
		}
		case "schedule/subject/updateAttendTimeProperty": {
			// Replacing property for each update action in `history`
			const {id, property, value} = action.payload;
			return {
				state: newState,
				history: history.map<HistoryActionType>(oldAction => {
					if (
						oldAction.type !== "schedule/subject/update" ||
						oldAction.payload.id !== id
					) {
						return oldAction;
					}
					return {
						type: oldAction.type,
						payload: {...oldAction.payload, [property]: value},
					};
				}),
			};
		}
	}
};

export default reducer;
