import React, { useState } from 'react';
import { PenTool } from 'lucide-react';
import knowledgeBaseService from '../../services/knowledge-base.service';

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
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledgeName.trim() || !description.trim() || !instructions.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      await knowledgeBaseService.createKnowledgeBase({
        name: knowledgeName,
        description,
        instructions
      });
      startGenerationProcess();
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      setError('Une erreur est survenue lors de la création de la base de connaissances');
      setCreating(false);
    }
  };

  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow m-4`}>
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <PenTool size={24} className="mr-2 text-indigo-600" />
        Créer un prompt maître
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Nom de la base de connaissances
          </label>
          <input 
            type="text" 
            value={knowledgeName}
            onChange={(e) => setKnowledgeName(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
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
            type="button"
            onClick={() => navigateTo('home')}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          >
            Annuler
          </button>
          <button 
            type="submit"
            disabled={creating}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            {creating ? 'Création en cours...' : 'Créer et générer'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePromptPage;