import React, {useMemo} from "react";
import Faculty from "./Faculty";
import SpecialtiesView from "./SpecialtiesView";

import "../../styles/GroupsListPage.scss";

const FacultiesView = () => {
	const faculties = ["ФАИ", "ИСФ", "ФГСНиП", "ИМ", "ЭФ", "МИ", "ФТФ"];
	const facultyElements = useMemo(
		() => faculties.map(f => <Faculty title={f} />),
		[faculties]
	);
	return <div className="faculties-wrapper">{facultyElements}</div>;
};

const GroupsListPage = () => {
	return (
		<div className="page groups-list-page">
			<FacultiesView />
			{/* <SpecialtiesView faculty="ФАИ" /> */}
		</div>
	);
};

export default GroupsListPage;
