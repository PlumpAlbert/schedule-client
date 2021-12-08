import React, {useState} from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import PageFooter from "./PageFooter";
import LandingPage from "../pages/LandingPage";

import "../styles/MenuSlider.scss";

interface IProps {
	showMenu: boolean;
}

function MenuSlider() {
	const [userName, setUserName] = useState(
		window.localStorage.getItem("username")
	);
	const [userGroup, setUserGroup] = useState(
		window.localStorage.getItem("group")
	);

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
					<h2 className="user-name">
						{userName ? userName : "No name"}
					</h2>
					<p className="user-group">{userGroup || "Unknown group"}</p>
				</div>
			</div>
			<div className="menu-settings">
				<h3 className="menu-settings__header">Настройки</h3>
				<p className="menu-settings__option">
					<EditIcon classes={{root: "option__icon"}} />
					<span className="option__text">
						Редактировать расписание
					</span>
				</p>
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
	const userInfo = window.localStorage.getItem("user");
	return (
		<div className={`app-menu${showMenu ? " active" : ""}`}>
			{userInfo ? <MenuSlider /> : <LandingPage />}
			<PageFooter />
		</div>
	);
};
