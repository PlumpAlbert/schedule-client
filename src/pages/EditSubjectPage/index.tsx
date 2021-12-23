import React, {useReducer} from "react";
import {useLocation, useNavigate} from "react-router";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import TeacherControl from "./FormControls/TeacherControl";
import ScheduleTimes from "./FormControls/ScheduleTimes";
import reducer, {
	IEditSubjectPageState,
	initialState,
	ISubjectTime
} from "./reducer";
import {useSelector} from "../../store";

import "../../styles/EditSubjectPage.scss";
import {WEEK_TYPE} from "../../types";

function EditSubjectPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const editMode = useSelector(store => store.schedule.editMode);

	let subjectId: number | undefined;
	if (location.search) {
		const params = new URLSearchParams(location.search);
		subjectId = Number(params.get("id"));
	}

	const initState = useSelector<IEditSubjectPageState>(({schedule}) => {
		if (!subjectId) return initialState;
		const subject = schedule.subjects.find(s => s.id === subjectId);
		if (!subject) return initialState;
		const twins = schedule.subjects.filter(
			s =>
				s.title === subject.title &&
				s.type === subject.type &&
				s.teacher.id === subject.teacher.id
		);
		let times: Record<WEEK_TYPE, ISubjectTime[]> = {
			[WEEK_TYPE.WHITE]: [],
			[WEEK_TYPE.GREEN]: []
		};
		for (let i = 0; i < twins.length; ++i) {
			const {weekType, time, id, weekday, audience} = twins[i];
			if (weekType === WEEK_TYPE.WHITE) {
				times[WEEK_TYPE.WHITE].push({
					id: id.toString(),
					time,
					weekday,
					audience
				});
			} else {
				times[WEEK_TYPE.GREEN].push({
					id: id.toString(),
					time,
					weekday,
					audience
				});
			}
		}
		return {
			weekType: subject.weekType,
			teacher: subject.teacher,
			type: subject.type,
			title: subject.title,
			times
		};
	});

	const [state, dispatch] = useReducer(reducer, initState);

	if (editMode !== "create" && !subjectId) {
		navigate("/schedule", {replace: true});
		return null;
	}

	return (
		<div className="page edit-subject-page">
			<form className="edit-subject-form">
				<TitleControl dispatch={dispatch} value={state.title} />
				<TypeControl dispatch={dispatch} value={state.type} />
				<TeacherControl dispatch={dispatch} value={state.teacher} />
				<ScheduleTimes
					dispatch={dispatch}
					value={state.times[state.weekType]}
				/>
			</form>
		</div>
	);
}

export default EditSubjectPage;
