import axios from "axios";
import {CoreSubject} from "./types";
import {
	Course,
	FACULTY,
	IAttendTime,
	IAuthenticated,
	IGroup,
	ISpecialty,
	ISubject,
	IUser,
	WithID,
} from "./types";

interface IResponse<T = any> {
	error: boolean;
	body: T;
	message: string;
}

interface ISuccessful {
	success: boolean;
}

export default class ScheduleAPI {
	private static HOST: string =
		process.env.NODE_ENV === "development"
			? "http://192.168.0.10:8080/api"
			: `${process.env.PUBLIC_URL}/api`;

	static CSRFCookie = () => axios(`${new URL(ScheduleAPI.HOST).origin}/sanctum/csrf-cookie`);

	private static getAuthorizationHeader = () => {
		const json = localStorage.getItem("access_token");
		if (!json) throw {message: "Not authenticated", error: true};
		const {expires, access_token} = JSON.parse(json);
		if (expires < Date.now()) throw {message: "Not authenticated", error: true};
		return `Bearer ${access_token}`;
	};

	/**
	 * Method for fetching group's schedule
	 * @param groupId Group identifier
	 */
	static fetchSchedule = async (groupId: number, controller?: AbortController) => {
		const response = await fetch(`${ScheduleAPI.HOST}/subject?group=${groupId}`, {
			signal: controller?.signal,
		});
		const result: IResponse<Array<ISubject>> = await response.json();
		const midnight = new Date("2000-01-01");
		return result.body.map(subject => ({
			...subject,
			times: subject.times.map(attendTime => {
				const time = new Date("2000-01-01T" + attendTime.time);
				return {...attendTime, time: time.getTime() - midnight.getTime()};
			}),
		}));
	};

	/**
	 * Method to authenticate user's
	 * @param login User's login
	 * @param password User's password
	 */
	static authenticate = async (login: string, password: string, controller?: AbortController) => {
		await ScheduleAPI.CSRFCookie();
		const response = await axios.request<
			IResponse<{
				access_token: string;
				user: IUser;
			}>
		>({
			url: `${ScheduleAPI.HOST}/user/login`,
			method: "POST",
			data: {
				login,
				password,
			},
			signal: controller?.signal,
		});
		if (response.status !== 200) return null;
		const {access_token, user} = response.data.body;
		const now = new Date();
		localStorage.setItem(
			"access_token",
			JSON.stringify({
				expires: now.setDate(now.getDate() + 1),
				access_token,
			})
		);
		localStorage.setItem(
			"user",
			JSON.stringify({
				expires: now.setDate(now.getDate() + 1),
				user,
			})
		);
		return user;
	};

