import React, {useCallback, useState} from "react";
import {AnyAction} from "@reduxjs/toolkit";
import TimeIcon from "@mui/icons-material/AddAlarmOutlined";
import Icon from "@mui/material/Icon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TimeList from "./TimeList";
import {WEEK_TYPE} from "../../../../types";
import {actions, ISubjectTime} from "../../reducer";
import AddTimeDialog from "./AddTimeDialog";

interface IProps {
	dispatch: React.Dispatch<AnyAction>;
	times: ISubjectTime[];
}

const ScheduleTimes = ({dispatch, times}: IProps) => {
	const [weekType, setWeekType] = useState(WEEK_TYPE.WHITE);
	const [showDialog, setShowDialog] = useState(false);
	const [editTime, setEditTime] = useState<ISubjectTime | undefined>();

	const handleWeekTypeChange = useCallback(
		(_, value) => void setWeekType(value),
		[setWeekType]
	);

	const toggleDialog = useCallback(
		() => void setShowDialog(!showDialog),
		[showDialog]
	);

	//#region TimeList callbacks
	const handleTimeClick = useCallback(
		(time: ISubjectTime) => {
			setEditTime(time);
			setShowDialog(true);
		},
		[setEditTime, setShowDialog]
	);

	const handleTimeDelete = useCallback(
		(time: ISubjectTime) => void dispatch(actions.deleteTime(time)),
		[dispatch]
	);
	//#endregion

	//#region AddTimeDialog callbacks
	const handleDialogClose = useCallback(
		(time?: Omit<ISubjectTime, "id">) => {
			setShowDialog(false);
			setEditTime(undefined);
			if (!time) return;
			if (editTime) {
				(Object.keys(time) as Array<keyof typeof time>).forEach(key => {
					dispatch(
						actions.updateTime({
							id: editTime.id,
							property: key,
							value: time[key]
						})
					);
				});
			} else {
				dispatch(actions.addTime(time));
			}
		},
		[dispatch, setShowDialog, editTime]
	);
	//#endregion

	return (
		<div className="schedule-times">
			<AddTimeDialog
				open={showDialog}
				onClose={handleDialogClose}
				weekType={weekType}
				value={editTime}
			/>
			<div className="schedule-times__header">
				<span className="header-title">Время проведения</span>
				<span className="header-action" onClick={toggleDialog}>
					<span className="header-action__text">Добавить</span>
					<Icon className="header-action__icon">
						<TimeIcon />
					</Icon>
				</span>
			</div>
			<Tabs
				className="schedule-times__week-type-tabs"
				value={weekType}
				onChange={handleWeekTypeChange}
				classes={{
					indicator:
						"week-type-tabs__indicator " +
						WEEK_TYPE[weekType].toLowerCase()
				}}
			>
				<Tab
					className="schedule-times__week-type white-week"
					value={WEEK_TYPE.WHITE}
					label="Белая неделя"
				/>
				<Tab
					className="schedule-times__week-type green-week"
					value={WEEK_TYPE.GREEN}
					label="Зеленая неделя"
				/>
			</Tabs>
			<TimeList
				times={times}
				onClick={handleTimeClick}
				onDelete={handleTimeDelete}
				weekType={weekType}
			/>
		</div>
	);
};

export default ScheduleTimes;
