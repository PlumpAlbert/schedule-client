import React, {useMemo, useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import GroupSelectDialog from "./GroupSelectDialog";
import {IGroup, IUser, UserType} from "../../../types";
import ScheduleAPI from "../../../API";
import {actions as appActions} from "../../../store/app";
import {actions as scheduleActions} from "../../../store/schedule";
import {useDispatch} from "../../../store";

interface IProps {
	user: IUser;
	onGroupChange: (group: IGroup) => void;
}

function UserView({user, onGroupChange}: IProps) {
	const [dialogOpened, setDialogOpened] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const groupName = useMemo(() => {
		if (!user.group) return "";
		const words = user.group.specialty.split(" ");
		const year = user.group.year.toString();
		return (
			words.reduce((result, word) => result + word[0].toUpperCase(), "") +
			"-" +
			year.slice(-2)
		);
	}, [user.group]);

	const handleGroupChange = useCallback(
		group => {
			onGroupChange(group);
			dispatch(appActions.setUserGroup(group));
			setDialogOpened(false);
		},
		[onGroupChange, dispatch]
	);
	const handleEditGroupClick = useCallback(() => {
		setDialogOpened(true);
	}, [setDialogOpened]);

	const handleSignOutClick = useCallback(() => {
		ScheduleAPI.signOut().then(() => {
			dispatch(appActions.signOut());
			navigate("/");
		});
	}, [dispatch]);

	const handleEditScheduleClick = useCallback(() => {
		dispatch(scheduleActions.toggleEditing());
	}, [dispatch]);

	return (
		<div className="app-menu__content">
			{user.group && (
				<GroupSelectDialog
					open={dialogOpened}
					onClose={handleGroupChange}
					{...user.group}
				/>
			)}
			<div className="menu-header">
				<h1 className="app-title">Расписание ЛГТУ</h1>
				<div className="user-info">
					<img
						src="/assets/user.png"
						alt="user-avatar"
						className="user-pic"
					/>
					<h2 className="user-name">{user.name}</h2>
					<p className="user-group">{groupName}</p>
				</div>
			</div>
			<div className="menu-settings">
				<h3 className="menu-settings__header">Настройки</h3>
				{user.type === UserType.ADMIN && (
					<p
						className="menu-settings__option"
						onClick={handleEditScheduleClick}
					>
						<EditIcon classes={{root: "option__icon"}} />
						<span className="option__text">
							Редактировать расписание
						</span>
					</p>
				)}
				<p
					className="menu-settings__option"
					onClick={handleEditGroupClick}
				>
					<ManageAccountsIcon classes={{root: "option__icon"}} />
					<span className="option__text">Изменить группу</span>
				</p>
				<p
					className="menu-settings__option"
					onClick={handleSignOutClick}
				>
					<LogoutIcon classes={{root: "option__icon"}} />
					<span className="option__text">Выйти</span>
				</p>
			</div>
		</div>
	);
}

export default UserView;
