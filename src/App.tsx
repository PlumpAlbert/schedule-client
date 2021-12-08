import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import PageHeader from "./components/PageHeader";
import MenuSlider from "./components/MenuSlider";
import ScheduleView from "./pages/ScheduleView";
import LandingPage from "./pages/LandingPage";
import PageFooter from "./components/PageFooter";
import EditSubjectPage from "./pages/EditSubjectPage";
import LoginPage from "./pages/LoginPage";
import GroupsListPage from "./pages/GroupsListPage";
import Page404 from "./pages/Page404";
import {GetWeekType} from "./Helpers";
import {WEEK_TYPE} from "./types";
import "./styles/App.scss";

function App() {
	const location = useLocation();
	const [weekday, setWeekday] = useState<number | undefined>(undefined);
	const [weekType, setWeekType] = useState<WEEK_TYPE>(GetWeekType());
	const [showMenu, setShowMenu] = useState(false);
	const [showFooter, setShowFooter] = useState(location.pathname === "/");

	useEffect(() => {
		setShowMenu(false);
	}, [location.pathname, setShowMenu]);

	const menuButtonClicked = useCallback(() => {
		setShowMenu(!showMenu);
	}, [showMenu]);

	const todayButtonClicked = useCallback(() => {
		setWeekType(GetWeekType());
		let day = new Date().getDay();
		setWeekday(day === 0 ? 7 : day);
	}, []);

	const appClassName = useMemo(() => {
		let className = ["app"];
		if (showMenu) className.push("menu-active");
		if (location.pathname === "/schedule") {
			className.push(weekType === WEEK_TYPE.WHITE ? "white" : "green");
			if (showFooter) setShowFooter(false);
		}
		return className.join(" ");
	}, [weekType, showMenu, location.pathname, showFooter]);

	return (
		<div className={appClassName}>
			<PageHeader
				menuIsShown={showMenu}
				onMenuClick={menuButtonClicked}
				onTodayClick={todayButtonClicked}
			/>
			<MenuSlider showMenu={showMenu} />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/schedule"
					element={
						<ScheduleView
							weekday={weekday}
							weekType={weekType}
							setWeekType={setWeekType}
						/>
					}
				/>
				<Route path="/subject" element={<EditSubjectPage />} />
				<Route path="/groups/*" element={<GroupsListPage />} />
				<Route path="*" element={<Page404 />} />
			</Routes>
			{showFooter && <PageFooter />}
		</div>
	);
}

export default App;
