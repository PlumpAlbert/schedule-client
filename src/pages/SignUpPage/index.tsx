import React, {useCallback, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GroupSelect, {IGroupSelect} from "./GroupSelect";
import {IAuthenticated, IGroup, IUser, UserType} from "../../types";
import ScheduleAPI from "../../API";

import "../../styles/SignUpPage.scss";

function SignUpPage() {
	const [isError, setError] = useState(false);
	const [name, setName] = useState("");
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const groupRef = useRef<IGroupSelect>();
	const navigate = useNavigate();

	//#region CALLBACKS
	const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
		e => {
			e.preventDefault();
			if (isError) {
				return;
			}
			if (!groupRef.current) {
				setError(true);
			}
			const group = groupRef.current?.getState();
			// Check if all of the fields are set
			if (
				!group ||
				!Object.keys(group).every(
					key => !!group[key as keyof IGroup]
				) ||
				!name ||
				!login ||
				!password
			) {
				setError(true);
				return;
			}
			let user: IUser & IAuthenticated = {name, login, password, group};
			const abortController = new AbortController();
			ScheduleAPI.signUp(user, abortController)
				.then(id => {
					if (!id) {
						setError(true);
						return;
					}
					user.id = id;
					user.type = UserType.STUDENT;
					sessionStorage.setItem("user", JSON.stringify(user));
					navigate(`/schedule?group=${user.group.id}`, {
						replace: true
					});
				})
				.catch(err => {
					if (!abortController.signal.aborted) {
						setError(true);
						console.error(err.message);
					}
				});
		},
		[name, login, password, isError, navigate]
	);

	const handleInputChange = useCallback<
		React.ChangeEventHandler<HTMLInputElement>
	>(
		({target}) => {
			const {name, value} = target;
			let updateFunction: React.Dispatch<React.SetStateAction<string>>;
			switch (name) {
				case "user_name":
					updateFunction = setName;
					break;
				case "user_login":
					updateFunction = setLogin;
					break;
				case "user_password":
					updateFunction = setPassword;
					break;
				default:
					return;
			}
			updateFunction(value);
		},
		[setName, setLogin, setPassword]
	);
	//#endregion

	return (
		<div className="page sign-up-page">
			<h1 className="sign-up-page__header">Расписание ЛГТУ</h1>

			<form
				className="sign-up-page__form"
				onSubmit={handleSubmit}
				method="post"
				autoComplete="off"
			>
				<TextField
					className="form-control"
					error={isError && !name}
					variant="standard"
					id="user_name"
					name="user_name"
					onChange={handleInputChange}
					value={name}
					label="ФИО:"
					helperText="Ваше настоящее имя, точно также, как написано в паспорте. Здесь нечего стесняться, все свои"
					InputProps={{
						className: "form-control__input",
						inputProps: {
							autoComplete: "new-password"
						}
					}}
					InputLabelProps={{
						className: "form-control__label",
						htmlFor: "user_name"
					}}
					FormHelperTextProps={{
						className: "form-control__helper-text"
					}}
				/>
				<TextField
					className="form-control"
					error={isError && !login}
					variant="standard"
					id="user_login"
					name="user_login"
					onChange={handleInputChange}
					value={login}
					label="Логин:"
					helperText="Уникальное имя пользователя, по которому Вы будете входить в приложение"
					InputProps={{
						className: "form-control__input",
						inputProps: {
							autoComplete: "new-password"
						}
					}}
					InputLabelProps={{
						className: "form-control__label",
						htmlFor: "user_login"
					}}
					FormHelperTextProps={{
						className: "form-control__helper-text"
					}}
				/>
				<TextField
					className="form-control"
					error={isError && !password}
					variant="standard"
					id="user_password"
					name="user_password"
					type="password"
					onChange={handleInputChange}
					value={password}
					label="Пароль:"
					helperText={
						<span>
							Рекомендуем задать сложный пароль, чтобы всякие{" "}
							<mark>керилы</mark> не смогли в будущем взломать Ваш
							аккаунт
						</span>
					}
					InputProps={{
						className: "form-control__input",
						inputProps: {
							autoComplete: "new-password"
						}
					}}
					InputLabelProps={{
						className: "form-control__label",
						htmlFor: "user_password"
					}}
					FormHelperTextProps={{
						className: "form-control__helper-text"
					}}
				/>
				<GroupSelect isError={isError} ref={groupRef} />
				<Button className="form-button" type="submit">
					Зарегистрироваться
				</Button>
			</form>
		</div>
	);
}

export default SignUpPage;
