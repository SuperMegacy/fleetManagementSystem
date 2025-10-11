import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardProvider } from './contexts/DashboardContext';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ScheduleView from './pages/Schedule/ScheduleView';
import JobsPage from './pages/Jobs/JobsPage';

const App: React.FC = () => {
  return (
    <DashboardProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule" element={<ScheduleView />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Routes>
        </AppLayout>
      </Router>
    </DashboardProvider>
  );
};

export default App;