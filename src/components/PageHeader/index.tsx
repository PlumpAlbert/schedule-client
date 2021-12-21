import React, {useEffect, useMemo, useReducer} from "react";
import {useLocation} from "react-router";
import AppBar from "@mui/material/AppBar";
import Icon from "@mui/material/Icon";
import BackIcon from "@mui/icons-material/NavigateBefore";
import MenuIcon from "@mui/icons-material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Check";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import SearchInput, {SearchDisplayType} from "./SearchInput";
import "../../styles/PageHeader.scss";

interface IProps {
	onMenuClick?: React.MouseEventHandler;
	onTodayClick?: React.MouseEventHandler;
	onBackClick?: React.MouseEventHandler;
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
type CombinedAction = Action<Action<any>[]> & {type: "COMBINED"};

enum LeftIcon {
	NONE = 0,
	MENU,
	BACK,
	CANCEL
}
enum RightIcon {
	NONE = 0,
	SEARCH,
	TODAY,
	SAVE
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
		leftIcon: LeftIcon.MENU,
		rightIcon: RightIcon.NONE
	});
	const location = useLocation();

	useEffect(() => {
		let action: CombinedAction = {type: "COMBINED", payload: []};
		if (!menuIsShown) {
			action.payload.push({
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: SearchDisplayType.NONE
			});
		} else if (state.searchValue) {
			action.payload.push({
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: SearchDisplayType.FULL
			});
		} else {
			action.payload.push({
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: SearchDisplayType.ICON
			});
		}
		const uri = location.pathname.split("/");
		// Matches root path
		if (uri.length === 1) {
			action.payload.push({
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: state.searchValue
					? SearchDisplayType.FULL
					: SearchDisplayType.ICON
			});
		} else {
			switch (uri[1]) {
				case "groups": {
					if (uri[2]) {
						action.payload.push({
							type: "SET-LEFT_ICON",
							payload: LeftIcon.BACK
						});
					} else {
						action.payload.push({
							type: "SET-LEFT_ICON",
							payload: LeftIcon.MENU
						});
						action.payload.push({
							type: "SET-RIGHT_ICON",
							payload: RightIcon.NONE
						});
					}
					break;
				}
				case "schedule": {
					action.payload.push({
						type: "SET-RIGHT_ICON",
						payload: RightIcon.TODAY
					});
					break;
				}
				case "subject": {
					action.payload.push(
						{
							type: "SET-LEFT_ICON",
							payload: LeftIcon.CANCEL
						},
						{
							type: "SET-RIGHT_ICON",
							payload: RightIcon.SAVE
						}
					);
					break;
				}
				default: {
					action.payload.push({
						type: "SET-SEARCH_DISPLAY_TYPE",
						payload: SearchDisplayType.NONE
					});
					action.payload.push({
						type: "SET-LEFT_ICON",
						payload: LeftIcon.MENU
					});
					break;
				}
			}
		}
		dispatch(action);
	}, [menuIsShown, location.pathname]); // eslint-disable-line

	const leftSideIcon = useMemo(() => {
		switch (state.leftIcon) {
			case LeftIcon.MENU: {
				return (
					<Icon
						onClick={onMenuClick}
						classes={{
							root: "page-header__icon left-icon menu-icon"
						}}
					>
						<MenuIcon />
					</Icon>
				);
			}
			case LeftIcon.BACK: {
				return (
					<Icon
						onClick={onBackClick}
						classes={{
							root: "page-header__icon left-icon back-icon"
						}}
					>
						<BackIcon />
					</Icon>
				);
			}
			case LeftIcon.CANCEL: {
				return (
					<Icon
						onClick={onBackClick}
						classes={{
							root: "page-header__icon left-icon menu-icon"
						}}
					>
						<CancelIcon />
					</Icon>
				);
			}
			default:
				return null;
		}
	}, [onMenuClick, state.leftIcon]);

	const rightSideIcon = useMemo(() => {
		switch (state.rightIcon) {
			case RightIcon.NONE: {
				return null;
			}
			case RightIcon.SEARCH: {
				return (
					<SearchInput
						value={state.searchValue}
						dispatch={dispatch}
						variant={state.searchDisplayType}
					/>
				);
			}
			case RightIcon.TODAY: {
				return (
					<Icon onClick={onTodayClick}>
						<CalendarTodayIcon
							classes={{
								root: "page-header__icon right-icon calendar-icon"
							}}
						/>
					</Icon>
				);
			}
			case RightIcon.SAVE: {
				return (
					<Icon onClick={onSaveClick}>
						<SaveIcon
							classes={{
								root: "page-header__icon right-icon calendar-icon"
							}}
						/>
					</Icon>
				);
			}
		}
	}, [
		onTodayClick,
		dispatch,
		state.rightIcon,
		state.searchValue,
		state.searchDisplayType
	]);

	const isScrolled = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0
	});

	return (
		<AppBar elevation={isScrolled ? 3 : 0} className="page-header">
			{leftSideIcon}
			{rightSideIcon}
		</AppBar>
	);
}

export default PageHeader;
