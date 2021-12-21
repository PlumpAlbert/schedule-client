import React, {useCallback, useMemo} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import {WEEKDAY, WEEK_TYPE} from "../../../../types";
import {GetWeekdayName, renderTime} from "../../../../Helpers";
import SwipeAction from "../../../../components/SwipeAction";

export interface ITimeItem {
	weekType: WEEK_TYPE;
	weekday: WEEKDAY;
	time: number;
	audience: string;
}
interface IProps extends ITimeItem {
	className: string;
	onDelete: () => void;
}

const Time = ({audience, time, weekday, className, onDelete}: IProps) => (
	<ListItem className={className}>
		<SwipeAction
			className={className}
			onAction={onDelete}
			action={
				<>
					<Icon
						id={`${className}-action__icon-delete`}
						className={`${className}-action__icon-delete`}
					>
						<DeleteIcon />
					</Icon>
					<label
						id={`${className}-action__icon-delete`}
						className={`${className}-action__text`}
					>
						Удалить
					</label>
				</>
			}
		>
			<div className={className + "__left-content"}>
				<span className={"left-content__weekday"}>
					{GetWeekdayName(weekday)}
				</span>
				<span className="left-content__time">{renderTime(time)}</span>
			</div>
			<div className={className + "__right-content"}>{audience}</div>
		</SwipeAction>
	</ListItem>
);

interface ITimeListProps {
	weekType: WEEK_TYPE;
	times: ITimeItem[];
	setTimes: React.Dispatch<React.SetStateAction<ITimeItem[]>>;
}
const TimeList = ({times, weekType, setTimes}: ITimeListProps) => {
	const handleItemDelete = useCallback(
		(index: number) => () => {
			setTimes([...times.slice(0, index), ...times.slice(index + 1)]);
		},
		[times, setTimes]
	);

	const timeNodes = useMemo(
		() =>
			times.map((t, i) =>
				t.weekType === weekType ? (
					<Time
						{...t}
						key={`time-list-item-${i}`}
						className="time-item"
						onDelete={handleItemDelete(i)}
					/>
				) : null
			),
		[times]
	);

	return <List className="time-list">{timeNodes}</List>;
};

export default TimeList;
