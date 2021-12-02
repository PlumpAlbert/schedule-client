import React, { useCallback } from "react";
import { ISubject } from "../API";
import { WEEK_TYPE } from "../types";

interface ILoadable {
    loading?: boolean;
}
interface IProps {
    id?: number;
    audience?: string;
    type: number;
    title?: string;
    time?: string;
    weekday?: number;
    weekType?: number;
    teacher?: { id: number; name: string };
    onClick?: (s: ISubject) => void;
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

    const handleClick = useCallback<React.MouseEventHandler<HTMLDivElement>>(
        e => {
            e.preventDefault();
            if (onClick) {
                onClick({
                    audience: subject.audience || "",
                    id: subject.id || -1,
                    teacher: subject.teacher || { id: -1, name: "" },
                    time: subject.time || "",
                    title: subject.title || "",
                    type: subject.type,
                    weekType: subject.weekType || WEEK_TYPE.WHITE,
                    weekday: subject.weekday || 1
                });
            }
        },
        [onClick, subject]
    );

    return (
        <div
            className={`subject-view${loading ? " loading" : ""}`}
            onClick={handleClick}
        >
            <div className={`subject-view-type ${typeClass}`} />
            <div className="subject-view-content">
                <div className="subject-view__header">
                    <span className="subject-view-time">{subject.time}</span>
                    <span className="subject-view-location">
                        {subject.audience}
                    </span>
                </div>
                <span className="subject-view-title">{subject.title}</span>
                <span className="subject-view-teacher">
                    {subject.teacher?.name}
                </span>
            </div>
        </div>
    );
}

export default SubjectView;
