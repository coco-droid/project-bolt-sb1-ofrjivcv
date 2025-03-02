import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface TrainingSession {
  id: number;
  date: string;
  duration: string;
  baseModel: string;
  checkpoint: string | null;
  metrics: {
    accuracy: number;
    loss: number;
    f1Score: number;
  };
  knowledgeBases: string[];
}

interface ChatMessage {
  sender: 'system' | 'user' | 'ai';
  content: string;
}

interface ModelChatInterfaceProps {
  darkMode: boolean;
  selectedSession: TrainingSession | null;
  chatMessages: ChatMessage[];
  chatMessage: string;
  setChatMessage: (message: string) => void;
  sendChatMessage: (e: React.FormEvent) => void;
  closeChat: () => void;
}

const ModelChatInterface: React.FC<ModelChatInterfaceProps> = ({
  darkMode,
  selectedSession,
  chatMessages,
  chatMessage,
  setChatMessage,
  sendChatMessage,
  closeChat
}) => {
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold">Test du Checkpoint: {selectedSession?.checkpoint}</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Date d'entraînement: {selectedSession?.date} • Précision: {selectedSession?.metrics?.accuracy ? selectedSession.metrics.accuracy * 100 : 0}%
          </p>
        </div>
        <button 
          onClick={closeChat}
          className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Retour aux métriques
        </button>
      </div>
      
      <div className={`flex-1 overflow-y-auto mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : ''}`}>
            {msg.sender === 'system' && (
              <div className={`mx-auto text-center p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            )}
            
            {msg.sender === 'user' && (
              <div className="inline-block max-w-[80%] sm:max-w-2/3 p-3 rounded-lg bg-indigo-600 text-white">
                <p>{msg.content}</p>
              </div>
            )}
            
            {msg.sender === 'ai' && (
              <div className={`inline-block max-w-[80%] sm:max-w-2/3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p>{msg.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={sendChatMessage} className="flex items-center space-x-2">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Testez le modèle avec une question..."
          className={`flex-1 py-2 px-4 rounded-full border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <button 
          type="submit" 
          className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default ModelChatInterface;