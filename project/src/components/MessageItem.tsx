import React from 'react';
import { ChevronDown, ChevronUp, Check, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';

interface AIResponse {
  id: number;
  sender: string;
  model?: string;
  content: string;
  reasoning?: string;
  selected?: boolean;
}

interface MessageItemProps {
  message: {
    id: number;
    sender: string;
    content: string;
  };
  aiResponses: AIResponse[];
  darkMode: boolean;
  expandedMessage: number | null;
  toggleMessageExpansion: (id: number) => void;
  selectResponse: (id: number) => void;
  rejectAllResponses: (id: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  aiResponses,
  darkMode,
  expandedMessage,
  toggleMessageExpansion,
  selectResponse,
  rejectAllResponses
}) => {
  // Vérifier si une réponse a été sélectionnée
  const hasSelectedResponse = aiResponses.some(r => r.selected === true);
  
  return (
    <div key={message.id} className="mb-6">
      {/* User message */}
      <div className="flex justify-end mb-2">
        <div 
          className={`max-w-3xl rounded-lg px-4 py-2 ${
            darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900'
          }`}
        >
          <p>{message.content}</p>
        </div>
      </div>
      
      {/* AI responses */}
      {aiResponses.length > 0 && (
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-2">
              {aiResponses.some(r => 'selected' in r && r.selected) ? (
                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`}>
                  Réponse sélectionnée
                </span>
              ) : (
                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-yellow-800 text-yellow-100' : 'bg-yellow-100 text-yellow-800'}`}>
                  En attente de sélection
                </span>
              )}
            </div>
            <button 
              onClick={() => rejectAllResponses(message.id)}
              className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Rejeter toutes les réponses
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiResponses.map(aiResponse => (
              <div 
                key={aiResponse.id} 
                className={`relative rounded-lg p-4 border-2 ${
                  'selected' in aiResponse && aiResponse.selected
                    ? darkMode ? 'border-green-500 bg-gray-700' : 'border-green-500 bg-gray-50'
                    : darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    {'model' in aiResponse ? aiResponse.model : 'AI'}
                  </div>
                  
                  <button 
                    onClick={() => selectResponse(aiResponse.id)}
                    className={`p-1 rounded-full ${
                      'selected' in aiResponse && aiResponse.selected
                        ? darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                        : darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  >
                    <Check size={16} />
                  </button>
                </div>
                
                <p className="mb-2">{aiResponse.content}</p>
                
                {'reasoning' in aiResponse && (
                  <div className="flex justify-between items-start">
                    <div></div>
                    <button 
                      onClick={() => toggleMessageExpansion(aiResponse.id)}
                      className="ml-2 p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
                    >
                      {expandedMessage === aiResponse.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                )}
                
                {expandedMessage === aiResponse.id && 'reasoning' in aiResponse && (
                  <div className={`mt-2 p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                    <h4 className="font-medium mb-1">Chain-of-thought:</h4>
                    <p className="text-sm">{aiResponse.reasoning}</p>
                    <div className="flex mt-2 space-x-2">
                      <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}>
                        <ThumbsUp size={14} />
                      </button>
                      <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}>
                        <ThumbsDown size={14} />
                      </button>
                      <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}>
                        <Flag size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;