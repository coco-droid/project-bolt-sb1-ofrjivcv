import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TrainingMetric {
  id: number;
  name: string;
  value: number;
  change: number;
  date: string;
  checkpoint: string;
}

interface TrainingMetricCardProps {
  metric: TrainingMetric;
  darkMode: boolean;
  onClick: () => void;
}

const TrainingMetricCard: React.FC<TrainingMetricCardProps> = ({ metric, darkMode, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
        darkMode 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-50 shadow'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{metric.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          metric.change > 0 
            ? darkMode ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-green-100 text-green-800'
            : darkMode ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-red-100 text-red-800'
        }`}>
          {metric.change > 0 ? '+' : ''}{metric.change}%
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{metric.value}%</span>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {metric.date}
        </div>
      </div>
      <div className="mt-2 text-xs flex items-center">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Checkpoint: {metric.checkpoint}
        </span>
        <ChevronRight size={14} className="ml-1" />
      </div>
    </div>
  );
};

export default TrainingMetricCard;