import {
	useDispatch as reduxUseDispatch,
	useSelector as reduxUseSelector,
	TypedUseSelectorHook
} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import scheduleReducer from "./schedule";

const store = configureStore({
	reducer: {
		schedule: scheduleReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => reduxUseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;

export default store;
