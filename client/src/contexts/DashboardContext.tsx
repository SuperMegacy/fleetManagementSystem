import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Job } from '../types/fleet';

interface DashboardContextType {
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <DashboardContext.Provider value={{
      selectedJob,
      setSelectedJob,
      activeView,
      setActiveView,
      refreshTrigger,
      triggerRefresh
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
