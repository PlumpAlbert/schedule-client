import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import API, { ISubject } from "../../API";
import SubjectView from "../../components/SubjectView";
import { WEEK_TYPE } from "../../types";

interface IProps {
    groupId?: number;
    weekday: number;
    weekType: WEEK_TYPE;
}
enum WeekDay {
    Monday = 1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

function SchedulePresenter({ groupId, weekday, weekType }: IProps) {
    const [subjects, setSubjects] = useState<Array<ISubject[]>>([]);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        API.fetchSchedule(groupId || 1).then(schedule => {
            let newSchedule: Array<ISubject[]> = [];
            for (let i = WeekDay.Monday; i <= WeekDay.Sunday; i++) {
                newSchedule[i - 1] = schedule.filter(v => v.weekday === i);
            }
            setSubjects(newSchedule);
            setLoading(false);
        });
    }, [groupId]);

    const handleSubjectClick = useCallback<(s: ISubject) => void>(
        subject => {
            navigate("/subject?id=" + subject.id, { state: { subject } });
        },
        [navigate]
    );

    return (
        <div className="schedule-view-page__schedule">
            {isLoading ? (
                <>
                    <SubjectView loading type={0} />
                    <SubjectView loading type={1} />
                    <SubjectView loading type={2} />
                </>
            ) : (
                subjects[weekday - 1].map(
                    s =>
                        s.weekType === weekType && (
                            <SubjectView
                                onClick={handleSubjectClick}
                                key={`subject-view-${s.id}`}
                                id={s.id}
                                type={s.type}
                                weekType={s.weekType}
                                weekday={s.weekday}
                                audience={s.audience}
                                teacher={s.teacher}
                                time={s.time}
                                title={s.title}
                            />
                        )
                )
            )}
        </div>
    );
}

SchedulePresenter.propTypes = {
    groupId: PropTypes.number
};

export default SchedulePresenter;
