import React, { useCallback, useMemo, useRef, useState } from "react";
import PageHeader from "./components/PageHeader";
import MenuSlider from "./components/MenuSlider";
import ScheduleView from "./pages/ScheduleView/index";
import "./styles/App.scss";
import { GetWeekType } from "./Helpers";
import { WEEK_TYPE } from "./Types";

function App() {
    const [weekType, setWeekType] = useState<WEEK_TYPE>(GetWeekType());
    const [showMenu, setShowMenu] = useState(false);
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
        className.push(weekType === WEEK_TYPE.WHITE ? "white" : "green");
        return className.join(" ");
    }, [weekType, showMenu]);

    return (
        <div className={appClassName}>
            <PageHeader
                onMenuClick={menuButtonClicked}
                onTodayClick={todayButtonClicked}
            />
            <MenuSlider showMenu={showMenu} />
            <ScheduleView
                ref={scheduleViewRef}
                weekType={weekType}
                setWeekType={setWeekType}
            />
        </div>
    );
}

export default App;
