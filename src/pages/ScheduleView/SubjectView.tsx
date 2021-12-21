import React, {useCallback} from "react";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import {ISubject, SUBJECT_TYPE, WEEK_TYPE} from "../../types";

import "./SubjectView.scss";
import {renderTime} from "../../Helpers";
import SwipeAction from "../../components/SwipeAction";

interface ILoadable {
	loading?: boolean;
}
interface IProps {
	isEditable?: boolean;
	type?: SUBJECT_TYPE;
	value?: ISubject;
	onClick?: (s: ISubject) => void;
	onDelete?: (s: ISubject) => void;
}

function SubjectView({
	onClick = undefined,
	onDelete = undefined,
	loading = false,
	isEditable,
	value,
	type = value?.type
}: IProps & ILoadable) {
	let typeClass;
	switch (type || value?.type) {
		case SUBJECT_TYPE.ЛЕКЦИЯ:
			typeClass = "lecture";
			break;
		case SUBJECT_TYPE.ПРАКТИКА:
			typeClass = "practice";
			break;
		case SUBJECT_TYPE.ЛАБОРАТОРНАЯ:
			typeClass = "lab";
			break;
	}

	const handleClick = useCallback<React.MouseEventHandler<HTMLLIElement>>(
		e => {
			e.preventDefault();
			if (onClick && value) {
				onClick({
					audience: value.audience || "",
					id: value.id || -1,
					teacher: value.teacher || {id: -1, name: ""},
					time: value.time || Date.now(),
					title: value.title || "",
					type: value.type,
					weekType: value.weekType || WEEK_TYPE.WHITE,
					weekday: value.weekday || 1
				});
			}
		},
		[onClick, value]
	);

	const handleDeleteClick = useCallback(
		(e?: React.MouseEvent) => {
			if (e) e.stopPropagation();
			if (onDelete && value) onDelete(value);
		},
		[onDelete, value]
	);

	return (
		<ListItem
			className={`subject-view${loading ? " loading" : ""}`}
			onClick={handleClick}
		>
			<SwipeAction
				className="subject-view"
				canSwipe={isEditable}
				onAction={handleDeleteClick}
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
				<div className={`subject-view-type ${typeClass}`} />
				<div className="subject-view-content">
					<div className="subject-view__header">
						<span className="subject-view-time">
							{renderTime(value?.time)}
						</span>
						<span className="subject-view-location">
							{value && SUBJECT_TYPE[value.type]} в{" "}
							{value?.audience}
						</span>
					</div>
					<span className="subject-view-title">{value?.title}</span>
					<span className="subject-view-teacher">
						{value?.teacher?.name}
					</span>
				</div>
			</SwipeAction>
		</ListItem>
	);
}

export default SubjectView;
