import React, { useState,useRef,useEffect } from 'react';
import { Bot, Lightbulb, Brain, Send, Paperclip } from 'lucide-react';
// Import our components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SidebarItem from './components/SidebarItem';
import MessageItem from './components/MessageItem';
import HistoryPage from './components/pages/HistoryPage';
import TrainingEvaluationPage from './components/pages/TrainingEvaluationPage';
import CreatePromptPage from './components/pages/CreatePromptPage';
import LoadConversationPage from './components/pages/LoadConversationPage';
import Layout from './components/layout/Layout';
import conversationService, { Message, SendMessageRequest } from './services/conversation.service';
import knowledgeBaseService from './services/knowledge-base.service';

function App() {
  // Add missing state
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
// Remove duplicate state declaration since it's already defined later in the file
  
  // Existing state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [knowledgeName, setKnowledgeName] = useState('Techniques de génération de données');
  const [generationStage, setGenerationStage] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [samplesGenerated, setSamplesGenerated] = useState(0);
  const [totalSamples, setTotalSamples] = useState(36);
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
  const [secondaryModel, setSecondaryModel] = useState('claude-3-opus');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [critiquingMessage, setCritiquingMessage] = useState<number | null>(null);
  const [critiqueText, setCritiqueText] = useState('');
  
  // Updated message structure to include model information and selection status
  const [messages, setMessages] = useState<any[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const insights = [
    "Les prompts qui incluent des exemples concrets génèrent des données plus cohérentes",
    "L'utilisation de contraintes explicites améliore la qualité des réponses de 37%",
    "Les conversations simulées avec 3+ tours produisent des données plus naturelles"
  ];

  const availableModels = [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta' }
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleMessageExpansion = (id: number) => {
    if (expandedMessage === id) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(id);
    }
  };

  const selectResponse = (messageId: number) => {
    setMessages(prevMessages => {
      // Find the AI message being selected
      const selectedMessage = prevMessages.find(m => m.id === messageId);
      if (!selectedMessage || selectedMessage.sender !== 'ai') return prevMessages;
      
      // Find the user message that this AI message is responding to
      const userMessageIndex = prevMessages.findIndex((m, i) => {
        if (m.sender !== 'user') return false;
        // Check if this user message precedes the selected AI message
        const messagePosition = prevMessages.indexOf(selectedMessage);
        const nextUserIndex = prevMessages.findIndex((um, j) => j > i && um.sender === 'user');
        return messagePosition > i && (nextUserIndex === -1 || messagePosition < nextUserIndex);
      });
      
      if (userMessageIndex === -1) return prevMessages;
      
      // Update all AI messages associated with this user message
      return prevMessages.map(message => {
        if (message.sender !== 'ai') return message;
        
        // Check if this AI message is associated with the same user message
        const messageIndex = prevMessages.indexOf(message);
        const nextUserIndex = prevMessages.findIndex((um, j) => j > userMessageIndex && um.sender === 'user');
        const isAssociated = messageIndex > userMessageIndex && 
                            (nextUserIndex === -1 || messageIndex < nextUserIndex);
        
        if (isAssociated) {
          // Only select the requested message, deselect others
          return { ...message, selected: message.id === messageId };
        }
        
        return message;
      });
    });
  };

  const rejectAllResponses = (userMessageId: number) => {
    // Find the index of the user message
    const userMessageIndex = messages.findIndex(m => m.id === userMessageId);
    
    if (userMessageIndex === -1) return;
    
    // Find all AI responses that follow this user message (before the next user message)
    const nextUserMessageIndex = messages.findIndex((m, i) => i > userMessageIndex && m.sender === 'user');
    const endIndex = nextUserMessageIndex === -1 ? messages.length : nextUserMessageIndex;
    
    // Store the rejected responses for reference
    const rejectedResponses = messages.slice(userMessageIndex + 1, endIndex);
    
    // Create a new array without those AI responses
    const newMessages = [
      ...messages.slice(0, userMessageIndex + 1),
      ...messages.slice(endIndex)
    ];
    
    setMessages(newMessages);
    
    // Activate critique mode for this message
    setCritiquingMessage(userMessageId);
    setCritiqueText('');
  };
  // Modified handleSendMessage to use API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (critiquingMessage !== null) {
      try {
        // Check if we have both critique text and suggested message
        if (!critiqueText.trim() || !suggestedMessage.trim()) {
          return;
        }
        
        const response = await conversationService.critiqueResponse(critiquingMessage, {
          critique: critiqueText,
          suggestion: suggestedMessage
        });
        
        // Add critique and suggestion to messages
        setMessages(prev => [...prev, {
          id: response.critiqueId || Date.now(),
          sender: 'critique',
          content: critiqueText,
          relatedTo: critiquingMessage
        }, {
          id: response.suggestionId || Date.now() + 1,
          sender: 'suggestion',
          content: suggestedMessage,
          relatedTo: critiquingMessage
        }]);
        
        setCritiquingMessage(null);
        setCritiqueText('');
        setSuggestedMessage('');
      } catch (error) {
        console.error('Error submitting critique:', error);
      }
      return;
    }
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    try {
      const request: SendMessageRequest = {
        content: newMessage,
        models: [selectedModel, secondaryModel]
      };
      
      // Create a new conversation if we don't have one
      if (!currentConversationId) {
        const conversation = await conversationService.createConversation({
          title: `Conversation ${new Date().toLocaleString()}`
        });
        setCurrentConversationId(conversation.id);
      }
      
      const response = await conversationService.sendMessage(
        currentConversationId || 1,
        request
      );
      
      setMessages(prev => [...prev, ...response.responses]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'system',
        content: 'Une erreur est survenue lors de la communication avec l\'API.',
        timestamp: new Date().toISOString()
      }]);
    }
  };
  // Modified startGenerationProcess to use API
  const startGenerationProcess = async () => {
    try {
      setGenerationStage('creating');
      setGenerationProgress(0);
      
      const knowledgeBase = await knowledgeBaseService.createKnowledgeBase({
        name: knowledgeName,
        description: `Knowledge base for ${knowledgeName}`,
        instructions: `This knowledge base contains examples related to ${knowledgeName}`
      });
      
      setGenerationStage('generating');
      const response = await knowledgeBaseService.generateSamples(
        knowledgeBase.id,
        {
          sampleCount: totalSamples,
          model: selectedModel
        }
      );
      
      // Poll for generation status
      const statusInterval = setInterval(async () => {
        try {
          const status = await knowledgeBaseService.getGenerationStatus(response.jobId);
          setSamplesGenerated(status.samplesGenerated);
          setGenerationProgress((status.samplesGenerated / status.totalSamples) * 100);
          
          if (status.status !== 'processing') {
            clearInterval(statusInterval);
            setGenerationStage('completed');
          }
        } catch (error) {
          console.error('Error checking generation status:', error);
          clearInterval(statusInterval);
          setGenerationStage('error');
        }
      }, 2000);
    } catch (error) {
      console.error('Error in generation process:', error);
      setGenerationStage('error');
    }
  };
  // Auto-scroll effect with a slight delay to ensure content is rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    }, 100); // Small delay to ensure content is rendered
    
    return () => clearTimeout(timer);
  }, [messages]);
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    // Reset critique mode when navigating
    setCritiquingMessage(null);
    setCritiqueText('');
  };
  
  // Create a function to render the input area based on the current mode
  const renderInputArea = () => {
    if (critiquingMessage !== null) {
      // Find the user message for context
      const userMessage = messages.find(m => m.id === critiquingMessage);
      
      return (
        <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-2`}>
            <p className="text-sm font-medium mb-1">Mode critique activé</p>
            <p className="text-xs">Veuillez expliquer pourquoi les réponses précédentes n'étaient pas satisfaisantes:</p>
            {userMessage && (
              <div className="mt-2 p-2 rounded bg-opacity-50 bg-gray-600">
                <p className="text-xs italic">{userMessage.content}</p>
              </div>
            )}
          </div>
          
          <textarea
            value={critiqueText}
            onChange={(e) => setCritiqueText(e.target.value)}
            placeholder="Expliquez ce qui n'allait pas avec les réponses précédentes..."
            className={`w-full py-2 px-4 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
          />
          
          <textarea
            value={suggestedMessage}
            onChange={(e) => setSuggestedMessage(e.target.value)}
            placeholder="Suggérez une réponse améliorée..."
            className={`w-full py-2 px-4 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
          />
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={() => setCritiquingMessage(null)}
              className={`py-2 px-4 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Envoyer la critique
            </button>
          </div>
        </form>
      );
    }
    
    // Regular message form remains the same...
    return (
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Saisissez votre message..."
          className={`flex-1 py-2 px-4 rounded-full border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <button 
          type="button" 
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <Paperclip size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
        </button>
        <button 
          type="submit" 
          className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Send size={20} />
        </button>
      </form>
    );
  };
  
  // Add state for suggested message
  const [suggestedMessage, setSuggestedMessage] = useState('');
  
  // Create a function to render the critique container
  const renderCritiqueContainer = () => {
    // Find the user message being critiqued
    const userMessage = messages.find(m => m.id === critiquingMessage);
    if (!userMessage) return null;
    
    // Find AI responses related to this user message
    const userMessageIndex = messages.findIndex(m => m.id === critiquingMessage);
    const nextUserIndex = messages.findIndex((m, i) => i > userMessageIndex && m.sender === 'user');
    const endIndex = nextUserIndex === -1 ? messages.length : nextUserIndex;
    
    // Get AI responses that were previously shown (and now rejected)
    const aiResponses = messages.slice(userMessageIndex + 1, endIndex)
      .filter(m => m.sender === 'ai');
    
    return (
      <div className="flex-1 flex flex-col">
        <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="text-lg font-medium mb-2">Mode Critique</h3>
          <p className="text-sm mb-4">Veuillez critiquer les réponses de l'IA et suggérer une meilleure réponse.</p>
          
          {/* User message */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Message de l'utilisateur:</p>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {userMessage.content}
            </div>
          </div>
          
          {/* AI responses with reasoning */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Réponses de l'IA:</p>
            {aiResponses.map((response, index) => (
              <div key={response.id} className={`p-3 mb-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="font-medium text-sm mb-1">Modèle: {response.model}</p>
                <p className="mb-2">{response.content}</p>
                <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-xs italic">Raisonnement: {response.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Critique form */}
          <div>
            <p className="text-sm font-medium mb-1">Votre critique:</p>
            <textarea
              value={critiqueText}
              onChange={(e) => setCritiqueText(e.target.value)}
              placeholder="Expliquez ce qui n'allait pas avec les réponses précédentes..."
              className={`w-full p-3 mb-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
            />
            
            <p className="text-sm font-medium mb-1">Votre suggestion de réponse:</p>
            <textarea
              value={suggestedMessage}
              onChange={(e) => setSuggestedMessage(e.target.value)}
              placeholder="Proposez une meilleure réponse..."
              className={`w-full p-3 mb-4 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
            />
            
            <div className="flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => {
                  setCritiquingMessage(null);
                  setCritiqueText('');
                  setSuggestedMessage('');
                }}
                className={`py-2 px-4 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={handleSubmitCritique}
                className="py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Add function to handle critique submission
  const handleSubmitCritique = () => {
    if (critiquingMessage === null) return;
    
    // Find the user message being critiqued
    const userMessageIndex = messages.findIndex(m => m.id === critiquingMessage);
    if (userMessageIndex === -1) {
      setCritiquingMessage(null);
      setCritiqueText('');
      setSuggestedMessage('');
      return;
    }
    
    // Add the critique as a special message
    const critiqueFeedback = {
      id: Date.now(),
      sender: 'critique',
      content: critiqueText,
      relatedTo: critiquingMessage
    };
    
    // Add the suggested message as a special message
    const suggestedResponse = {
      id: Date.now() + 1,
      sender: 'suggestion',
      content: suggestedMessage,
      relatedTo: critiquingMessage
    };
    
    // Add the critique and suggested message
    setMessages(prev => [
      ...prev.slice(0, userMessageIndex + 1),
      critiqueFeedback,
      suggestedResponse,
      ...prev.slice(userMessageIndex + 1)
    ]);
    
    // Reset critique mode
    setCritiquingMessage(null);
    setCritiqueText('');
    setSuggestedMessage('');
  };
  
  // Modify the renderHomePage function to show critique container when in critique mode
  const renderHomePage = () => {
    return (
      <main className="flex-1 flex flex-col">
        {/* Model Selection Bar */}
        <div className={`w-full p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bot size={18} className="mr-2 text-indigo-500" />
              <span className="text-sm font-medium">Modèle principal:</span>
            </div>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bot size={18} className="mr-2 text-indigo-500" />
              <span className="text-sm font-medium">Modèle secondaire:</span>
            </div>
            <select 
              value={secondaryModel}
              onChange={(e) => setSecondaryModel(e.target.value)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {availableModels.filter(model => model.id !== selectedModel).map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1 flex">
          {/* Conversation Area or Critique Area */}
          <div className="flex-1 p-4 flex flex-col h-full">
            {critiquingMessage !== null ? (
              // Show critique container when in critique mode
              renderCritiqueContainer()
            ) : (
              // Show normal message container
              <>
                <div 
                  ref={messageContainerRef}
                  className={`flex-1 overflow-y-auto rounded-lg mb-4 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}
                  style={{ maxHeight: 'calc(100vh - 220px)' }}
                >
                  {messages.map((message, index) => {
                    // Display critique messages
                    if (message.sender === 'critique') {
                      return (
                        <div key={message.id} className="mb-4">
                          <div className={`max-w-3xl mx-auto rounded-lg px-4 py-2 ${
                            darkMode ? 'bg-amber-800 bg-opacity-30 text-amber-100' : 'bg-amber-100 text-amber-900'
                          }`}>
                            <p className="text-sm font-medium mb-1">Critique pour amélioration:</p>
                            <p>{message.content}</p>
                          </div>
                        </div>
                      );
                    }
                    
                    // Display suggested messages
                    if (message.sender === 'suggestion') {
                      return (
                        <div key={message.id} className="mb-4">
                          <div className={`max-w-3xl mx-auto rounded-lg px-4 py-2 ${
                            darkMode ? 'bg-green-800 bg-opacity-30 text-green-100' : 'bg-green-100 text-green-900'
                          }`}>
                            <p className="text-sm font-medium mb-1">Suggestion de l'utilisateur:</p>
                            <p>{message.content}</p>
                          </div>
                        </div>
                      );
                    }
                    
                    // Check if this is a user message
                    if (message.sender === 'user') {
                      // Find the AI responses that follow this user message
                      const aiResponses = messages.filter((m, i) => 
                        m.sender === 'ai' && 
                        i > index && 
                        (i === index + 1 || i === index + 2) &&
                        (messages[i+1]?.sender !== 'user' || i === messages.length - 1 || i === messages.length - 2)
                      );
                      
                      return (
                        <MessageItem 
                          key={message.id}
                          message={message}
                          aiResponses={aiResponses}
                          darkMode={darkMode}
                          expandedMessage={expandedMessage}
                          toggleMessageExpansion={toggleMessageExpansion}
                          selectResponse={selectResponse}
                          rejectAllResponses={rejectAllResponses}
                        />
                      );
                    }
                    
                    // Skip AI messages as they're handled with the user messages
                    return null;
                  })}
                </div>
                
                {/* Input area */}
                {renderInputArea()}
              </>
            )}
          </div>
          
          {/* Insights Panel */}
          <div className={`w-80 p-4 hidden lg:block ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Lightbulb size={20} className="mr-2 text-yellow-500" />
                Insights
              </h2>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Brain size={18} className="mr-2 text-indigo-500" />
                Knowledge Base
              </h3>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-3`}>
                <p className="font-medium text-sm">{knowledgeName}</p>
              </div>
              
              {generationStage ? (
                <div className="space-y-4">
                  {/* Generation progress UI */}
                  {/* ... existing generation progress UI */}
                </div>
              ) : (
                <button 
                  onClick={startGenerationProcess}
                  className={`w-full py-2 px-4 rounded-md ${
                    darkMode 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900'
                  }`}
                >
                  Générer des suggestions
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return renderHomePage();
      case 'training':
        return <TrainingEvaluationPage darkMode={darkMode} navigateTo={navigateTo} />;
      case 'history':
        return <HistoryPage darkMode={darkMode} />;
      case 'create_prompt':
        return (
          <CreatePromptPage 
            darkMode={darkMode} 
            knowledgeName={knowledgeName}
            setKnowledgeName={setKnowledgeName}
            totalSamples={totalSamples}
            setTotalSamples={setTotalSamples}
            navigateTo={navigateTo}
            startGenerationProcess={startGenerationProcess}
          />
        );
      case 'load_conversation':
        return <LoadConversationPage darkMode={darkMode} navigateTo={navigateTo} />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <Header 
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        currentPage={currentPage}
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleDarkMode}
        navigateTo={navigateTo}
      />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          darkMode={darkMode}
          navigateTo={navigateTo}
        />
        
        {/* Main Content Area */}
        {renderPage()}
      </div>
    </div>
  );
}

export default App;