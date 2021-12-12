import React, {useCallback} from "react";
import PageFooter from "../PageFooter";
import LandingPage from "../../pages/LandingPage";
import UserView from "./UserView";

import "../../styles/MenuSlider.scss";
import {IUser} from "../../types";

interface IProps {
	showMenu: boolean;
}

export default ({showMenu}: IProps) => {
	const userInfo = sessionStorage.getItem("user");
	const handleGroupChange = useCallback(
		newGroup => {
			if (!userInfo) return;
			let user: IUser = JSON.parse(userInfo);
			user.group = newGroup;
			sessionStorage.setItem("user", JSON.stringify(user));
		},
		[userInfo]
	);
	return (
		<div className={`app-menu${showMenu ? " active" : ""}`}>
			{userInfo ? (
				<UserView
					user={JSON.parse(userInfo)}
					onGroupChange={handleGroupChange}
				/>
			) : (
				<LandingPage />
			)}
			<PageFooter />
		</div>
	);
};
