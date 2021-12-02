import { ISubject } from "../../API";

interface IState extends Omit<ISubject, "id"> {
    id?: number;
}
export enum ACTIONS {
    setAudience = "SET_AUDIENCE",
    setTeacher = "SET_TEACHER",
    setTitle = "SET_TITLE",
    setTime = "SET_TIME",
    setType = "SET_TYPE",
    setWeekDay = "SET_WEEKDAY",
    setWeekType = "SET_WEEK-TYPE"
}
export type Action<T> = { type: ACTIONS; payload: T };

export default function reducer(state: IState, action: Action<any>): IState {
    switch (action.type) {
        case ACTIONS.setAudience: {
            return { ...state, audience: action.payload };
        }
        case ACTIONS.setTime: {
            return { ...state, time: action.payload };
        }
        case ACTIONS.setTitle: {
            return { ...state, title: action.payload };
        }
        case ACTIONS.setType: {
            return { ...state, type: action.payload };
        }
        case ACTIONS.setWeekDay: {
            return { ...state, weekday: action.payload };
        }
        case ACTIONS.setWeekType: {
            return { ...state, weekType: action.payload };
        }
        case ACTIONS.setTeacher: {
            return {
                ...state,
                teacher: {
                    id: action.payload.id,
                    name: action.payload.name
                }
            };
        }
    }
}
