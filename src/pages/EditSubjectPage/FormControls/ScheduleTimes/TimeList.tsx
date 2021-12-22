import React, {useCallback, useMemo} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import {WEEK_TYPE} from "../../../../types";
import {GetWeekdayName, renderTime} from "../../../../Helpers";
import SwipeAction from "../../../../components/SwipeAction";
import {ISubjectTime} from "../../reducer";

interface ITimeProps extends ISubjectTime {
	className: string;
	onDelete: (time: ISubjectTime) => void;
	onClick: (time: ISubjectTime) => void;
}

const Time = ({className, onDelete, onClick, ...time}: ITimeProps) => {
	const handleDelete = useCallback(() => {
		onDelete(time);
	}, [onDelete]);

	const handleClick = useCallback(() => {
		onClick(time);
	}, [onClick]);

	return (
		<SwipeAction
			key={time.id}
			className={className + "-swipe"}
			onAction={handleDelete}
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
			<ListItem className={className} onClick={handleClick}>
				<div className={className + "__left-content"}>
					<span className={"left-content__weekday"}>
						{GetWeekdayName(time.weekday)}
					</span>
					<span className="left-content__audience">
						В аудитории № {time.audience}
					</span>
				</div>
				<div className={className + "__right-content"}>
					<span className="right-content__time">
						{renderTime(time.time)}
					</span>
					<span className="right-content__dummy"></span>
				</div>
			</ListItem>
		</SwipeAction>
	);
};

interface ITimeListProps {
	weekType: WEEK_TYPE;
	times: ISubjectTime[];
	onDelete: (time: ISubjectTime) => void;
	onClick: (time: ISubjectTime) => void;
}

const TimeList = ({times, weekType, onDelete, onClick}: ITimeListProps) => {
	const timeNodes = useMemo(
		() =>
			times.map((t, i) =>
				t.weekType === weekType ? (
					<Time
						{...t}
						key={`time-list-item-${i}`}
						className="time-item"
						onDelete={onDelete}
						onClick={onClick}
					/>
				) : null
			),
		[times, onDelete, onClick]
	);

	return (
		<List className="time-list">
			{timeNodes.map(t => (
				<>
					{t}
					<Divider variant="middle" />
				</>
			))}
		</List>
	);
};

export default TimeList;
