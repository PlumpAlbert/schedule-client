import React, {useCallback, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Alert, {AlertColor} from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PageFooter from "../PageFooter";
import UserView from "./UserView";
import ScheduleAPI from "../../API";
import {IGroup} from "../../types";
import {useSelector} from "../../store";
import {selectUser} from "../../store/app";

import "../../styles/MenuSlider.scss";

interface IProps {
	onClose: () => void;
	onOpen: () => void;
}

interface IAlert {
	show: boolean;
	message: string;
	type: AlertColor;
}

const MenuSlider = ({onClose, onOpen}: IProps) => {
	const [alert, setAlert] = useState<IAlert>({
		show: false,
		message: "",
		type: "success",
	});
	const location = useLocation();
	const navigate = useNavigate();
	const user = useSelector(selectUser);
	const showMenu = useSelector(store => store.application.showMenu);

	useEffect(() => {
		onClose();
	}, [location.pathname]);

	const handleGroupChange = useCallback(
		(newGroup: IGroup | null) => {
			if (!user || !newGroup) return;
			user.group = newGroup;
			ScheduleAPI.changeGroup(newGroup).then(success => {
				setAlert({
					show: true,
					message: success
						? "Группа успешно изменена"
						: "Ошибка при смене группы",
					type: success ? "success" : "error",
				});
				navigate(`/schedule?group=${newGroup.id}`);
			});
		},
		[user]
	);

	const handleAlertClose = useCallback(() => {
		setAlert({
			...alert,
			show: false,
		});
	}, [setAlert, alert]);

	const [searchValue, setSearchValue] = useState("");
	const handleSearchValueChanged = useCallback(
		e => {
			setSearchValue(e.target.value);
		},
		[setSearchValue]
	);

	const handleKeyDown = useCallback(
		({key}) => {
			if ((key && key !== "Enter") || !searchValue) return;
			navigate(`/search?q=${searchValue}`);
		},
		[navigate, searchValue]
	);

	return (
		<SwipeableDrawer
			disableBackdropTransition
			disableSwipeToOpen
			elevation={0}
			classes={{
				paper: "app-menu",
			}}
			open={showMenu}
			anchor="left"
			onClose={onClose}
			onOpen={onOpen}
		>
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
						filledError: "app-menu__alert--error",
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
				<div className="app-menu__content">
					<div className="menu-header">
						<h1 className="app-title">Расписание ЛГТУ</h1>
						<TextField
							className="search-input"
							variant="standard"
							label="Найти расписание"
							placeholder="Введите название группы"
							value={searchValue}
							onChange={handleSearchValueChanged}
							onKeyPress={handleKeyDown}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" onClick={handleKeyDown}>
										<SearchIcon className="search-input__icon search-icon" />
									</InputAdornment>
								),
							}}
						/>
						<Button
							disableElevation
							variant="contained"
							className="menu-header__btn btn-groups"
							onClick={() => navigate("/groups")}
						>
							Список всех групп
						</Button>
					</div>
					<div className="menu-body">
						<div className="menu-body__text">
							<h3 className="text-header">Надоело искать свою группу?</h3>
							<span className="text-content">
								Зарегистрируйся в приложении и смотри расписание без
								необходимости поиска
							</span>
						</div>
						<Button
							disableElevation
							variant="contained"
							className="menu-body__btn btn-sign-up"
							onClick={() => navigate("/signup")}
						>
							Регистрация
						</Button>
						<Button
							disableElevation
							variant="contained"
							className="menu-body__btn btn-sign-in"
							onClick={() => navigate("/login")}
						>
							Вход
						</Button>
					</div>
				</div>
			)}
			<PageFooter />
		</SwipeableDrawer>
	);
};

export default MenuSlider;
