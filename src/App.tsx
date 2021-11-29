import React, { useCallback, useState } from "react";
import PageHeader from "./components/PageHeader";
import MenuSlider from "./components/MenuSlider";
import ScheduleView from "./pages/ScheduleView";
import "./styles/App.scss";

function App() {
    const [weekType, setWeekType] = useState<"white" | "green">("green");
    const [showMenu, setShowMenu] = useState(false);
    const menuButtonClicked = useCallback(() => {
        setShowMenu(!showMenu);
    }, [showMenu]);
    return (
        <div className={`app ${weekType}`}>
            <PageHeader onMenuClick={menuButtonClicked} />
            <MenuSlider showMenu={showMenu}/>
            <ScheduleView weekType={+(weekType === "green")} />
        </div>
    );
}

export default App;
