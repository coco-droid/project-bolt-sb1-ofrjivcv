import React from 'react';
import { Upload, Play, PenTool, Share2 } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { Activity } from 'lucide-react';
import TrainingEvaluationPage from './pages/TrainingEvaluationPage';
interface SidebarProps {
  sidebarOpen: boolean;
  darkMode: boolean;
  navigateTo: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, darkMode, navigateTo }) => {
  return (
    <aside 
      className={`fixed md:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg md:shadow-none pt-16 md:pt-0`}
    >
      <div className="h-full overflow-y-auto p-4 flex flex-col space-y-6">
        <SidebarItem 
          icon={<Upload size={20} />} 
          title="Charger une conversation" 
          description="Importer des mini-sets de conversations" 
          darkMode={darkMode}
          onClick={() => navigateTo('load_conversation')}
        />
        <SidebarItem 
          icon={<Play size={20} />} 
          title="Simuler une conversation" 
          description="Engager une conversation en temps réel" 
          darkMode={darkMode}
          onClick={() => navigateTo('home')}
        />
        <SidebarItem 
          icon={<PenTool size={20} />} 
          title="Créer un prompt maître" 
          description="Saisir des instructions personnalisées" 
          darkMode={darkMode}
          onClick={() => navigateTo('create_prompt')}
        />
        <SidebarItem 
          icon={<Share2 size={20} />} 
          title="Historique et collaboration" 
          description="Accéder aux sessions précédentes" 
          darkMode={darkMode}
          onClick={() => navigateTo('history')}
        />
        <SidebarItem
  icon={<Activity size={20} className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} />}
  title="Training & Evaluation"
  description="Monitor model performance and launch training cycles"
  darkMode={darkMode}
  onClick={() => navigateTo('training')}
/>
      </div>
    </aside>
    );
};
export default Sidebar;