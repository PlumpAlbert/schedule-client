import React, {useCallback, useEffect, useMemo} from "react";
import {AnyAction} from "@reduxjs/toolkit";
import {useLocation, useNavigate} from "react-router";
import AppBar from "@mui/material/AppBar";
import Icon from "@mui/material/Icon";
import BackIcon from "@mui/icons-material/NavigateBefore";
import MenuIcon from "@mui/icons-material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Check";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import SearchInput from "./SearchInput";
import "../../styles/PageHeader.scss";
import {
	selectAppHeader,
	SearchDisplay,
	LeftIcon,
	RightIcon,
	actions as headerActions
} from "../../store/app/header";
import {actions as scheduleActions} from "../../store/schedule";
import {actions as appActions} from "../../store/app";
import {useDispatch, useSelector} from "../../store";
import {GetWeekType} from "../../Helpers";

function PageHeader() {
	const {title, leftIcon, rightIcon, searchValue, searchDisplay} =
		useSelector(selectAppHeader);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		let actions: AnyAction[] = [];
		const uri = location.pathname.split("/");
		// Matches root path
		if (uri.length === 1) {
			actions.push(
				headerActions.setSearchDisplay(
					searchValue ? SearchDisplay.FULL : SearchDisplay.ICON
				)
			);
		} else {
			switch (uri[1]) {
				case "groups": {
					if (uri[2]) {
						actions.push(headerActions.setLeftIcon(LeftIcon.BACK));
					} else {
						actions.push(
							headerActions.setLeftIcon(LeftIcon.MENU),
							headerActions.setRightIcon(RightIcon.NONE)
						);
					}
					break;
				}
				case "schedule": {
					actions.push(headerActions.setRightIcon(RightIcon.TODAY));
					break;
				}
				case "subject": {
					actions.push(
						headerActions.setLeftIcon(LeftIcon.CANCEL),
						headerActions.setRightIcon(RightIcon.SAVE),
						headerActions.setTitle("Редактирование")
					);
					break;
				}
				default: {
					actions.push(
						headerActions.setSearchDisplay(SearchDisplay.NONE),
						headerActions.setLeftIcon(LeftIcon.MENU)
					);
					break;
				}
			}
		}
		actions.forEach(a => dispatch(a));
	}, [location.pathname, dispatch]); // eslint-disable-line

	const onSaveClick = useCallback(() => {}, []);

	const onMenuClick = useCallback(() => {
		dispatch(appActions.toggleMenu());
	}, [dispatch]);

	const onTodayClick = useCallback(() => {
		let today = new Date();
		dispatch(scheduleActions.setWeekday(today.getDay()));
		dispatch(scheduleActions.setWeekType(GetWeekType(today)));
	}, [dispatch]);

	const onBackClick = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const leftSideIcon = useMemo(() => {
		switch (leftIcon) {
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
	}, [onMenuClick, onBackClick, leftIcon]);

	const rightSideIcon = useMemo(() => {
		switch (rightIcon) {
			case RightIcon.NONE: {
				return null;
			}
			case RightIcon.SEARCH: {
				return <SearchInput />;
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
		onSaveClick,
		dispatch,
		rightIcon,
		searchValue,
		searchDisplay
	]);

	const isScrolled = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0
	});

	return (
		<AppBar elevation={isScrolled ? 3 : 0} className="page-header">
			{leftSideIcon}
			{title && <h1 className="page-header__title">{title}</h1>}
			{rightSideIcon}
		</AppBar>
	);
}

export default PageHeader;
