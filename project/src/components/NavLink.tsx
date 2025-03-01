import React from 'react';

interface NavLinkProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  darkMode: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, text, active = false, darkMode, onClick }) => {
  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
        active 
          ? darkMode 
            ? 'bg-gray-700 text-white' 
            : 'bg-indigo-100 text-indigo-900' 
          : darkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } transition-colors duration-200`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
};

export default NavLink;