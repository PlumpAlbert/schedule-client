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
	type: SUBJECT_TYPE;
	value?: ISubject;
	onClick?: (s: ISubject) => void;
	onDelete?: (s: Partial<ISubject>) => void;
}

function SubjectView({
	onClick = undefined,
	onDelete = undefined,
	loading = false,
	value: subject
}: IProps & ILoadable) {
	let typeClass;
	switch (subject?.type) {
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
			if (onClick && subject) {
				onClick({
					audience: subject.audience || "",
					id: subject.id || -1,
					teacher: subject.teacher || {id: -1, name: ""},
					time: subject.time || new Date(),
					title: subject.title || "",
					type: subject.type,
					weekType: subject.weekType || WEEK_TYPE.WHITE,
					weekday: subject.weekday || 1
				});
			}
		},
		[onClick, subject]
	);

	const handleDeleteClick = useCallback(
		(e?: React.MouseEvent) => {
			if (e) e.stopPropagation();
			if (onDelete && subject) onDelete(subject);
		},
		[onDelete, subject]
	);

	return (
		<ListItem
			className={`subject-view${loading ? " loading" : ""}`}
			onClick={handleClick}
		>
			<SwipeAction
				className="subject-view"
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
							{renderTime(subject?.time)}
						</span>
						<span className="subject-view-location">
							{subject && SUBJECT_TYPE[subject.type]} в{" "}
							{subject?.audience}
						</span>
					</div>
					<span className="subject-view-title">{subject?.title}</span>
					<span className="subject-view-teacher">
						{subject?.teacher?.name}
					</span>
				</div>
			</SwipeAction>
		</ListItem>
	);
}

export default SubjectView;
