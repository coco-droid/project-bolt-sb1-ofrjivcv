import React, { useState, useEffect } from 'react';
import { BarChart, CheckCircle, Play, Database, Brain, ArrowRight, ChevronRight } from 'lucide-react';

interface TrainingMetric {
  id: number;
  name: string;
  value: number;
  change: number;
  date: string;
  checkpoint: string;
}

interface KnowledgeBase {
  id: number;
  name: string;
  samples: number;
  lastUpdated: string;
  selected: boolean;
  distribution: number;
}

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

interface TrainingEvaluationPageProps {
  darkMode: boolean;
  navigateTo: (page: string) => void;
}

const TrainingEvaluationPage: React.FC<TrainingEvaluationPageProps> = ({ darkMode, navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'training'>('metrics');
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    { id: 1, name: 'Techniques de génération de données', samples: 1250, lastUpdated: '2023-10-15', selected: true, distribution: 30 },
    { id: 2, name: 'Analyse de sentiments', samples: 850, lastUpdated: '2023-11-02', selected: true, distribution: 25 },
    { id: 3, name: 'Classification de documents', samples: 1500, lastUpdated: '2023-09-28', selected: true, distribution: 20 },
    { id: 4, name: 'Extraction d\'entités', samples: 720, lastUpdated: '2023-10-30', selected: false, distribution: 0 },
    { id: 5, name: 'Résumé automatique', samples: 950, lastUpdated: '2023-11-10', selected: true, distribution: 25 },
  ]);
  
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([
    {
      id: 1,
      date: '2023-11-15',
      duration: '4h 32m',
      baseModel: 'gpt-4-base',
      checkpoint: null,
      metrics: {
        accuracy: 0.89,
        loss: 0.23,
        f1Score: 0.87
      },
      knowledgeBases: ['Techniques de génération de données', 'Analyse de sentiments']
    },
    {
      id: 2,
      date: '2023-11-20',
      duration: '5h 15m',
      baseModel: 'gpt-4-base',
      checkpoint: 'checkpoint-20231115',
      metrics: {
        accuracy: 0.92,
        loss: 0.18,
        f1Score: 0.91
      },
      knowledgeBases: ['Techniques de génération de données', 'Analyse de sentiments', 'Classification de documents']
    },
    {
      id: 3,
      date: '2023-12-01',
      duration: '6h 45m',
      baseModel: 'gpt-4-base',
      checkpoint: 'checkpoint-20231120',
      metrics: {
        accuracy: 0.94,
        loss: 0.15,
        f1Score: 0.93
      },
      knowledgeBases: ['Techniques de génération de données', 'Analyse de sentiments', 'Classification de documents', 'Résumé automatique']
    }
  ]);
  
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetric[]>([
    { id: 1, name: 'Précision', value: 94.2, change: 2.1, date: '2023-12-01', checkpoint: 'checkpoint-20231201' },
    { id: 2, name: 'Rappel', value: 91.5, change: 1.8, date: '2023-12-01', checkpoint: 'checkpoint-20231201' },
    { id: 3, name: 'F1-Score', value: 92.8, change: 1.9, date: '2023-12-01', checkpoint: 'checkpoint-20231201' },
    { id: 4, name: 'Perte', value: 0.15, change: -0.03, date: '2023-12-01', checkpoint: 'checkpoint-20231201' }
  ]);
  
  const [baseModel, setBaseModel] = useState('gpt-4-base');
  const [useCheckpoint, setUseCheckpoint] = useState(true);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('checkpoint-20231201');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  const toggleKnowledgeSelection = (id: number) => {
    setKnowledgeBases(prev => 
      prev.map(kb => 
        kb.id === id 
          ? { ...kb, selected: !kb.selected, distribution: !kb.selected ? 20 : 0 } 
          : kb
      )
    );
  };
  
  const updateDistribution = (id: number, value: number) => {
    setKnowledgeBases(prev => 
      prev.map(kb => 
        kb.id === id 
          ? { ...kb, distribution: value } 
          : kb
      )
    );
  };
  
  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          
          // Add new training session
          const newSession = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            duration: '3h 45m',
            baseModel: baseModel,
            checkpoint: useCheckpoint ? selectedCheckpoint : null,
            metrics: {
              accuracy: 0.95,
              loss: 0.12,
              f1Score: 0.94
            },
            knowledgeBases: knowledgeBases
              .filter(kb => kb.selected)
              .map(kb => kb.name)
          };
          
          setTrainingSessions(prev => [newSession, ...prev]);
          
          // Update metrics
          const newMetrics = [
            { id: Date.now(), name: 'Précision', value: 95.0, change: 0.8, date: newSession.date, checkpoint: `checkpoint-${newSession.date.replace(/-/g, '')}` },
            { id: Date.now() + 1, name: 'Rappel', value: 92.3, change: 0.8, date: newSession.date, checkpoint: `checkpoint-${newSession.date.replace(/-/g, '')}` },
            { id: Date.now() + 2, name: 'F1-Score', value: 93.6, change: 0.8, date: newSession.date, checkpoint: `checkpoint-${newSession.date.replace(/-/g, '')}` },
            { id: Date.now() + 3, name: 'Perte', value: 0.12, change: -0.03, date: newSession.date, checkpoint: `checkpoint-${newSession.date.replace(/-/g, '')}` }
          ];
          
          setTrainingMetrics(newMetrics);
          setSelectedCheckpoint(`checkpoint-${newSession.date.replace(/-/g, '')}`);
          
          return 100;
        }
        return prev + 0.5;
      });
    }, 100);
  };
  
  const openChat = (metric: TrainingMetric) => {
    setSelectedSession(trainingSessions.find(s => s.checkpoint === metric.checkpoint) || null);
    setIsChatOpen(true);
    setChatMessages([
      {
        sender: 'system',
        content: `Chat d'évaluation pour le checkpoint ${metric.checkpoint} (${metric.date})`
      }
    ]);
  };
  
  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedSession(null);
    setChatMessages([]);
    setChatMessage('');
  };
  
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, {
      sender: 'user',
      content: chatMessage
    }]);
    
    const userMsg = chatMessage;
    setChatMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        content: `Voici ma réponse à votre question "${userMsg}" basée sur le checkpoint ${selectedSession?.checkpoint}. Cette réponse est générée en utilisant les connaissances acquises lors de l'entraînement du ${selectedSession?.date}.`
      }]);
    }, 1000);
  };
  
  const calculateTotalDistribution = () => {
    return knowledgeBases.reduce((sum, kb) => sum + (kb.selected ? kb.distribution : 0), 0);
  };
  
  const totalDistribution = calculateTotalDistribution();
  
  return (
    <div className="flex-1 p-6">
      {isChatOpen ? (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Test du Checkpoint: {selectedSession?.checkpoint}</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Date d'entraînement: {selectedSession?.date} • Précision: {selectedSession?.metrics.accuracy * 100}%
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
                  <div className="inline-block max-w-3/4 p-3 rounded-lg bg-indigo-600 text-white">
                    <p>{msg.content}</p>
                  </div>
                )}
                
                {msg.sender === 'ai' && (
                  <div className={`inline-block max-w-3/4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Entraînement et Évaluation</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Suivez les performances de vos modèles et lancez de nouveaux cycles d'entraînement
            </p>
          </div>
          
          <div className="mb-6">
            <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'metrics' 
                    ? darkMode 
                      ? 'border-b-2 border-indigo-500 text-indigo-400' 
                      : 'border-b-2 border-indigo-600 text-indigo-600'
                    : darkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('metrics')}
              >
                Métriques d'Évaluation
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'training' 
                    ? darkMode 
                      ? 'border-b-2 border-indigo-500 text-indigo-400' 
                      : 'border-b-2 border-indigo-600 text-indigo-600'
                    : darkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('training')}
              >
                Lancer un Entraînement
              </button>
            </div>
          </div>
          
          {activeTab === 'metrics' ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart size={20} className="mr-2 text-indigo-500" />
                Dernières Métriques d'Entraînement
              </h2>
              
              {/* Fix: Replace TrainingMetricCard with inline card component */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {trainingMetrics.map(metric => (
                  <div 
                    key={metric.id}
                    onClick={() => openChat(metric)}
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
                ))}
              </div>
              
              {/* ... rest of the metrics tab content ... */}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Play size={20} className="mr-2 text-indigo-500" />
                Lancer un Entraînement
              </h2>
              <div
                baseModel={baseModel}
                setBaseModel={setBaseModel}
                useCheckpoint={useCheckpoint}
                setUseCheckpoint={setUseCheckpoint}
                selectedCheckpoint={selectedCheckpoint}
                setSelectedCheckpoint={setSelectedCheckpoint}
                isTraining={isTraining}
                trainingProgress={trainingProgress}
                startTraining={startTraining}
                knowledgeBases={knowledgeBases}
                toggleKnowledgeSelection={toggleKnowledgeSelection}
                updateDistribution={updateDistribution}
                totalDistribution={totalDistribution}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default TrainingEvaluationPage;