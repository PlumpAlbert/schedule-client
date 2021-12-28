import React, {useCallback, useState} from "react";
import TimeIcon from "@mui/icons-material/AddAlarmOutlined";
import Icon from "@mui/material/Icon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TimeList from "./TimeList";
import {IAttendTime, WEEK_TYPE} from "../../../../types";
import {actions} from "../../../../store/schedule/subject";
import AddTimeDialog from "./AddTimeDialog";
import {IProps} from "..";

const ScheduleTimes = ({dispatch, value}: IProps<IAttendTime[]>) => {
	const [weekType, setWeekType] = useState(WEEK_TYPE.WHITE);
	const [showDialog, setShowDialog] = useState(false);
	const [editTime, setEditTime] = useState<IAttendTime | undefined>();

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
		(time: IAttendTime) => {
			setEditTime(time);
			setShowDialog(true);
		},
		[setEditTime, setShowDialog]
	);

	const handleTimeDelete = useCallback(
		(time: IAttendTime) => void dispatch(actions.deleteAttendTime(time.id)),
		[dispatch]
	);
	//#endregion

	//#region AddTimeDialog callbacks
	const handleDialogClose = useCallback(
		(time?: Omit<IAttendTime, "id">) => {
			setShowDialog(false);
			setEditTime(undefined);
			if (!time) return;
			if (editTime) {
				(Object.keys(time) as Array<keyof typeof time>).forEach(key => {
					dispatch(
						actions.updateAttendTimeProperty({
							id: editTime.id,
							property: key,
							value: time[key],
						})
					);
				});
			} else {
				dispatch(actions.addAttendTime(time));
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
						"week-type-tabs__indicator " + WEEK_TYPE[weekType].toLowerCase(),
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
				currentWeek={weekType}
				times={value}
				onClick={handleTimeClick}
				onDelete={handleTimeDelete}
			/>
		</div>
	);
};

export default ScheduleTimes;
