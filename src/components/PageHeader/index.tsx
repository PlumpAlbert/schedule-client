import React, {useEffect, useMemo, useReducer} from "react";
import {useLocation} from "react-router";
import Icon from "@mui/material/Icon";
import BackIcon from "@mui/icons-material/NavigateBefore";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchInput, {SearchDisplayType} from "./SearchInput";
import "../../styles/PageHeader.scss";

interface IProps {
	onMenuClick: React.MouseEventHandler;
	onTodayClick: React.MouseEventHandler;
	onBackClick: React.MouseEventHandler;
	menuIsShown: boolean;
}
interface IState {
	searchValue: string;
	searchDisplayType: SearchDisplayType;
	leftIcon: LeftIcon;
	rightIcon: RightIcon;
}
export interface Action<T extends any> {
	type: string;
	payload: T;
}

enum LeftIcon {
	NONE = 0,
	MENU,
	BACK
}
enum RightIcon {
	NONE = 0,
	SEARCH,
	TODAY
}

const PageHeaderReducer: React.Reducer<IState, Action<any>> = (
	state,
	action
) => {
	switch (action.type) {
		case "SET-SEARCH_VALUE":
			return {...state, searchValue: action.payload};
		case "SET-SEARCH_DISPLAY_TYPE":
			return {
				...state,
				searchDisplayType: action.payload,
				rightIcon:
					action.payload !== SearchDisplayType.NONE
						? RightIcon.SEARCH
						: state.rightIcon
			};
		case "SET-RIGHT_ICON":
			return {...state, rightIcon: action.payload};
		case "SET-LEFT_ICON":
			return {...state, leftIcon: action.payload};
		case "COMBINED":
			return (action.payload as Action<any>[]).reduce(
				(s, a) => PageHeaderReducer(s, a),
				state
			);
		default:
			return state;
	}
};

function PageHeader({
	onMenuClick,
	onTodayClick,
	onBackClick,
	menuIsShown
}: IProps) {
	const [state, dispatch] = useReducer(PageHeaderReducer, {
		searchValue: "",
		searchDisplayType: SearchDisplayType.NONE,
		leftIcon: LeftIcon.NONE,
		rightIcon: RightIcon.NONE
	});
	const location = useLocation();

	useEffect(() => {
		const uri = location.pathname.split("/");
		if (uri.length === 1) {
			dispatch({
				type: "COMBINED",
				payload: [
					{
						type: "SET-SEARCH_DISPLAY_TYPE",
						payload: state.searchValue
							? SearchDisplayType.FULL
							: SearchDisplayType.ICON
					},
					{
						type: "SET-LEFT_ICON",
						payload: LeftIcon.NONE
					}
				]
			});
		} else {
			switch (uri[1]) {
				case "groups": {
					if (uri[2]) {
						dispatch({
							type: "SET-LEFT_ICON",
							payload: LeftIcon.BACK
						});
					} else {
						dispatch({
							type: "COMBINED",
							payload: [
								{type: "SET-LEFT_ICON", payload: LeftIcon.MENU},
								{
									type: "SET-RIGHT_ICON",
									payload: RightIcon.NONE
								}
							]
						});
					}
					break;
				}
				default: {
					dispatch({
						type: "COMBINED",
						payload: [
							{
								type: "SET-SEARCH_DISPLAY_TYPE",
								payload: SearchDisplayType.NONE
							},
							{type: "SET-LEFT_ICON", payload: LeftIcon.MENU}
						]
					});
					break;
				}
			}
		}
	}, [location.pathname]); // eslint-disable-line

	useEffect(() => {
		if (!menuIsShown) {
			let action: Action<SearchDisplayType | Action<any>[]> = {
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: SearchDisplayType.NONE
			};
			if (location.pathname.includes("/schedule")) {
				action = {
					type: "COMBINED",
					payload: [
						action,
						{type: "SET-RIGHT_ICON", payload: RightIcon.TODAY}
					]
				};
			}
			dispatch(action);
		} else if (state.searchValue) {
			dispatch({
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: SearchDisplayType.FULL
			});
		} else {
			dispatch({
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: SearchDisplayType.ICON
			});
		}
	}, [menuIsShown, location.pathname]); // eslint-disable-line

	const leftSideIcon = useMemo(() => {
		switch (state.leftIcon) {
			case LeftIcon.MENU: {
				return (
					<Icon
						onClick={onMenuClick}
						classes={{root: "page-header__menu-icon"}}
					>
						<MenuIcon />
					</Icon>
				);
			}
			case LeftIcon.BACK: {
				return (
					<Icon
						onClick={onBackClick}
						classes={{root: "page-header__menu-icon"}}
					>
						<BackIcon />
					</Icon>
				);
			}
			default:
				return null;
		}
	}, [onMenuClick, state.leftIcon]);

	const rightSideIcon = useMemo(() => {
		switch (state.rightIcon) {
			case RightIcon.NONE:
				return null;
			case RightIcon.SEARCH:
				return (
					<SearchInput
						value={state.searchValue}
						dispatch={dispatch}
						variant={state.searchDisplayType}
					/>
				);
			case RightIcon.TODAY:
				return (
					<CalendarTodayIcon
						classes={{root: "page-header__calendar-icon"}}
						onClick={onTodayClick}
					/>
				);
		}
	}, [
		onTodayClick,
		dispatch,
		state.rightIcon,
		state.searchValue,
		state.searchDisplayType
	]);

	return (
		<div className="page-header">
			{leftSideIcon}
			{rightSideIcon}
		</div>
	);
}

export default PageHeader;
