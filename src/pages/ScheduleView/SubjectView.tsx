import React, {useCallback, useRef} from "react";
import ListItem from "@mui/material/ListItem";
import {ISubject, WEEK_TYPE} from "../../types";

interface ILoadable {
	loading?: boolean;
}
interface IProps {
	id?: number;
	audience?: string;
	type: number;
	title?: string;
	time?: Date;
	weekday?: number;
	weekType?: number;
	teacher?: {id: number; name: string};
	onClick?: (s: ISubject) => void;
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

function SubjectView({
	onClick = undefined,
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

	const swipeTouchRef = useRef<React.Touch>();
	const handleSwipe = useCallback<React.TouchEventHandler<HTMLLIElement>>(
		e => {
			if (e.touches.length > 1) return;
			if (!swipeTouchRef.current) {
				swipeTouchRef.current = e.touches[0];
				return;
			}
			const deltaX =
				e.changedTouches[0].clientX - swipeTouchRef.current.clientX;
		},
		[]
	);
	const handleSwipeEnd = useCallback(() => {
		swipeTouchRef.current = undefined;
	}, []);

	return (
		<ListItem
			className={`subject-view${loading ? " loading" : ""}`}
			onClick={handleClick}
			onTouchMove={handleSwipe}
			onTouchEnd={handleSwipeEnd}
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
		</ListItem>
	);
}

export default SubjectView;
