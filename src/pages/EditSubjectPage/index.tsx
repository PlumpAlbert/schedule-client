import React, { useReducer } from "react";
import { useLocation } from "react-router";
import reducer from "./reducer";

import "../../styles/EditSubjectPage.scss";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import AudienceControl from "./FormControls/AudienceControl";
import TeacherControl from "./FormControls/TeacherControl";
import WeekTypeControl from "./FormControls/WeekTypeControl";

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
                <AudienceControl dispatch={dispatch} value={state.audience} />
                <TeacherControl dispatch={dispatch} value={state.teacher} />
				<WeekTypeControl dispatch={dispatch} value={state.weekType} />
            </form>
        </div>
    );
}

export default EditSubjectPage;
