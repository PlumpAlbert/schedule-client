import React, {useEffect, useReducer} from "react";
import {useLocation, useNavigate} from "react-router";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import TeacherControl from "./FormControls/TeacherControl";
import ScheduleTimes from "./FormControls/ScheduleTimes";
import reducer, {
	SubjectState,
	initialState
} from "../../store/schedule/subject";
import {useSelector, useDispatch} from "../../store";
import {actions as scheduleActions} from "../../store/schedule";
import {WEEK_TYPE} from "../../types";

import "../../styles/EditSubjectPage.scss";

function EditSubjectPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const {editMode, shouldSave} = useSelector(({application, schedule}) => ({
		editMode: schedule.editMode,
		shouldSave: application.header.save,
		initState: schedule.subjects
	}));
	const reduxDispatch = useDispatch();

	let attendTimeId: number | undefined;
	if (location.search) {
		const params = new URLSearchParams(location.search);
		attendTimeId = Number(params.get("id"));
	}

	const initState = useSelector<SubjectState & {weekType: WEEK_TYPE}>(
		({schedule}) => {
			if (!attendTimeId)
				return {...initialState, weekType: WEEK_TYPE.WHITE};
			const subject = schedule.subjects.find(s => {
				return !!s.times.find(t => t.id === attendTimeId);
			});
			if (!subject) return {...initialState, weekType: WEEK_TYPE.WHITE};
			return {
				...subject,
				weekType: WEEK_TYPE.WHITE
			};
		}
	);

	const [state, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (!shouldSave) return;
		state.times[WEEK_TYPE.WHITE].map(time => {
			if (!time.isCreated) {
				(Object.keys(time) as Array<keyof typeof time>).map(key => {
					if (key === "id" || key === "isCreated") return;
				});
			}
		});
	}, [shouldSave]);

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
