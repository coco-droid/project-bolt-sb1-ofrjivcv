import React from 'react';
import Sidebar from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  sidebarOpen: boolean;
  navigateTo: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, sidebarOpen, navigateTo }) => {
  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Sidebar 
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        navigateTo={navigateTo}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;