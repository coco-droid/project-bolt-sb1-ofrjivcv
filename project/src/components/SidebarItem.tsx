import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  darkMode: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, title, description, darkMode, onClick }) => {
  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer ${
        darkMode 
          ? 'hover:bg-gray-700' 
          : 'hover:bg-gray-100'
      } transition-colors duration-200`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarItem;