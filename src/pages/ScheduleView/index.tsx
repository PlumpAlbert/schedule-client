import React, { PureComponent } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { GetWeekdayName } from "../../Helpers";
import { ISubject } from "../../API";
import SchedulePresenter from "./SchedulePresenter";
import "../../styles/ScheduleView.scss";

interface IProps {
    weekType: number;
}
interface IState {
    currentDay: number;
    isLoading: boolean;
    subjects: ISubject[];
}

export default class ScheduleView extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        let day = new Date().getDay();
        this.state = {
            currentDay: day === 0 ? 7 : day,
            isLoading: true,
            subjects: []
        };
    }

    handleWeekdayClick: React.MouseEventHandler<HTMLParagraphElement> = e => {
        const { id, dataset } = e.currentTarget;
        this.setState({
            currentDay: Number(dataset["weekday"])
        });
		document.location.hash = id;
    };

    renderWeekdays = () => {
        let array = [];
        for (let i = 1; i <= 7; i++) {
            let name = GetWeekdayName(i);
            array.push(
                <p
                    key={`weekday-${i}`}
                    id={name}
                    data-weekday={i}
                    onClick={this.handleWeekdayClick}
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
                <SchedulePresenter weekday={this.state.currentDay} />
            </div>
        );
    };
}
