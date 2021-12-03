import React, { useCallback, useMemo, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import MenuSlider from "./components/MenuSlider";
import ScheduleView from "./pages/ScheduleView/index";
import "./styles/App.scss";
import { GetWeekType } from "./Helpers";
import { WEEK_TYPE } from "./types";
import LandingPage from "./pages/LandingPage";
import PageFooter from "./components/PageFooter";
import EditSubjectPage from "./pages/EditSubjectPage";

function App() {
    const location = useLocation();
    const [weekType, setWeekType] = useState<WEEK_TYPE>(GetWeekType());
    const [showMenu, setShowMenu] = useState(false);
    const [showFooter, setShowFooter] = useState(location.pathname === "/");
    const scheduleViewRef = useRef<ScheduleView>(null);

    const menuButtonClicked = useCallback(() => {
        setShowMenu(!showMenu);
    }, [showMenu]);

    const todayButtonClicked = useCallback(() => {
        scheduleViewRef.current?.todayButtonClicked();
        setWeekType(GetWeekType());
    }, []);

    const appClassName = useMemo(() => {
        let className = ["app"];
        if (showMenu) className.push("menu-active");
        if (location.pathname === "/schedule") {
            className.push(weekType === WEEK_TYPE.WHITE ? "white" : "green");
            if (showFooter) setShowFooter(false);
        }
        return className.join(" ");
    }, [weekType, showMenu, location.pathname]);

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
                <Route
                    path="/schedule"
                    element={
                        <ScheduleView
                            ref={scheduleViewRef}
                            weekType={weekType}
                            setWeekType={setWeekType}
                        />
                    }
                />
                <Route path="/subject" element={<EditSubjectPage />} />
            </Routes>
            {showFooter && <PageFooter />}
        </div>
    );
}

export default App;
