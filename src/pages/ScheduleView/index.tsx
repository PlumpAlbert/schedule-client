import React, {useCallback, useEffect, useMemo, useState} from "react";
import Button from "@mui/material/IconButton";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {GetWeekdayName} from "../../Helpers";
import {ISubject} from "../../types";
import SchedulePresenter from "./SchedulePresenter";
import "../../styles/ScheduleView.scss";
import {WEEK_TYPE} from "../../types";
import {useLocation, useNavigate} from "react-router";

interface IProps {
	weekday?: number;
	weekType: WEEK_TYPE;
	setWeekType: (w: WEEK_TYPE) => void;
}

const ScheduleView = ({weekday, weekType, setWeekType}: IProps) => {
	const [currentDay, setCurrentDay] = useState(() => {
		if (weekday) return weekday;
		let day = new Date().getDay();
		return day === 0 ? 7 : day;
	});
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		navigate("#" + GetWeekdayName(currentDay));
	}, [currentDay]);

	//#region CALLBACKS
	const handleWeekdayClick = useCallback<
		React.MouseEventHandler<HTMLParagraphElement>
	>(
		({currentTarget}) => {
			const {dataset} = currentTarget;
			setCurrentDay(Number(dataset["weekday"]));
		},
		[setCurrentDay]
	);

	const handleSwapClick = useCallback<React.MouseEventHandler>(() => {
		setWeekType(
			weekType === WEEK_TYPE.GREEN ? WEEK_TYPE.WHITE : WEEK_TYPE.GREEN
		);
	}, [weekType, setWeekType]);

	const todayButtonClicked = useCallback(() => {
		let day = new Date().getDay();
		setCurrentDay(day === 0 ? 7 : day);
	}, [setCurrentDay]);
	//#endregion

	const weekdays = useMemo(() => {
		let array = [];
		for (let i = 1; i <= 7; i++) {
			let name = GetWeekdayName(i);
			array.push(
				<p
					key={`weekday-${i}`}
					id={name}
					data-weekday={i}
					onClick={handleWeekdayClick}
					className={`weekday${currentDay === i ? " active" : ""}`}
				>
					{name.charAt(0).toUpperCase() + name.slice(1)}
				</p>
			);
		}
		return array;
	}, [handleWeekdayClick, currentDay]);
	const greenWeek = useMemo(() => weekType === WEEK_TYPE.GREEN, [weekType]);
	const groupId = useMemo(() => {
		const query = new URLSearchParams(location.search);
		const groupId = query.get("group");
		return groupId ? parseInt(groupId) : undefined;
	}, [location.search]);

	return (
		<div className="page schedule-view-page">
			<div className="schedule-view-page__week-type">
				<h2 className="week-type__text">
					{greenWeek ? "Зеленая неделя" : "Белая неделя"}
				</h2>
				<Button
					classes={{root: "week-type__swap-icon"}}
					onClick={handleSwapClick}
				>
					<SwapVertIcon />
				</Button>
			</div>
			<div className="schedule-view-page__days">{weekdays}</div>
			<SchedulePresenter
				groupId={groupId}
				weekType={weekType}
				weekday={currentDay}
			/>
		</div>
	);
};

export default ScheduleView;
