import React, {useCallback, useEffect, useState} from "react";
import Alert, {AlertColor} from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PageFooter from "../PageFooter";
import LandingPage from "../../pages/LandingPage";
import UserView from "./UserView";

import "../../styles/MenuSlider.scss";
import {IUser} from "../../types";
import ScheduleAPI from "../../API";

interface IProps {
	showMenu: boolean;
}
interface IAlert {
	show: boolean;
	message: string;
	type: AlertColor;
}

const MenuSlider = ({showMenu}: IProps) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [alert, setAlert] = useState<IAlert>({
		show: false,
		message: "",
		type: "success"
	});

	const userJson = sessionStorage.getItem("user");
	useEffect(() => {
		if (userJson) {
			setUser(JSON.parse(userJson));
		} else {
			setUser(null);
		}
	}, [userJson]);

	const handleGroupChange = useCallback(
		newGroup => {
			if (!user || !newGroup) return;
			user.group = newGroup;
			sessionStorage.setItem("user", JSON.stringify(user));
			ScheduleAPI.changeGroup(newGroup).then(success => {
				setAlert({
					show: true,
					message: success
						? "Группа успешно изменена"
						: "Ошибка при смене группы",
					type: success ? "success" : "error"
				});
			});
		},
		[user]
	);

	const handleAlertClose = useCallback(() => {
		setAlert({
			...alert,
			show: false
		});
	}, [setAlert, alert]);

	return (
		<div className={`app-menu${showMenu ? " active" : ""}`}>
			<Snackbar
				anchorOrigin={{horizontal: "center", vertical: "bottom"}}
				open={alert.show}
				autoHideDuration={3000}
				onClose={handleAlertClose}
			>
				<Alert
					className="app-menu__alert"
					classes={{
						filledSuccess: "app-menu__alert--success",
						filledError: "app-menu__alert--error"
					}}
					severity={alert.type}
					variant="filled"
					onClose={handleAlertClose}
					sx={{width: "100%"}}
				>
					{alert.message}
				</Alert>
			</Snackbar>
			{user ? (
				<UserView user={user} onGroupChange={handleGroupChange} />
			) : (
				<LandingPage />
			)}
			<PageFooter />
		</div>
	);
};

export default MenuSlider;
