import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import PageFooter from "../components/PageFooter";
import "../styles/LandingPage.scss";

export default function LandingPage(props: any) {
    const navigate = useNavigate();
    const groupBtnClick = useCallback(() => {
        navigate("/schedule", { replace: true });
    }, [navigate]);
    const loginBtnClick = useCallback(() => {
        navigate("/login");
    }, [navigate]);
    return (
        <div className="page landing-page">
            <h1 className="app-title">Расписание ЛГТУ</h1>
            <p className="landing-page__text app-description">
                Постоянно забываешь какой предмет следующий по расписанию? С
                этим приложением расписание твоей группы всегда под рукой!
                Воспользуйся поиском интересующей группы или открой список всех
                доступных групп, нажав кнопку ниже:
            </p>
            <Button className="landing-page__btn" onClick={groupBtnClick}>
                Список групп
            </Button>
            <p className="landing-page__text">
                Надоело вечно искать свою группу? Зарегистрируйся, чтобы видеть
                только расписание своей группы
            </p>
            <Button className="landing-page__btn signup-btn">
                Регистрация
            </Button>
            <p className="landing-page__text">Уже есть аккаунт?</p>
            <Button className="landing-page__btn" onClick={loginBtnClick}>
                Вход
            </Button>
        </div>
    );
}