	/**
	 * Method for fetching specialties for selected `faculty`
	 * @param faculty Faculty to use
	 */
	static fetchSpecialties = async (faculty: string, controller?: AbortController) => {
		const response = await axios.request<
			IResponse<{
				[specialty: string]: {
					[courseNumber in Course]: number;
				};
			}>
		>({
			url: `${ScheduleAPI.HOST}/group/specialty?faculty=${faculty}`,
			signal: controller?.signal,
		});
		const {error, body} = response.data;
		if (error) {
			return null;
		}
		return Object.keys(body).map<ISpecialty>(key => ({
			title: key,
			courses: body[key],
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
		const response = await axios.request<IResponse<{user: IUser; access_token: string}>>({
			url: `${ScheduleAPI.HOST}/user`,
			signal: controller?.signal,
			method: "POST",
			data: {
				name: user.name,
				login: user.login,
				group_id: user.group?.id,
				password: user.password,
			},
		});
		const {error, body} = response.data;
		if (error) {
			return;
		}
		const now = new Date();
		localStorage.setItem(
			"access_token",
			JSON.stringify({
				expires: now.setDate(now.getDate() + 1),
				access_token: body.access_token,
			})
		);
		localStorage.setItem(
			"user",
			JSON.stringify({
				expires: now.setDate(now.getDate() + 1),
				user: body.user,
			})
		);
		return body.user;
	};

	/**
	 * Method for updating user's information
	 * @param data data to update for user with `data.id`
	 * @returns updated user object
	 */
	static updateUser = async (
		data: WithID<Partial<IUser>>,
		controller?: AbortController
	): Promise<IUser | null> => {
		const response = await axios.request<IResponse<IUser>>({
			url: `${ScheduleAPI.HOST}/user/group`,
			method: "POST",
			data,
			signal: controller?.signal,
			headers: {
				Authorization: ScheduleAPI.getAuthorizationHeader(),
			},
		});
		const {error, body} = response.data;
		return error ? null : body;
	};

	/**
	 * Method for logging out currently logged in user
	 *
	 * @async
	 * @param [controller] - Abort controller to cancel fetch
	 * @returns Boolean value representing success of operation
	 */
	static signOut = async (controller?: AbortController): Promise<boolean> => {
		return axios
			.request<IResponse<ISuccessful>>({
				url: `${ScheduleAPI.HOST}/user/logout`,
				signal: controller?.signal,
				headers: {
					Authorization: ScheduleAPI.getAuthorizationHeader(),
				},
			})
			.then(({data}) => !data.error && data.body.success)
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
	static searchGroup = async (searchString: string, controller?: AbortController) => {
		try {
			const response = await axios.request<IResponse<Partial<Record<FACULTY, ISpecialty[]>>>>(
				{
					url: `${ScheduleAPI.HOST}/group?q=${searchString}`,
					signal: controller?.signal,
				}
			);
			const {error, body} = response.data;
			if (error) {
				return null;
			}
			return body;
		} catch (err) {
			if (process.env.NODE_ENV === "development") {
				console.error(err);
			}
			return null;
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
			const response = await axios.request<IResponse<IUser[]>>({
				url: `${ScheduleAPI.HOST}/user?type=teacher`,
				signal: controller?.signal,
				headers: {
					Authorization: ScheduleAPI.getAuthorizationHeader(),
				},
			});
			if (response.status !== 200) return;
			const {error, message, body} = response.data;
			return error ? ScheduleAPI.handleError(message) : body;
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
	static createGroup = async (group: Omit<IGroup, "id">, abortController?: AbortController) => {
		try {
			const response = await axios.request<IResponse<IGroup>>({
				url: `${ScheduleAPI.HOST}/group`,
				signal: abortController?.signal,
				method: "POST",
				data: group,
				headers: {
					Authorization: ScheduleAPI.getAuthorizationHeader(),
				},
			});
			if (response.status !== 200) {
				return ScheduleAPI.handleError(response.data);
			}
			return response.data.body;
		} catch (err) {
			return ScheduleAPI.handleError(err);
		}
	};

	/**
	 * Method for creating new attend time
	 *
	 * @async
	 * @param subject - subject object to append time to
	 * @param time - time to create on server
	 * @param [group] - id of the group that attends this subject
	 * @param [controller] - controller to abort request
	 * @returns Returns id of newly created time. Undefined on error
	 */
	static createAttendTime = async (
		subject: Omit<ISubject, "times">,
		time: Omit<IAttendTime, "id">,
		group?: number,
		controller?: AbortController
	) => ScheduleAPI.createSubject({...time, ...subject}, group, controller);

	/**
	 * Method for creating new subjects
	 *
	 * @async
	 * @param subject - subject to create
	 * @param [group] - id of the group that attends this subject
	 * @param [controller] - controller to abort request
	 * @returns Id of new subject object or `undefined` on error
	 */
	static createSubject = async (
		subject: Omit<CoreSubject, "id">,
		group?: number,
		controller?: AbortController
	) => {
		const time = new Date(subject.time);
		const response = await axios.request<IResponse<CoreSubject>>({
			url: `${ScheduleAPI.HOST}/subject`,
			signal: controller?.signal,
			method: "POST",
			data: {
				...subject,
				teacher: subject.teacher.id,
				time: time.toLocaleTimeString("ru"),
				group,
			},
			headers: {
				Authorization: ScheduleAPI.getAuthorizationHeader(),
			},
		});
		if (response.status !== 200) {
			return ScheduleAPI.handleError(response.data);
		}
		return response.data.body;
	};

	/**
	 * Method for updating subject
	 *
	 * @async
	 * @param subjectProperties - object which contains properties that needs to be updated on subject
	 * @param [controller] - controller to abort request
	 */
	static updateSubject = async (
		subjectProperties: WithID<Partial<CoreSubject>>,
		controller?: AbortController
	) => {
		const response = await axios.request<IResponse<CoreSubject>>({
			url: `${ScheduleAPI.HOST}/subject/update`,
			signal: controller?.signal,
			method: "POST",
			data: {
				...subjectProperties,
				teacher: subjectProperties.teacher?.id,
				time:
					subjectProperties.time &&
					new Date(subjectProperties.time).toLocaleTimeString("ru"),
			},
			headers: {
				Authorization: ScheduleAPI.getAuthorizationHeader(),
			},
		});
		if (response.status !== 200) {
			return ScheduleAPI.handleError(response.data);
		}
		return response.data.body;
	};

	/**
	 * Method for deleting subjects from schedule
	 * @param subjectId ID of subject to delete
	 * @param controller controller to abort fetch
	 */
	static deleteSubject = async (subjectId: number, controller?: AbortController) => {
		const response = await axios.request<IResponse<ISuccessful>>({
			url: `${ScheduleAPI.HOST}/subject/delete?id=${subjectId}`,
			signal: controller?.signal,
			method: "POST",
			headers: {
				Authorization: ScheduleAPI.getAuthorizationHeader(),
			},
		});
		return response.data.body.success;
	};

	private static handleError(err: any) {
		if (process.env.NODE_ENV === "development") {
			console.error(err);
		}
		return undefined;
	}
}
