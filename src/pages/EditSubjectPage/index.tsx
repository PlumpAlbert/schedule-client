import React, {useReducer} from "react";
import {useLocation} from "react-router";
import reducer from "./reducer";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import AudienceControl from "./FormControls/AudienceControl";
import TeacherControl from "./FormControls/TeacherControl";
import WeekTypeControl from "./FormControls/WeekTypeControl";
import WeekdayControl from "./FormControls/WeekdayControl";
import TimeControl from "./FormControls/TimeControl";
import Button from "@mui/material/Button";

import "../../styles/EditSubjectPage.scss";
import ScheduleTimes from "./FormControls/ScheduleTimes";

function EditSubjectPage() {
	const location = useLocation();
	const [state, dispatch] = useReducer(reducer, {
		audience: location.state?.subject.audience,
		teacher: location.state?.subject.teacher,
		title: location.state?.subject.title,
		time: location.state?.subject.time,
		type: location.state?.subject.type,
		weekType: location.state?.subject.weekType,
		weekday: location.state?.subject.weekday
	});

	if (!location.state) {
		document.location.replace("/schedule");
		return null;
	}
	return (
		<div className="page edit-subject-page">
			<form className="edit-subject-form">
				<TitleControl dispatch={dispatch} value={state.title} />
				<TypeControl dispatch={dispatch} value={state.type} />
				<TeacherControl dispatch={dispatch} value={state.teacher} />
				<ScheduleTimes dispatch={dispatch} weekType={state.weekType} />
				<Button className="edit-subject-form__save-btn">
					Сохранить
				</Button>
			</form>
		</div>
	);
}

export default EditSubjectPage;
