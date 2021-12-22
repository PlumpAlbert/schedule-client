import React, {useReducer} from "react";
import {useLocation, useNavigate} from "react-router";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import TeacherControl from "./FormControls/TeacherControl";
import ScheduleTimes from "./FormControls/ScheduleTimes";
import {useSelector} from "../../store";
import reducer, {IEditSubjectPageState, init} from "./reducer";

import "../../styles/EditSubjectPage.scss";

function EditSubjectPage() {
	const location = useLocation();
	const navigate = useNavigate();
	let subjectId: number | undefined;
	if (location.search) {
		const params = new URLSearchParams(location.search);
		subjectId = Number(params.get("id"));
	}
	const subject = useSelector<IEditSubjectPageState | undefined>(
		({schedule}) => {
			if (!subjectId) return;
			const subject = schedule.subjects.find(s => s.id === subjectId);
			if (!subject) return;
			const twins = schedule.subjects.filter(
				s =>
					s.title === subject.title &&
					s.type === subject.type &&
					s.teacher.id === subject.teacher.id
			);
			return {
				teacher: subject.teacher,
				type: subject.type,
				title: subject.title,
				times: twins.map(s => ({
					id: s.id.toString(),
					time: s.time,
					weekday: s.weekday,
					weekType: s.weekType,
					audience: s.audience
				}))
			};
		}
	);

	const [state, dispatch] = useReducer(reducer, subject, init);

	if (!subject || !subjectId) {
		navigate("/schedule", {replace: true});
		return null;
	}

	return (
		<div className="page edit-subject-page">
			<form className="edit-subject-form">
				<TitleControl
					id={subjectId}
					dispatch={dispatch}
					value={state.title}
				/>
				<TypeControl
					id={subjectId}
					dispatch={dispatch}
					value={state.type}
				/>
				<TeacherControl
					id={subjectId}
					dispatch={dispatch}
					value={state.teacher}
				/>
				<ScheduleTimes dispatch={dispatch} times={subject.times} />
			</form>
		</div>
	);
}

export default EditSubjectPage;
