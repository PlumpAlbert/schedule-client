import React, {useEffect, useReducer, useRef} from "react";
import {useLocation, useNavigate} from "react-router";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import TeacherControl from "./FormControls/TeacherControl";
import ScheduleTimes from "./FormControls/ScheduleTimes";
import {
	actions as subjectActions,
	initialState,
} from "../../store/schedule/subject";
import reducer, {IEditSubjectPageStore} from "./reducer";
import {useSelector, useDispatch} from "../../store";
import {actions as scheduleActions} from "../../store/schedule";
import {WEEK_TYPE} from "../../types";
import ScheduleAPI from "../../API";
import {DisplaySubject} from "../ScheduleView/SubjectView";

import "../../styles/EditSubjectPage.scss";

function EditSubjectPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const {editMode, shouldSave} = useSelector(({application, schedule}) => ({
		editMode: schedule.editMode,
		shouldSave: application.header.save,
		initState: schedule.subjects,
	}));
	const reduxDispatch = useDispatch();

	let attendTimeId: number | undefined;
	if (location.search) {
		const params = new URLSearchParams(location.search);
		attendTimeId = Number(params.get("id"));
	}

	const initState = useSelector<IEditSubjectPageStore>(({schedule}) => {
		if (!attendTimeId) return {state: initialState, history: []};
		const subject = schedule.subjects.find(s => {
			return !!s.times.find(t => t.id === attendTimeId);
		});
		if (!subject) return {state: initialState, history: []};
		return {history: [], state: subject};
	});
	const [{state}, dispatch] = useReducer(reducer, initState);

	if (editMode !== "create" && !attendTimeId) {
		navigate("/schedule", {replace: true});
		return null;
	}

	return (
		<div className="page edit-subject-page">
			<form className="edit-subject-form">
				<TitleControl dispatch={dispatch} value={state.title} />
				<TypeControl dispatch={dispatch} value={state.type} />
				<TeacherControl dispatch={dispatch} value={state.teacher} />
				<ScheduleTimes dispatch={dispatch} value={state.times} />
			</form>
		</div>
	);
}

export default EditSubjectPage;
