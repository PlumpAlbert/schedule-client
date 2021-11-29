import React, { PureComponent } from "react";
import PageHeader from "../components/PageHeader";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { GetWeekdayName } from "../Helpers";
import "../styles/ScheduleView.scss";
import SubjectView from "../components/SubjectView";

interface IProps {
    weekType: number;
}
interface IState {
    currentDay: number;
    isLoading: boolean;
}

export default class ScheduleView extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        let day = new Date().getDay();
        this.state = {
            currentDay: day === 0 ? 7 : day,
            isLoading: true
        };
    }

    renderWeekdays = () => {
        let array = [];
        for (let i = 1; i <= 7; i++) {
            let name = GetWeekdayName(i);
            array.push(
                <p
                    key={`weekday-${i}`}
                    id={name}
                    className={`weekday${
                        this.state.currentDay === i ? " active" : ""
                    }`}
                >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </p>
            );
        }
        return array;
    };

    render = () => {
        let greenWeek = this.props.weekType === 1;
        return (
            <div className="page schedule-view-page">
                <div className="schedule-view-page__week-type">
                    <h2 className="week-type__text">
                        {greenWeek ? "Зеленая неделя" : "Белая неделя"}
                    </h2>
                    <SwapVertIcon classes={{ root: "week-type__swap-icon" }} />
                </div>
                <div className="schedule-view-page__days">
                    {this.renderWeekdays()}
                </div>
                <div className="schedule-view-page__schedule">
                    <SubjectView
                        id={1}
                        type={0}
                        weekType={this.props.weekType}
                        weekday={1}
                        audience="9-401"
                        teacher="Кургасов В.В."
                        time="shit"
                        title="Методика обучения пользователей программных систем"
                    />
                </div>
            </div>
        );
    };
}
