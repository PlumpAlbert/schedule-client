import React, {useMemo} from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import {IAttendTime, WEEK_TYPE} from "../../../../types";
import TimeItem from "./TimeItem";

interface ITimeListProps {
	currentWeek: WEEK_TYPE;
	times: IAttendTime[];
	onDelete: (time: IAttendTime) => void;
	onClick: (time: IAttendTime) => void;
}

const TimeList = ({currentWeek, times, onDelete, onClick}: ITimeListProps) => {
	const timeNodes = useMemo(
		() =>
			times.map(
				(t, i) =>
					t.weekType === currentWeek && (
						<>
							<TimeItem
								{...t}
								key={`time-list-item-${t.id}`}
								className="time-item"
								onDelete={onDelete}
								onClick={onClick}
							/>
							<Divider
								key={`time-list-item-divider-${i}`}
								className="time-item-divider"
								variant="middle"
							/>
						</>
					)
			),
		[currentWeek, times, onDelete, onClick]
	);

	return <List className="time-list">{timeNodes}</List>;
};

export default TimeList;
