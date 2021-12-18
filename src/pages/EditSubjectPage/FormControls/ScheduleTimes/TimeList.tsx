import React, {useCallback, useMemo, useState} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import {WEEKDAY} from "../../../../types";
import {GetWeekdayName, renderTime} from "../../../../Helpers";
import SwipeAction from "../../../../components/SwipeAction";

export interface ITimeItem {
	weekday: WEEKDAY;
	time: Date;
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
						id="subject-view-action__icon-delete"
						className="subject-view-action__icon"
					>
						<DeleteIcon />
					</Icon>
					<label
						htmlFor="subject-view-action__icon-delete"
						className="subject-view-action__text"
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
	times: ITimeItem[];
	setTimes: React.Dispatch<React.SetStateAction<ITimeItem[]>>;
}
const TimeList = ({times, setTimes}: ITimeListProps) => {
	const handleItemDelete = useCallback(
		(index: number) => () => {
			setTimes([...times.slice(0, index), ...times.slice(index + 1)]);
		},
		[times, setTimes]
	);

	const timeNodes = useMemo(
		() =>
			times.map((t, i) => (
				<Time
					{...t}
					className="time-item"
					onDelete={handleItemDelete(i)}
				/>
			)),
		[times]
	);

	return <List className="time-list">{timeNodes}</List>;
};

export default TimeList;
