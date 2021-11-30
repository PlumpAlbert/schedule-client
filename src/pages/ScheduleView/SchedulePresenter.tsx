import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API, { ISubject } from "../../API";
import SubjectView from "../../components/SubjectView";
import { WEEK_TYPE } from "../../Types";

interface IProps {
    groupId?: number;
    weekday: number;
    weekType: WEEK_TYPE;
}

function SchedulePresenter({ groupId, weekday, weekType }: IProps) {
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [isLoading, setLoading] = useState(subjects.length === 0);

    useEffect(() => {
        API.fetchSchedule(groupId || 1).then(s => {
            setSubjects(s);
            setLoading(false);
        });
    }, []);

    return (
        <div className="schedule-view-page__schedule">
            {isLoading ? (
                <>
                    <SubjectView loading type={0} />
                    <SubjectView loading type={1} />
                    <SubjectView loading type={2} />
                </>
            ) : (
                subjects.map(s => {
                    if (s.weekday === weekday && s.weekType === weekType) {
                        return (
                            <SubjectView
                                key={`subject-view-${s.id}`}
                                id={s.id}
                                type={s.type}
                                weekType={s.weekType}
                                weekday={s.weekday}
                                audience={s.audience}
                                teacher={s.teacher.name}
                                time={s.time}
                                title={s.title}
                            />
                        );
                    }
                })
            )}
        </div>
    );
}

SchedulePresenter.propTypes = {
    groupId: PropTypes.number
};

export default SchedulePresenter;
