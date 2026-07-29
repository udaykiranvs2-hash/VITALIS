import { createContext, useContext, useState } from 'react';

const DashboardCtx = createContext({ showDashboard: false, toggleDashboard: () => {} });

export function DashboardProvider({ children }) {
  const [showDashboard, setShowDashboard] = useState(false);
  const toggleDashboard = () => setShowDashboard((prev) => !prev);
  const closeDashboard  = () => setShowDashboard(false);
  return (
    <DashboardCtx.Provider value={{ showDashboard, toggleDashboard, closeDashboard }}>
      {children}
    </DashboardCtx.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardCtx);
}
