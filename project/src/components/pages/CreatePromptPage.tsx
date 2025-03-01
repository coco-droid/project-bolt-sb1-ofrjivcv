import React from 'react';
import { PenTool } from 'lucide-react';

interface CreatePromptPageProps {
  darkMode: boolean;
  knowledgeName: string;
  setKnowledgeName: (name: string) => void;
  totalSamples: number;
  setTotalSamples: (samples: number) => void;
  navigateTo: (page: string) => void;
  startGenerationProcess: () => void;
}

const CreatePromptPage: React.FC<CreatePromptPageProps> = ({
  darkMode,
  knowledgeName,
  setKnowledgeName,
  totalSamples,
  setTotalSamples,
  navigateTo,
  startGenerationProcess
}) => {
  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow m-4`}>
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <PenTool size={24} className="mr-2 text-indigo-600" />
        Créer un prompt maître
      </h1>
      
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Nom du knowledge base
          </label>
          <input 
            type="text" 
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Ex: Techniques de génération de données"
            value={knowledgeName}
            onChange={(e) => setKnowledgeName(e.target.value)}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea 
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
            placeholder="Décrivez le domaine de connaissance que vous souhaitez explorer..."
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Instructions spécifiques
          </label>
          <textarea 
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]`}
            placeholder="Ajoutez des instructions détaillées pour guider la génération..."
          />
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nombre d'échantillons
            </label>
            <input 
              type="number" 
              className={`w-full px-4 py-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="36"
              value={totalSamples}
              onChange={(e) => setTotalSamples(parseInt(e.target.value) || 36)}
            />
          </div>
          
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Seuil de validation
            </label>
            <input 
              type="number" 
              className={`w-full px-4 py-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="85"
              defaultValue={85}
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 mt-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Options avancées
            </label>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="enable-reasoning" 
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="enable-reasoning" className="text-sm">
                Activer le raisonnement en chaîne de pensée
              </label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input 
                type="checkbox" 
                id="enable-validation" 
                className="rounded text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
              <label htmlFor="enable-validation" className="text-sm">
                Validation automatique des échantillons
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
            onClick={() => {
              navigateTo('home');
              setTimeout(() => startGenerationProcess(), 500);
            }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            Créer et générer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePromptPage;