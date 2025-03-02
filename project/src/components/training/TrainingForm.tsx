import React from 'react';
import { CheckCircle, Database, Brain } from 'lucide-react';

interface KnowledgeBase {
  id: number;
  name: string;
  samples: number;
  lastUpdated: string;
  selected: boolean;
  distribution: number;
}

interface TrainingFormProps {
  baseModel: string;
  setBaseModel: (model: string) => void;
  useCheckpoint: boolean;
  setUseCheckpoint: (use: boolean) => void;
  selectedCheckpoint: string;
  setSelectedCheckpoint: (checkpoint: string) => void;
  isTraining: boolean;
  trainingProgress: number;
  startTraining: () => void;
  knowledgeBases: KnowledgeBase[];
  toggleKnowledgeSelection: (id: number) => void;
  updateDistribution: (id: number, value: number) => void;
  totalDistribution: number;
  darkMode: boolean;
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  baseModel,
  setBaseModel,
  useCheckpoint,
  setUseCheckpoint,
  selectedCheckpoint,
  setSelectedCheckpoint,
  isTraining,
  trainingProgress,
  startTraining,
  knowledgeBases,
  toggleKnowledgeSelection,
  updateDistribution,
  totalDistribution,
  darkMode
}) => {
  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Brain size={18} className="mr-2 text-indigo-500" />
            Configuration du Modèle
          </h3>
          
          <div className="mb-4">
            <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Modèle de Base
            </label>
            <select
              value={baseModel}
              onChange={(e) => setBaseModel(e.target.value)}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              disabled={isTraining}
            >
              <option value="gpt-4-base">GPT-4 Base</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="llama-2">Llama 2</option>
              <option value="mistral-7b">Mistral 7B</option>
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="useCheckpoint"
                checked={useCheckpoint}
                onChange={() => setUseCheckpoint(!useCheckpoint)}
                className="mr-2"
                disabled={isTraining}
              />
              <label 
                htmlFor="useCheckpoint" 
                className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Utiliser un checkpoint existant
              </label>
            </div>
            
            {useCheckpoint && (
              <select
                value={selectedCheckpoint}
                onChange={(e) => setSelectedCheckpoint(e.target.value)}
                className={`w-full p-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={isTraining}
              >
                <option value="checkpoint-20231201">checkpoint-20231201</option>
                <option value="checkpoint-20231120">checkpoint-20231120</option>
                <option value="checkpoint-20231115">checkpoint-20231115</option>
              </select>
            )}
          </div>
          
          {isTraining && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Progression de l'entraînement
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.round(trainingProgress)}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full rounded-full bg-indigo-600" 
                  style={{ width: `${trainingProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <button
            onClick={startTraining}
            disabled={isTraining || totalDistribution !== 100}
            className={`mt-4 px-4 py-2 rounded-md text-white font-medium ${
              isTraining || totalDistribution !== 100
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isTraining ? 'Entraînement en cours...' : 'Lancer l\'entraînement'}
          </button>
          
          {totalDistribution !== 100 && !isTraining && (
            <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              La distribution des bases de connaissances doit totaliser 100% (actuellement {totalDistribution}%)
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Database size={18} className="mr-2 text-indigo-500" />
            Bases de Connaissances
          </h3>
          
          <div className="space-y-4">
            {knowledgeBases.map(kb => (
              <div key={kb.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`kb-${kb.id}`}
                      checked={kb.selected}
                      onChange={() => toggleKnowledgeSelection(kb.id)}
                      className="mr-2"
                      disabled={isTraining}
                    />
                    <label 
                      htmlFor={`kb-${kb.id}`}
                      className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {kb.name}
                    </label>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {kb.samples} échantillons
                  </span>
                </div>
                
                {kb.selected && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Distribution: {kb.distribution}%
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Dernière mise à jour: {kb.lastUpdated}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={kb.distribution}
                      onChange={(e) => updateDistribution(kb.id, parseInt(e.target.value))}
                      className="w-full"
                      disabled={isTraining}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingForm;