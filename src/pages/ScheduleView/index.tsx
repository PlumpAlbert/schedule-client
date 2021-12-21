import React, {useCallback, useEffect, useMemo, useRef} from "react";
import Button from "@mui/material/IconButton";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {GetWeekdayName} from "../../Helpers";
import SchedulePresenter from "./SchedulePresenter";
import {WEEKDAY, WEEK_TYPE} from "../../types";
import {useDispatch, useSelector} from "../../store";
import {actions as scheduleActions, selectSchedule} from "../../store/schedule";

import "../../styles/ScheduleView.scss";

const ScheduleView = () => {
	const weekdayRefs = useRef<Array<HTMLParagraphElement | null>>([]);
	const dispatch = useDispatch();
	const {isEditing, weekday, weekType} = useSelector(selectSchedule);

	useEffect(() => {
		weekdayRefs.current[weekday - 1]?.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center"
		});
	}, [weekday]);

	//#region CALLBACKS
	const handleWeekdayClick = useCallback<
		React.MouseEventHandler<HTMLParagraphElement>
	>(
		({currentTarget}) => {
			const {dataset} = currentTarget;
			const newDay: WEEKDAY = Number(dataset["weekday"]);
			dispatch(scheduleActions.setWeekday(newDay));
		},
		[dispatch]
	);

	const handleSwapClick = useCallback<React.MouseEventHandler>(() => {
		dispatch(scheduleActions.toggleWeekType());
	}, [dispatch]);
	//#endregion

	const weekdays = useMemo(() => {
		let array = new Array(WEEKDAY.SUNDAY);
		for (let i = WEEKDAY.MONDAY; i <= WEEKDAY.SUNDAY; i++) {
			let name = GetWeekdayName(i);
			array.push(
				<p
					key={`weekday-${i}`}
					ref={ref => {
						weekdayRefs.current.push(ref);
					}}
					id={name}
					data-weekday={i}
					onClick={handleWeekdayClick}
					className={`weekday${weekday === i ? " active" : ""}`}
				>
					{name}
				</p>
			);
		}
		return array;
	}, [handleWeekdayClick, weekday]);

	const greenWeek = useMemo(() => weekType === WEEK_TYPE.GREEN, [weekType]);

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
				isEditing={isEditing}
				weekType={weekType}
				weekday={weekday}
			/>
		</div>
	);
};

export default ScheduleView;
