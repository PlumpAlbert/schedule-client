import React, {useCallback} from "react";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import {CoreSubject, SUBJECT_TYPE} from "../../types";

import "./SubjectView.scss";
import {renderTime} from "../../Helpers";
import SwipeAction from "../../components/SwipeAction";

interface ILoadable {
	loading?: boolean;
}

interface IProps {
	isEditable?: boolean;
	type?: SUBJECT_TYPE;
	value?: CoreSubject;
	onClick?: (s: CoreSubject) => void;
	onDelete?: (s: CoreSubject) => void;
}

function SubjectView({
	onClick = undefined,
	onDelete = undefined,
	loading = false,
	isEditable,
	value,
	type = value?.type,
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
			if (!isEditable) return;
			if (onClick && value) {
				onClick(value);
			}
		},
		[onClick, value, isEditable]
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
						<span className="subject-view-time">{renderTime(value?.time)}</span>
						<span className="subject-view-location">
							{value && SUBJECT_TYPE[value.type]} в {value?.audience}
						</span>
					</div>
					<span className="subject-view-title">{value?.title}</span>
					<span className="subject-view-teacher">{value?.teacher?.name}</span>
				</div>
			</SwipeAction>
		</ListItem>
	);
}

export default SubjectView;
