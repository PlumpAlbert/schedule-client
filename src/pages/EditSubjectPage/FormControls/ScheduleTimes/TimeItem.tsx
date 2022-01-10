import React, {useCallback} from "react";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import {GetWeekdayName, renderTime} from "../../../../Helpers";
import SwipeAction from "../../../../components/SwipeAction";
import {IAttendTime} from "../../../../types";

interface ITimeProps extends IAttendTime {
	className: string;
	onDelete: (time: IAttendTime) => void;
	onClick: (time: IAttendTime) => void;
}

const TimeItem = ({className, onDelete, onClick, ...time}: ITimeProps) => {
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
					<span className="right-content__time">{renderTime(time.time)}</span>
					<span className="right-content__dummy"></span>
				</div>
			</ListItem>
		</SwipeAction>
	);
};

export default TimeItem;
