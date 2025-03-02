import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import conversationService, { Conversation } from '../../services/conversation.service';

interface HistoryPageProps {
  darkMode: boolean;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ darkMode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await conversationService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow m-4`}>
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <History size={24} className="mr-2 text-indigo-600" />
        Historique des conversations
      </h1>
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2">Chargement des conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <p>Aucune conversation trouvée</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className={`p-4 rounded-lg border ${
                darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
              } hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{conversation.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {`${conversation.messageCount} messages · ${new Date(conversation.date).toLocaleDateString()}`}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  conversation.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {conversation.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;