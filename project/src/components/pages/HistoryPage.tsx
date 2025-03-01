import React from 'react';
import { History } from 'lucide-react';

interface HistoryPageProps {
  darkMode: boolean;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ darkMode }) => {
  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow m-4`}>
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <History size={24} className="mr-2 text-indigo-600" />
        Historique des conversations
      </h1>
      
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div 
            key={item} 
            className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} hover:shadow-md transition-shadow cursor-pointer`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Session #{item} - Génération de données</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {`${item * 2} messages · ${new Date(2025, 0, item).toLocaleDateString()}`}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {item === 1 ? 'Complété' : 'En cours'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-sm text-gray-500">Total des conversations</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-sm text-gray-500">Messages échangés</p>
            <p className="text-2xl font-bold">87</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-sm text-gray-500">Taux de complétion</p>
            <p className="text-2xl font-bold">78%</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Filtres</h2>
        <div className="flex flex-wrap gap-2">
          <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
            Tous
          </button>
          <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            Complétés
          </button>
          <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            En cours
          </button>
          <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            Archivés
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Archives</h2>
        <div className="space-y-4">
          {[4, 5].map((item) => (
            <div 
              key={item} 
              className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700 opacity-70' : 'border-gray-200 bg-gray-50 opacity-70'} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Session #{item} - Analyse de sentiments</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {`${item * 3} messages · ${new Date(2024, 11, item).toLocaleDateString()}`}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800`}>
                  Archivé
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} mr-2`}>
          Exporter les données
        </button>
        <button className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">
          Nouvelle conversation
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;