import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
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
import SignUpPage from "./pages/SignUpPage";
import SearchPage from "./pages/SearchPage";

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const [weekday, setWeekday] = useState<number | undefined>(undefined);
	const [weekType, setWeekType] = useState<WEEK_TYPE>(GetWeekType());
	const [showMenu, setShowMenu] = useState(false);
	const [showFooter, setShowFooter] = useState(location.pathname === "/");

	useEffect(() => {
		setShowMenu(false);
		const userInfo = sessionStorage.getItem("user");
		if (location.pathname === "/") {
			if (userInfo) {
				navigate("/schedule", {replace: true});
			} else {
				setShowFooter(true);
			}
		} else {
			setShowFooter(false);
			if (location.pathname === "/login" && userInfo) {
				navigate("/schedule", {replace: true});
			}
		}
	}, [location.pathname]);

	useEffect(() => {
		document.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				navigate(-1);
			}
		});
		return () => {
			if (document.onkeydown)
				document.removeEventListener("keydown", document.onkeydown);
		};
	}, []);

	const menuButtonClicked = useCallback(() => {
		setShowMenu(!showMenu);
	}, [showMenu]);

	const todayButtonClicked = useCallback(() => {
		setWeekType(GetWeekType());
		let day = new Date().getDay();
		setWeekday(day === 0 ? 7 : day);
	}, [setWeekType, setWeekday]);

	const backButtonClicked = useCallback(() => {
		navigate(-1);
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
				onBackClick={backButtonClicked}
				onMenuClick={menuButtonClicked}
				onTodayClick={todayButtonClicked}
			/>
			<MenuSlider
				showMenu={showMenu}
				onClose={() => setShowMenu(false)}
				onOpen={() => setShowMenu(true)}
			/>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/signup" element={<SignUpPage />} />
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
				<Route path="/search" element={<SearchPage />} />
				<Route path="*" element={<Page404 />} />
			</Routes>
			{showFooter && <PageFooter />}
		</div>
	);
}

export default App;
