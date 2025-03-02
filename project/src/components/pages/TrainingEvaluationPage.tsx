import React, { useState, useEffect } from 'react';
import { BarChart, CheckCircle, Play, Database, Brain, ArrowRight, ChevronRight } from 'lucide-react';
import TrainingMetricCard from '../training/TrainingMetricCard';
import TrainingForm from '../training/TrainingForm';
import ModelChatInterface from '../training/ModelChatInterface';
import trainingService, { TrainingSession, TrainingMetric } from '../../services/training.service';
import knowledgeBaseService, { KnowledgeBase as ApiKnowledgeBase } from '../../services/knowledge-base.service';

// Keep all interfaces
interface KnowledgeBase {
  id: number;
  name: string;
  samples: number;
  lastUpdated: string;
  selected: boolean;
  distribution: number;
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
  
  // State definitions
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetric[]>([]);
  
  const [baseModel, setBaseModel] = useState('gpt-4-base');
  const [useCheckpoint, setUseCheckpoint] = useState(true);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('checkpoint-20231201');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentTrainingSessionId, setCurrentTrainingSessionId] = useState<number | null>(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch knowledge bases
        const kbData = await knowledgeBaseService.getKnowledgeBases();
        setKnowledgeBases(kbData.map(kb => ({
          ...kb,
          selected: false,
          distribution: 0
        })));
        
        // Fetch training sessions
        const sessionsData = await trainingService.getTrainingSessions();
        setTrainingSessions(sessionsData);
        
        // Fetch training metrics
        const metricsData = await trainingService.getTrainingMetrics();
        setTrainingMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Functions
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
  
  const startTraining = async () => {
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      
      // Prepare request payload
      const request = {
        baseModel,
        useCheckpoint,
        checkpointId: selectedCheckpoint,
        knowledgeBases: knowledgeBases
          .filter(kb => kb.selected)
          .map(kb => ({
            id: kb.id,
            distribution: kb.distribution
          }))
      };
      
      // Start training session
      const response = await trainingService.startTrainingSession(request);
      setCurrentTrainingSessionId(response.sessionId);
      
      // Poll for training progress
      const progressInterval = setInterval(async () => {
        if (currentTrainingSessionId) {
          try {
            const progressData = await trainingService.getTrainingProgress(currentTrainingSessionId);
            setTrainingProgress(progressData.progress);
            
            if (progressData.status !== 'training') {
              clearInterval(progressInterval);
              setIsTraining(false);
              
              // Refresh training sessions and metrics
              const sessionsData = await trainingService.getTrainingSessions();
              setTrainingSessions(sessionsData);
              
              const metricsData = await trainingService.getTrainingMetrics();
              setTrainingMetrics(metricsData);
              
              // Update selected checkpoint to the latest one
              if (metricsData.length > 0) {
                setSelectedCheckpoint(metricsData[0].checkpoint);
              }
            }
          } catch (error) {
            console.error('Error fetching training progress:', error);
          }
        }
      }, 2000);
    } catch (error) {
      console.error('Error starting training:', error);
      setIsTraining(false);
    }
  };
  const openChat = async (metric: TrainingMetric) => {
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
  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedSession?.checkpoint) return;
    
    // Add user message
    setChatMessages(prev => [...prev, {
      sender: 'user',
      content: chatMessage
    }]);
    
    const userMsg = chatMessage;
    setChatMessage('');
    
    try {
      // Send message to API
      const response = await trainingService.testCheckpoint(
        selectedSession.checkpoint || '', 
        { message: userMsg }
      );
      
      // Add AI response
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        content: response.response
      }]);
    } catch (error) {
      console.error('Error testing checkpoint:', error);
      
      // Add error message
      setChatMessages(prev => [...prev, {
        sender: 'system',
        content: 'Une erreur est survenue lors de la communication avec le modèle.'
      }]);
    }
  };
  const calculateTotalDistribution = () => {
    return knowledgeBases.reduce((sum, kb) => sum + (kb.selected ? kb.distribution : 0), 0);
  };
  const totalDistribution = calculateTotalDistribution();
  return (
    <div className="flex-1 p-6">
      {isChatOpen ? (
        <ModelChatInterface 
          darkMode={darkMode}
          selectedSession={selectedSession}
          chatMessages={chatMessages}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          sendChatMessage={sendChatMessage}
          closeChat={closeChat}
        />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {trainingMetrics.map(metric => (
                  <TrainingMetricCard 
                    key={metric.id}
                    metric={metric}
                    darkMode={darkMode}
                    onClick={() => openChat(metric)}
                  />
                ))}
              </div>
              
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Brain size={20} className="mr-2 text-indigo-500" />
                Sessions d'Entraînement
              </h2>
              
              <div className="overflow-x-auto">
                <table className={`min-w-full ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <thead>
                    <tr className={darkMode ? 'border-b border-gray-700' : 'border-b border-gray-300'}>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Durée</th>
                      <th className="py-3 px-4 text-left">Modèle de base</th>
                      <th className="py-3 px-4 text-left">Checkpoint</th>
                      <th className="py-3 px-4 text-left">Précision</th>
                      <th className="py-3 px-4 text-left">Knowledge Bases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainingSessions.map(session => (
                      <tr 
                        key={session.id} 
                        className={`cursor-pointer hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                        onClick={() => {
                          const metric = trainingMetrics.find(m => m.checkpoint === session.checkpoint);
                          if (metric) openChat(metric);
                        }}
                      >
                        <td className="py-3 px-4">{session.date}</td>
                        <td className="py-3 px-4">{session.duration}</td>
                        <td className="py-3 px-4">{session.baseModel}</td>
                        <td className="py-3 px-4">{session.checkpoint || 'Aucun'}</td>
                        <td className="py-3 px-4">{(session.metrics.accuracy * 100).toFixed(1)}%</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {session.knowledgeBases.map((kb, idx) => (
                              <span 
                                key={idx} 
                                className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {kb}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Play size={20} className="mr-2 text-indigo-500" />
                Lancer un Entraînement
              </h2>
              <TrainingForm
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
                darkMode={darkMode}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrainingEvaluationPage;