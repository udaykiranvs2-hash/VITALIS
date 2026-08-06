import { createContext, useContext, useState } from 'react';

const DashboardCtx = createContext({ showDashboard: false, toggleDashboard: () => {} });

export function DashboardProvider({ children }) {
  const [showDashboard, setShowDashboard] = useState(() => {
    return localStorage.getItem('vitalis_dashboard_open') === 'true';
  });
  const toggleDashboard = () => {
    setShowDashboard((prev) => {
      const next = !prev;
      localStorage.setItem('vitalis_dashboard_open', String(next));
      return next;
    });
  };
  const closeDashboard  = () => {
    setShowDashboard(false);
    localStorage.setItem('vitalis_dashboard_open', 'false');
  };
  return (
    <DashboardCtx.Provider value={{ showDashboard, toggleDashboard, closeDashboard }}>
      {children}
    </DashboardCtx.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardCtx);
}
