import {CalculateCourse} from "./Helpers";
import {
	Course,
	FACULTY,
	IAuthenticated,
	IGroup,
	ISpecialty,
	ISubject,
	IUser
} from "./types";

interface IResponse<T = any> {
	error: boolean;
	body: T;
	message?: string;
}
interface ISuccessful {
	success: boolean;
}

export default class ScheduleAPI {
	private static HOST: string =
		process.env.NODE_ENV === "development"
			? `http://${document.location.host}/api`
			: "https://www.plumpalbert.xyz/api";

	private static handleError(err: any) {
		if (process.env.NODE_ENV === "development") {
			console.error(err);
		}
		return undefined;
	}

	/**
	 * Method for fetching group's schedule
	 * @param groupId Group identifier
	 */
	static fetchSchedule = async (
		groupId: number,
		controller?: AbortController
	) => {
		const response = await fetch(
			`${ScheduleAPI.HOST}/subject?group=${groupId}`,
			{signal: controller?.signal}
		);
		const result: IResponse<Array<ISubject>> = await response.json();
		return result.body;
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
		return result.error || !result.body.success ? null : result.body.user;
	};

	/**
	 * Method for fetching specialties for selected `faculty`
	 * @param faculty Faculty to use
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

	/**
	 * Method for creating new users
	 * @param user New user to create
	 */
	static signUp = async (
		user: Omit<IUser, "id"> & IAuthenticated,
		controller?: AbortController
	) => {
		const response = await fetch(`${ScheduleAPI.HOST}/user`, {
			signal: controller?.signal,
			body: JSON.stringify({
				name: user.name,
				login: user.login,
				group_id: user.group?.id,
				password: user.password
			}),
			method: "POST"
		});
		const result: IResponse<{id: number}> = await response.json();
		if (result.error) {
			return;
		}
		return result.body.id;
	};

	/**
	 * Method for changing group of authenticated user
	 * @param group New group to set
	 */
	static changeGroup = async (
		group: IGroup,
		controller?: AbortController
	) => {
		const response = await fetch(`${ScheduleAPI.HOST}/user/group`, {
			method: "POST",
			body: JSON.stringify({group_id: group.id}),
			signal: controller?.signal
		});
		const result: IResponse<ISuccessful> = await response.json();
		return result.error ? false : result.body.success;
	};

	/**
	 * Method for logging out currently logged in user
	 *
	 * @async
	 * @param [controller] - Abort controller to cancel fetch
	 * @returns Boolean value representing success of operation
	 */
	static signOut = async (controller?: AbortController): Promise<boolean> => {
		return fetch(`${ScheduleAPI.HOST}/signout`, {
			signal: controller?.signal
		})
			.then(() => true)
			.catch(err => {
				if (process.env.NODE_ENV === "development") {
					console.log(err);
				}
				return false;
			});
	};

	/**
	 * Method for searching group by string
	 *
	 * @async
	 * @param {string} searchString - string used for search
	 * @param {AbortController} [controller] - abort controller to cancel fetch
	 */
	static searchGroup = async (
		searchString: string,
		controller?: AbortController
	) => {
		try {
			const response = await fetch(
				`${ScheduleAPI.HOST}/group?q=${searchString}`,
				{signal: controller?.signal}
			);
			const result: IResponse<IGroup[]> = await response.json();
			if (result.error) {
				return null;
			}
			let faculties: Partial<Record<FACULTY, ISpecialty[]>> = {};
			result.body.forEach(group => {
				let faculty = faculties[group.faculty];
				if (!faculty) {
					faculty = [];
				}
				const courseNumber = CalculateCourse(group.year);
				const specialtyIndex = faculty.findIndex(
					s => s.title === group.specialty
				);
				if (specialtyIndex === -1) {
					faculty.push({
						title: group.specialty,
						courses: {[courseNumber]: group.id}
					});
				} else {
					faculty[specialtyIndex].courses[courseNumber] = group.id;
				}
				faculties[group.faculty] = faculty;
			});
			return faculties;
		} catch (err) {
			if (process.env.NODE_ENV === "development") {
				console.error(err);
			}
			return {};
		}
	};

	/**
	 * Method for fetching teachers from server
	 *
	 * @async
	 * @param [controller] - abort controller to cancel fetch
	 * @returns List of teachers
	 */
	static getTeachers = async (controller?: AbortController) => {
		try {
			const response = await fetch(`${ScheduleAPI.HOST}/user/teacher`, {
				signal: controller?.signal
			});
			if (response.status !== 200) return;
			const result: IResponse<IUser[]> = await response.json();
			return result.error
				? ScheduleAPI.handleError(result.message)
				: result.body;
		} catch (err) {
			return ScheduleAPI.handleError(err);
		}
	};

	/**
	 * Method for creating new groups
	 *
	 * @async
	 * @param faculty - Group's faculty
	 * @param specialty - Group's specialty
	 * @param course - Group's course
	 * @param [abortController] - Abort controller to cancel fetch
	 */
	static createGroup = async (
		faculty: string,
		specialty: string,
		course: Course,
		abortController?: AbortController
	) => {
		try {
			const response = await fetch(`${ScheduleAPI.HOST}/group`, {
				signal: abortController?.signal,
				method: "POST",
				body: JSON.stringify({faculty, specialty, course})
			});
			if (response.status !== 200) {
				return ScheduleAPI.handleError("Request error");
			}
			const result: IResponse = await response.json();
			return result.error;
		} catch (err) {
			return ScheduleAPI.handleError(err);
		}
	};
}
