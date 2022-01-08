import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {useNavigate} from "react-router-dom";
import FAB from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
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
	const navigate = useNavigate();
	const {editMode, currentDay, currentWeek} = useSelector(selectSchedule);

	useEffect(() => {
		weekdayRefs.current[currentDay - 1]?.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center"
		});
	}, [currentDay]);

	//#region CALLBACKS
	const handleWeekdayClick = useCallback<React.MouseEventHandler<HTMLParagraphElement>>(
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

	const handleAddSubject = useCallback(() => {
		dispatch(scheduleActions.toggleEditing("create"));
		navigate("/create", {state: {createNew: true}});
	}, []);
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
					className={`weekday${currentDay === i ? " active" : ""}`}
				>
					{name}
				</p>
			);
		}
		return array;
	}, [handleWeekdayClick, currentDay]);

	const greenWeek = useMemo(() => currentWeek === WEEK_TYPE.GREEN, [currentWeek]);

	return (
		<div className="page schedule-view-page">
			<div className="schedule-view-page__week-type">
				<h2 className="week-type__text">{greenWeek ? "Зеленая неделя" : "Белая неделя"}</h2>
				<Button classes={{root: "week-type__swap-icon"}} onClick={handleSwapClick}>
					<SwapVertIcon />
				</Button>
			</div>
			<div className="schedule-view-page__days">{weekdays}</div>
			<SchedulePresenter editMode={editMode} weekType={currentWeek} weekday={currentDay} />
			{editMode && (
				<FAB
					className="schedule-view-page__fab"
					variant="circular"
					size="large"
					color="primary"
					onClick={handleAddSubject}
				>
					<AddIcon className="fab-icon" />
				</FAB>
			)}
		</div>
	);
};

export default ScheduleView;
