import React, {useCallback, useState} from "react";
import TimeIcon from "@mui/icons-material/AddAlarmOutlined";
import Icon from "@mui/material/Icon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TimeList, {ITimeItem} from "./TimeList";
import {WEEK_TYPE} from "../../../../types";

const ScheduleTimes = () => {
	const [weekType, setWeekType] = useState(WEEK_TYPE.WHITE);
	const [times, setTimes] = useState<ITimeItem[]>([]);

	const handleWeekTypeChange = useCallback(
		(_, value) => {
			setWeekType(value);
		},
		[setWeekType]
	);
	return (
		<div className="schedule-times">
			<div className="schedule-times__header">
				<span className="header-title">Время проведения</span>
				<span className="header-action">
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
			<TimeList times={times} setTimes={setTimes} />
		</div>
	);
};

export default ScheduleTimes;
