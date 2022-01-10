import {createAction, createSlice} from "@reduxjs/toolkit";
import {RootState} from "..";
import ScheduleAPI from "../../API";
import {IGroup, IUser} from "../../types";
import headerReducer, {
	actions as headerActions,
	initialState as headerInitState,
	SearchDisplay,
} from "./header";

interface ApplicationState {
	showMenu: boolean;
	showFooter: boolean;
	header: ReturnType<typeof headerReducer>;
	user?: IUser;
}

const storageUser = localStorage.getItem("user");
if (storageUser) {
	ScheduleAPI.CSRFCookie();
}
const initialState: ApplicationState = {
	showMenu: false,
	showFooter: true,
	header: headerInitState,
	user: storageUser && JSON.parse(storageUser),
};

export const actions = {
	// Menu actions
	toggleMenu: createAction("toggleMenu"),
	closeMenu: createAction("closeMenu"),
	// Footer actions
	showFooter: createAction("showFooter"),
	toggleFooter: createAction("toggleFooter"),
	hideFooter: createAction("hideFooter"),
	// User actions
	setUser: createAction<IUser>("setUser"),
	setUserGroup: createAction<IGroup>("setUserGroup"),
	signOut: createAction("signOut"),
};

const store = createSlice({
	name: "application",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(actions.toggleMenu, state => {
				state.showMenu = !state.showMenu;
				if (!state.showMenu) {
					state.header.searchDisplay = SearchDisplay.NONE;
				} else {
					state.header.searchDisplay = state.header.searchValue
						? SearchDisplay.FULL
						: SearchDisplay.ICON;
				}
			})
			.addCase(actions.closeMenu, state => {
				state.showMenu = false;
				state.header.searchDisplay = SearchDisplay.NONE;
			})
			.addCase(actions.toggleFooter, state => {
				state.showFooter = !state.showFooter;
			})
			.addCase(actions.showFooter, state => {
				state.showFooter = true;
			})
			.addCase(actions.hideFooter, state => {
				state.showFooter = false;
			})
			.addCase(actions.setUser, (state, {payload}) => {
				state.user = payload;
			})
			.addCase(actions.setUserGroup, (state, {payload}) => {
				if (state.user) {
					state.user.group = payload;
				}
			})
			.addCase(actions.signOut, state => {
				state.user = undefined;
			})
			.addMatcher(
				action => {
					const actionNames = Object.keys(headerActions) as Array<keyof typeof headerActions>;
					return actionNames.some(key => headerActions[key].match(action));
				},
				(state, action) => {
					state.header = headerReducer(state.header, action);
				},
			);
	},
});

export const selectApplication = (store: RootState) => store.application;
export const selectUser = (store: RootState) => store.application.user;

export default store.reducer;
