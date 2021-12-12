import {
	Course,
	IAuthenticated,
	ISpecialty,
	ISubject,
	IUser
} from "./types";

interface IResponse<T = any> {
	error: boolean;
	body: T;
	message?: string;
}

export default class ScheduleAPI {
	private static HOST: string =
		process.env.NODE_ENV === "development"
			? "http://deer/api"
			: "https://www.plumpalbert.xyz/api";
	/**
	 * Method for fetching group's schedule
	 * @param groupId Group identifier
	 * @returns
	 */
	static fetchSchedule = async (
		groupId: number,
		controller?: AbortController
	) => {
		const response = await fetch(
			`${ScheduleAPI.HOST}/subject?group=${groupId}`,
			{signal: controller?.signal}
		);
		const result: IResponse<
			Array<Omit<ISubject, "time"> & {time: string}>
		> = await response.json();
		return result.body.map(s => ({
			...s,
			time: new Date(`1999-01-13T${s.time}`)
		}));
	};

	/**
	 * Method to authenticate user's
	 * @param login User's login
	 * @param password User's password
	 */
	static authenticate = async (
		login: string,
		password: string,
		controller?: AbortController
	) => {
		const jsonText = await fetch(`${ScheduleAPI.HOST}/auth`, {
			method: "POST",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				login,
				password
			}),
			signal: controller?.signal
		});
		const result: IResponse<{success: true; user: IUser}> =
			await jsonText.json();
		return result.error && !result.body.success ? null : result.body.user;
	};

	/**
	 * Method for fetching specialties for selected `faculty`
	 * @param {string} faculty Faculty to use
	 * @returns {ISpecialty} Array of specialties and group id's
	 */
	static fetchSpecialties = async (
		faculty: string,
		controller?: AbortController
	) => {
		const response = await fetch(
			`${ScheduleAPI.HOST}/group/specialty?faculty=${faculty}`,
			{signal: controller?.signal}
		);
		const result: IResponse<{
			[specialty: string]: {
				[courseNumber in Course]: number;
			};
		}> = await response.json();
		if (result.error) {
			return null;
		}
		return Object.keys(result.body).map<ISpecialty>(key => ({
			title: key,
			courses: result.body[key]
		}));
	};

	static signUp = async (
		user: IUser & IAuthenticated,
		controller?: AbortController
	) => {
		const response = await fetch(`${ScheduleAPI.HOST}/user`, {
			signal: controller?.signal,
			body: JSON.stringify({
				name: user.name,
				login: user.login,
				group_id: user.group.id,
				password: user.password
			}),
			method: "POST"
		});
		const result: IResponse<{id: number}> = await response.json();
		if (result.error) {
			alert(result.message);
			return;
		}
		return result.body.id;
	};
}
