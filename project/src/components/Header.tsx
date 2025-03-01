import React from 'react';
import { Home, MessageSquare, Lightbulb, Settings, History, Menu, X, Sun, Moon } from 'lucide-react';
import NavLink from './NavLink';

interface HeaderProps {
  sidebarOpen: boolean;
  darkMode: boolean;
  currentPage: string;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  navigateTo: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  darkMode, 
  currentPage, 
  toggleSidebar, 
  toggleDarkMode, 
  navigateTo 
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} mr-2 md:hidden`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl">SynthDialog</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <NavLink 
              icon={<Home size={18} />} 
              text="Accueil" 
              active={currentPage === 'home'} 
              darkMode={darkMode} 
              onClick={() => navigateTo('home')}
            />
            <NavLink 
              icon={<MessageSquare size={18} />} 
              text="Conversations" 
              active={false} 
              darkMode={darkMode} 
            />
            <NavLink 
              icon={<Lightbulb size={18} />} 
              text="Insights" 
              active={false} 
              darkMode={darkMode} 
            />
            <NavLink 
              icon={<Settings size={18} />} 
              text="Paramètres" 
              active={false} 
              darkMode={darkMode} 
            />
            <NavLink 
              icon={<History size={18} />} 
              text="Historique" 
              active={currentPage === 'history'} 
              darkMode={darkMode} 
              onClick={() => navigateTo('history')}
            />
          </nav>
          
          <div className="flex items-center">
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;