import React, {useCallback, useEffect, useMemo} from "react";
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
import SignUpPage from "./pages/SignUpPage";
import SearchPage from "./pages/SearchPage";
import {WEEK_TYPE} from "./types";
import {useDispatch, useSelector} from "./store";
import {actions as appActions} from "./store/app";

import "./styles/App.scss";

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {showMenu, showFooter, user, weekType} = useSelector(state => ({
		showMenu: state.application.showMenu,
		showFooter: state.application.showFooter,
		user: state.application.user,
		weekType: state.schedule.currentWeek,
	}));

	useEffect(() => {
		dispatch(appActions.closeMenu());
		if (location.pathname === "/") {
			if (user) {
				navigate("/schedule", {replace: true});
			} else {
				dispatch(appActions.showFooter());
			}
		} else {
			dispatch(appActions.hideFooter());
			if (location.pathname === "/login" && user) {
				navigate("/schedule", {replace: true});
			}
		}
	}, [location.pathname]); // eslint-disable-line

	useEffect(() => {
		document.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				navigate(-1);
			}
		});
		return () => {
			if (document.onkeydown) document.removeEventListener("keydown", document.onkeydown);
		};
	}, []);

	const toggleMenuVisibility = useCallback(() => {
		dispatch(appActions.toggleMenu());
	}, [dispatch]);

	const appClassName = useMemo(() => {
		let className = ["app"];
		if (showMenu) className.push("menu-active");
		if (location.pathname === "/schedule") {
			className.push(WEEK_TYPE[weekType].toLowerCase());
			if (showFooter) dispatch(appActions.hideFooter());
		}
		return className.join(" ");
	}, [weekType, showMenu, location.pathname, showFooter, dispatch]);

	return (
		<div className={appClassName}>
			<PageHeader />
			<MenuSlider onClose={toggleMenuVisibility} onOpen={toggleMenuVisibility} />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/schedule" element={<ScheduleView />} />
				<Route path="/create" element={<EditSubjectPage />} />
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
