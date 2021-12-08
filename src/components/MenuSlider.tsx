import React, {useMemo, useState} from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import PageFooter from "./PageFooter";
import LandingPage from "../pages/LandingPage";

import "../styles/MenuSlider.scss";
import {IUser, UserType} from "../types";

interface IProps {
	showMenu: boolean;
}

function UserDataView() {
	const [user, setUser] = useState<IUser>(
		JSON.parse(sessionStorage.getItem("user") || "")
	);
	const groupName = useMemo(() => {
		const words = user.group.specialty.split(" ");
		const year = user.group.year.toString();
		return (
			words.reduce((result, word) => result + word[0].toUpperCase(), "") +
			"-" +
			year.slice(-2)
		);
	}, [user.group.specialty, user.group.year]);

	return (
		<>
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
				<p className="menu-settings__option">
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

export default ({showMenu}: IProps) => {
	const userInfo = sessionStorage.getItem("user");
	return (
		<div className={`app-menu${showMenu ? " active" : ""}`}>
			{userInfo ? <UserDataView /> : <LandingPage />}
			<PageFooter />
		</div>
	);
};
