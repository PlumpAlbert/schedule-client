export interface ISubject {
    id: number;
    audience: string;
    type: number;
    title: string;
    time: Date;
    weekday: number;
    weekType: number;
    teacher: {
        id: number;
        name: string;
    };
}

interface IResponse<T = any> {
    error: boolean;
    body: T;
    message?: string;
}

export default class ScheduleAPI {
    private static HOST: string = "http://www.plumpalbert.xyz";
    /**
     * Method for fetching group's schedule
     * @param groupId Group identifier
     * @returns
     */
    static fetchSchedule = async (groupId: number) => {
        const response = await fetch(
            `${ScheduleAPI.HOST}/subject?group=${groupId}`
        );
        const result: IResponse<
            Array<Omit<ISubject, "time"> & { time: string }>
        > = await response.json();
        return result.body.map(s => ({
            ...s,
            time: new Date(`1999-01-13T${s.time}`)
        }));
    };
}
