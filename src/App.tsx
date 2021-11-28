import React from 'react';
import ScheduleView from './pages/ScheduleView';
import './styles/App.scss';

function App() {
  return (
    <div className="App">
		<ScheduleView weekType={1} />
    </div>
  );
}

export default App;
