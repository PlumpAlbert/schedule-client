import React, {useMemo} from "react";
import {useLocation} from "react-router-dom";
import FacultiesView from "./FacultiesView";
import SpecialtiesView from "./SpecialtiesView";

import "../../styles/GroupsListPage.scss";

const GroupsListPage = () => {
	const location = useLocation();
	const currentFaculty = useMemo(() => {
		const uri = location.pathname.split("/");
		if (uri[uri.length - 1] !== "groups") return uri[uri.length - 1];
		return "";
	}, [location.pathname]);
	return (
		<div className="page groups-list-page">
			{currentFaculty !== "" ? (
				<SpecialtiesView faculty={currentFaculty} />
			) : (
				<FacultiesView />
			)}
		</div>
	);
};

export default GroupsListPage;
