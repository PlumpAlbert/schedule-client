import React from "react";

interface Subject {
    id: number;
    audience: string;
    type: number;
    title: string;
    time: string;
    weekday: number;
    weekType: number;
    teacher: string;
}

function SubjectView({ time, audience, title, teacher, type }: Subject) {
    let typeClass;
    switch (type) {
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
    return (
        <div className="subject-view">
            <div className={`subject-view-type ${typeClass}`} />
            <div className="subject-view-content">
                <div className="subject-view__header">
                    <span className="subject-view-time">{time}</span>
                    <span className="subject-view-location">{audience}</span>
                </div>
                <span className="subject-view-title">{title}</span>
                <span className="subject-view-teacher">{teacher}</span>
            </div>
        </div>
    );
}

export default SubjectView;
