import React, {useCallback, useRef, useState} from "react";
import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import {ISubject, SUBJECT_TYPE, WEEK_TYPE} from "../../types";

import "./SubjectView.scss";

interface ILoadable {
	loading?: boolean;
}
interface IProps extends Partial<ISubject> {
	type: SUBJECT_TYPE;
	onClick?: (s: ISubject) => void;
	onDelete?: (s: Partial<ISubject>) => void;
}

function renderTime(time: Date = new Date()) {
	const endTime = new Date(time.valueOf());
	endTime.setHours(endTime.getHours() + 1);
	endTime.setMinutes(endTime.getMinutes() + 30);
	let locale = "ru";
	if (navigator.languages.length > 1) {
		locale = navigator.languages[1];
	}
	return `${time.toLocaleTimeString(locale, {
		hour: "2-digit",
		minute: "2-digit"
	})} - ${endTime.toLocaleTimeString(locale, {
		hour: "2-digit",
		minute: "2-digit"
	})}`;
}

const TOUCH_TIME_THRESHOLD = 150;

function SubjectView({
	onClick = undefined,
	onDelete = undefined,
	loading = false,
	...subject
}: IProps & ILoadable) {
	let typeClass;
	switch (subject.type) {
		case 0:
			typeClass = "lecture";
			break;
		case 1:
			typeClass = "practice";
			break;
		case 2:
			typeClass = "lab";
			break;
	}

	const handleClick = useCallback<React.MouseEventHandler<HTMLLIElement>>(
		e => {
			e.preventDefault();
			if (onClick) {
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
			if (onDelete) onDelete(subject);
		},
		[onDelete]
	);

	//#region Touch event
	const touchesRef = useRef<React.Touch>();
	const touchStartTimeRef = useRef<number>(0);
	const [swipeX, setX] = useState(0);
	const handleSwipe = useCallback<React.TouchEventHandler<HTMLDivElement>>(
		e => {
			if (e.touches.length > 1) return;
			if (!touchesRef.current) {
				touchStartTimeRef.current = performance.now();
				touchesRef.current = e.touches[0];
				return;
			}
			const deltaX =
				e.changedTouches[0].clientX - touchesRef.current.clientX;
			setX(deltaX);
		},
		[setX]
	);
	const itemRef = useRef(null);
	const actionRef = useRef(null);
	const handleSwipeEnd = useCallback(() => {
		const touchTime = performance.now() - touchStartTimeRef.current;
		touchesRef.current = undefined;
		let actionWidth = 0;
		if (actionRef.current) {
			actionWidth = Number(
				getComputedStyle(actionRef.current).width.replace("px", "")
			);
		}
		if (touchTime < TOUCH_TIME_THRESHOLD && -swipeX > actionWidth) {
			handleDeleteClick();
			setX(0);
		} else {
			if (-swipeX > actionWidth) setX(-actionWidth);
			else setX(0);
		}
	}, [setX, swipeX, handleDeleteClick]);
	//#endregion

	return (
		<ListItem
			className={`subject-view${loading ? " loading" : ""}`}
			onClick={handleClick}
		>
			<div
				ref={itemRef}
				className="subject-view-wrapper"
				onTouchMove={handleSwipe}
				onTouchEnd={handleSwipeEnd}
				style={{transform: swipeX > 0 ? "" : `translateX(${swipeX}px)`}}
			>
				<div className={`subject-view-type ${typeClass}`} />
				<div className="subject-view-content">
					<div className="subject-view__header">
						<span className="subject-view-time">
							{renderTime(subject.time)}
						</span>
						<span className="subject-view-location">
							{subject.audience}
						</span>
					</div>
					<span className="subject-view-title">{subject.title}</span>
					<span className="subject-view-teacher">
						{subject.teacher?.name}
					</span>
				</div>
			</div>
			<div
				className="subject-view-action"
				ref={actionRef}
				onClick={handleDeleteClick}
			>
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
			</div>
		</ListItem>
	);
}

export default SubjectView;
