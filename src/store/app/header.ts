import {createAction, createSlice} from "@reduxjs/toolkit";
import {RootState} from "..";

export enum LeftIcon {
	NONE = 0,
	MENU,
	BACK,
	CANCEL,
}

export enum RightIcon {
	NONE = 0,
	SEARCH,
	TODAY,
	SAVE,
}

export enum SearchDisplay {
	NONE = 0,
	FULL,
	ICON,
}

interface ApplicationHeaderState {
	title: string;
	leftIcon: LeftIcon;
	rightIcon: RightIcon;
	searchDisplay: SearchDisplay;
	searchValue: string;
	save: boolean;
}

export const initialState: ApplicationHeaderState = {
	searchValue: "",
	searchDisplay: SearchDisplay.NONE,
	leftIcon: LeftIcon.MENU,
	rightIcon: RightIcon.NONE,
	title: "",
	save: false,
};

export const actions = {
	setTitle: createAction<string>("setTitle"),
	setSearchValue: createAction<string>("setSearchValue"),
	setSearchDisplay: createAction<SearchDisplay>("setSearchDisplay"),
	setRightIcon: createAction<RightIcon>("setRightIcon"),
	setLeftIcon: createAction<LeftIcon>("setLeftIcon"),
	saveClicked: createAction<boolean>("saveClicked"),
};

const store = createSlice({
	name: "application/header",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(actions.setTitle, (state, {payload}) => {
				state.title = payload;
			})
			.addCase(actions.setSearchValue, (state, {payload}) => {
				state.searchValue = payload;
			})
			.addCase(actions.setSearchDisplay, (state, {payload}) => {
				state.searchDisplay = payload;
			})
			.addCase(actions.setLeftIcon, (state, {payload}) => {
				state.leftIcon = payload;
			})
			.addCase(actions.setRightIcon, (state, {payload}) => {
				state.rightIcon = payload;
			})
			.addCase(actions.saveClicked, (state, {payload}) => {
				state.save = payload;
			});
	},
});

export const selectAppHeader = (state: RootState) => state.application.header;

export default store.reducer;
