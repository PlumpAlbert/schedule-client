import {PayloadAction} from "@reduxjs/toolkit";
import subjectReducer, {
	ACTION_TYPES,
	actions as SubjectActions,
	SubjectState,
} from "../../store/schedule/subject";
import {IAttendTime, ISubject, WithID} from "../../types";
import {DisplaySubject} from "../ScheduleView/SubjectView";

type HistoryActionType = WithID<
	| ReturnType<typeof SubjectActions["deleteAttendTime"]>
	| PayloadAction<WithID<DisplaySubject>, ACTION_TYPES.addAttendTime>
	| PayloadAction<
			WithID<Partial<DisplaySubject>>,
			ACTION_TYPES.updateAttendTime
	  >
>;

export interface IEditSubjectPageStore {
	history: HistoryActionType[];
	state: SubjectState;
}

export type ActionType = ReturnType<
	typeof SubjectActions[keyof typeof SubjectActions]
>;

function updateSubjectProperty(
	newState: SubjectState,
	oldHistory: HistoryActionType[],
	data: Partial<Omit<ISubject, "times">>
): HistoryActionType[] {
	const newHistory = oldHistory.map<HistoryActionType>(oldAction => {
		switch (oldAction.type) {
			case ACTION_TYPES.deleteAttendTime: {
				return oldAction;
			}
			case ACTION_TYPES.addAttendTime: {
				return {...oldAction, payload: {...oldAction.payload, ...data}};
			}
			case ACTION_TYPES.updateAttendTime: {
				return {...oldAction, payload: {...oldAction.payload, ...data}};
			}
		}
	});
	// Search all of the attend times that was NOT updated earlier
	// and create actions for them
	return newHistory.concat(
		newState.times
			.filter(({id}) => !newHistory.find(a => a.id === id))
			.map<HistoryActionType>(time => ({
				type: ACTION_TYPES.updateAttendTime,
				id: time.id,
				payload: {...data, id: time.id},
			}))
	);
}

function updateAttendProperty(
	oldHistory: HistoryActionType[],
	data: WithID<Partial<IAttendTime>>
): HistoryActionType[] {
	const updateActionIndex = oldHistory.findIndex(
		a => a.type !== ACTION_TYPES.deleteAttendTime && a.id === data.id
	);
	// If there was no edits
	if (updateActionIndex === -1) {
		return [
			...oldHistory,
			{type: ACTION_TYPES.updateAttendTime, payload: data, id: data.id},
		];
	}
	const oldAction = oldHistory[updateActionIndex] as PayloadAction<
		Partial<DisplaySubject>
	>;
	// If current attend time was updated previously
	return [
		...oldHistory.slice(0, updateActionIndex),
		{
			type: ACTION_TYPES.updateAttendTime,
			payload: {...oldAction.payload, ...data},
			id: data.id,
		},
		...oldHistory.slice(updateActionIndex + 1),
	];
}

const reducer = (
	{history, state}: IEditSubjectPageStore,
	action: ActionType
): IEditSubjectPageStore => {
	const newState = subjectReducer(state, action);
	let newHistory: typeof history = [];
	switch (action.type) {
		// Subject actions
		case ACTION_TYPES.updateProperty: {
			const {property, value} = action.payload;
			newHistory = updateSubjectProperty(newState, history, {
				[property]: value,
			});
			break;
		}
		case ACTION_TYPES.update: {
			const {title, teacher, type, ...attendTime} = action.payload;
			newHistory = updateAttendProperty(
				updateSubjectProperty(newState, history, {title, type, teacher}),
				attendTime
			);
			break;
		}
		//
		case ACTION_TYPES.updateAttendTime: {
			newHistory = updateAttendProperty(history, action.payload);
			break;
		}
		case ACTION_TYPES.updateAttendTimeProperty: {
			const {id, property, value} = action.payload;
			newHistory = updateAttendProperty(history, {id, [property]: value});
			break;
		}
		case ACTION_TYPES.addAttendTime: {
			const {id} = newState.times[newState.times.length - 1];
			newHistory = [
				...history,
				{
					type: action.type,
					payload: {
						id,
						teacher: newState.teacher,
						title: newState.title,
						type: newState.type,
						...action.payload.time,
					},
					id,
				},
			];
			break;
		}
		case ACTION_TYPES.deleteAttendTime: {
			const id = action.payload;
			newHistory = history.filter(a => a.id !== id);
			break;
		}
	}
	return {state: newState, history: newHistory};
};

export default reducer;
