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

    useEffect(() => {
        API.fetchSchedule(groupId || 1).then(schedule => {
            let newSchedule: Array<ISubject[]> = [];
            for (let i = WeekDay.Monday; i <= WeekDay.Sunday; i++) {
                newSchedule[i - 1] = schedule
                    .filter(v => v.weekday === i)
                    .sort((a, b) => {
                        let left = new Date("1970-01-01T" + a.time);
                        let right = new Date("1970-01-01T" + b.time);
                        return left.getTime() - right.getTime();
                    });
            }
            setSubjects(newSchedule);
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
                subjects[weekday - 1].map(
                    s =>
                        s.weekType === weekType && (
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
