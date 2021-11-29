import React, { useState } from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

import "../styles/MenuSlider.scss";

interface IProps {
    showMenu: boolean;
}

function MenuSlider({ showMenu }: IProps) {
    const [userName, setUserName] = useState(
        window.localStorage.getItem("username")
    );

    const [userGroup, setUserGroup] = useState(
        window.localStorage.getItem("group")
    );
    const [isLoggedIn, setLoggedIn] = useState(!!userName);
    return (
        <div className={`app-menu${showMenu ? " active" : ""}`}>
            <div className="menu-header">
                <h1 className="app-title">Расписание ЛГТУ</h1>
                {isLoggedIn ? (
                    <div className="user-info">
                        <img src="none" alt="none" className="user-pic" />
                        <h2 className="user-name">
                            {userName ? userName : "No name"}
                        </h2>
                        <p className="user-group">{userGroup}</p>
                    </div>
                ) : (
                    <p className="app-description">
                        Оставь вопросы о том, какая сейчас пара в прошлом! С
                        этим приложением расписание твоей группы всегда у тебя
                        под рукой!
                    </p>
                )}
                <TextField
                    className="app-search-field"
                    placeholder="Найти расписание"
                    InputProps={{
                        classes: {
                            root: "app-search-field__input"
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </div>
            <div className="menu-body">
                {isLoggedIn ? (
                    <div className="menu-settings">
                        <h3 className="menu-settings__header">Настройки</h3>
                        <p className="menu-settings__option">
                            <ManageAccountsIcon
                                classes={{ root: "option__icon" }}
                            />
                            <span className="option__text">
                                Изменить группу
                            </span>
                        </p>
                        <p className="menu-settings__option">
                            <LogoutIcon classes={{ root: "option__icon" }} />
                            <span className="option__text">Выйти</span>
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="app-signup__header">
                            Надоело искать свою группу?
                        </h2>
                        <p className="app-signup__text">
                            Зарегистрируйся в приложении и смотри расписание
                            своей группы без необходимости поиска!
                        </p>
                        <Button className="app-signup-btn">Регистрация</Button>
                        <p className="app-signup__signin-text">
                            Уже есть аккаунт?
                        </p>
                        <Button className="app-signup-btn app-signin-btn">
                            Вход
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default MenuSlider;
