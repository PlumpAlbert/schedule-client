import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import ScheduleAPI from "../API";

function LoginPage() {
    const [isError, setError] = useState(false);
    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        e => {
            e.preventDefault();
            const login: string = e.currentTarget.user_login.value;
            const password: string = e.currentTarget.user_password.value;
            if (!login || !password) {
                setError(true);
                return;
            }
            if (!ScheduleAPI.authenticate(login, password)) {
                setError(true);
                return;
            }
        },
        []
    );
    return (
        <div className="page login-page">
            <h1 className="application-title">Расписание ЛГТУ</h1>
            <form onSubmit={handleSubmit} method="post">
                <FormControl>
                    <InputLabel htmlFor="user_login">Логин:</InputLabel>
                    <Input id="user_login" name="user_login" />
                    <FormHelperText>
                        {isError && "Поле не должно быть пустым"}
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="user_password">Пароль:</InputLabel>
                    <Input
                        id="user_password"
                        type="password"
                        name="user_password"
                    />
                    <FormHelperText>
                        {isError && "Поле не должно быть пустым"}
                    </FormHelperText>
                </FormControl>
				<Button type='submit'>Войти</Button>
            </form>
        </div>
    );
}

LoginPage.propTypes = {};

export default LoginPage;
