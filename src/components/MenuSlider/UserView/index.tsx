import React, {useMemo, useCallback, useState} from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import GroupSelectDialog from "./GroupSelectDialog";
import {IGroup, IUser, UserType} from "../../../types";

interface IProps {
	user: IUser;
	onGroupChange: (group: IGroup) => void;
}

function UserView({user, onGroupChange}: IProps) {
	const [dialogOpened, setDialogOpened] = useState(false);
	const groupName = useMemo(() => {
		const words = user.group.specialty.split(" ");
		const year = user.group.year.toString();
		return (
			words.reduce((result, word) => result + word[0].toUpperCase(), "") +
			"-" +
			year.slice(-2)
		);
	}, [user.group.specialty, user.group.year]);

	const handleGroupChange = useCallback(group => {
		onGroupChange(group);
		setDialogOpened(false);
	}, [onGroupChange]);
	const handleEditGroupClick = useCallback(() => {
		setDialogOpened(true);
	}, [setDialogOpened]);

	return (
		<>
			<GroupSelectDialog
				open={dialogOpened}
				onClose={handleGroupChange}
				{...user.group}
			/>
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
					<p className="menu-settings__option">
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
				<p className="menu-settings__option">
					<LogoutIcon classes={{root: "option__icon"}} />
					<span className="option__text">Выйти</span>
				</p>
			</div>
		</>
	);
}

export default UserView;
