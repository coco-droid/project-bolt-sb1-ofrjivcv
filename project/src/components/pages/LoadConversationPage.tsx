import React from 'react';
import { Upload, FileText, Database } from 'lucide-react';

interface LoadConversationPageProps {
  darkMode: boolean;
  navigateTo: (page: string) => void;
}

const LoadConversationPage: React.FC<LoadConversationPageProps> = ({ darkMode, navigateTo }) => {
  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow m-4`}>
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Upload size={24} className="mr-2 text-indigo-600" />
        Charger une conversation
      </h1>
      
      <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 text-center mb-6`}>
        <div className="flex flex-col items-center">
          <FileText size={48} className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className="mb-2">Glissez-déposez vos fichiers ici ou</p>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
            Parcourir les fichiers
          </button>
          <p className="mt-2 text-sm text-gray-500">Formats supportés: .json, .csv, .txt</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Conversations récentes</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center`}
            >
              <div className="flex items-center">
                <Database size={18} className="mr-2 text-indigo-500" />
                <span>{`dataset_${item}.json`}</span>
              </div>
              <span className="text-sm text-gray-500">{`${item * 10 + 20} échantillons`}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Options d'importation</h2>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center space-x-2 mb-3">
            <input 
              type="checkbox" 
              id="auto-format" 
              className="rounded text-indigo-600 focus:ring-indigo-500"
              defaultChecked
            />
            <label htmlFor="auto-format" className="text-sm">
              Formater automatiquement les données
            </label>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <input 
              type="checkbox" 
              id="validate-data" 
              className="rounded text-indigo-600 focus:ring-indigo-500"
              defaultChecked
            />
            <label htmlFor="validate-data" className="text-sm">
              Valider l'intégrité des données
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="merge-existing" 
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="merge-existing" className="text-sm">
              Fusionner avec les données existantes
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button 
          onClick={() => navigateTo('home')}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          Annuler
        </button>
        <button 
          onClick={() => navigateTo('home')}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Importer et analyser
        </button>
      </div>
    </div>
  );
};

export default LoadConversationPage;