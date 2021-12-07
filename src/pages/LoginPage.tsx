import React, { useCallback, useMemo, useRef, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import ScheduleAPI from "../API";

import "../styles/LoginPage.scss";

function LoginPage() {
    const [isError, setError] = useState(false);
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        e => {
            e.preventDefault();
            const login: string = e.currentTarget.user_login.value;
            const password: string = e.currentTarget.user_password.value;
            if (!login || !password) {
                setError(true);
                return;
            }
            ScheduleAPI.authenticate(login, password).then(success => {
                if (!success) {
                    setError(true);
                    return;
                }
            });
        },
        [setError]
    );
    const handleInputChange = useCallback<
        React.ChangeEventHandler<HTMLInputElement>
    >(() => {
        if (isError) setError(false);
    }, [isError, setError]);

    const helperText: [string, string] = useMemo(() => {
        let text: [string, string] = ["", ""];
        if (isError) {
            if (loginRef.current?.value) {
                text[0] = "Неверный логин или пароль";
            } else {
                text[0] = "Поле не должно быть пустым";
            }
            if (passwordRef.current?.value) {
                text[1] = "Неверный логин или пароль";
            } else {
                text[1] = "Поле не должно быть пустым";
            }
        }
        return text;
    }, [isError]);

    return (
        <div className="page login-page">
            <h1 className="login-page__title">Расписание ЛГТУ</h1>
            <form
                className="login-page__form"
                onSubmit={handleSubmit}
                method="post"
            >
                <FormControl
                    className={`login-page__form-control ${
                        isError ? "error" : ""
                    }`}
                >
                    <InputLabel
                        className="form-control__label"
                        htmlFor="user_login"
                    >
                        Логин:
                    </InputLabel>
                    <Input
                        inputRef={loginRef}
                        className="form-control__input"
                        id="user_login"
                        name="user_login"
                        onChange={handleInputChange}
                    />
                    <FormHelperText className="form-control__helper-text">
                        {helperText[0]}
                    </FormHelperText>
                </FormControl>
                <FormControl
                    className={`login-page__form-control ${
                        isError ? "error" : ""
                    }`}
                >
                    <InputLabel
                        className="form-control__label"
                        htmlFor="user_password"
                    >
                        Пароль:
                    </InputLabel>
                    <Input
                        inputRef={passwordRef}
                        className="form-control__input"
                        id="user_password"
                        type="password"
                        name="user_password"
                        onChange={handleInputChange}
                    />
                    <FormHelperText className="form-control__helper-text">
                        {helperText[1]}
                    </FormHelperText>
                </FormControl>
                <Button className="login-page__button" type="submit">
                    Войти
                </Button>
            </form>
        </div>
    );
}

export default LoginPage;
