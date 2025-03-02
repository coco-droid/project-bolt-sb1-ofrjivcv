import React, { useState, useRef } from 'react';
import { Upload, FileText, Database } from 'lucide-react';
import conversationService from '../../services/conversation.service';
import apiService from '../../services/api.service';

interface LoadConversationPageProps {
  darkMode: boolean;
  navigateTo: (page: string) => void;
}

const LoadConversationPage: React.FC<LoadConversationPageProps> = ({ darkMode, navigateTo }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const file = files[0];
      // Use apiService instead of conversationService for file upload
      await apiService.uploadFile('/conversations/upload', file);
      navigateTo('history');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Une erreur est survenue lors du téléchargement du fichier');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow m-4`}>
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Upload size={24} className="mr-2 text-indigo-600" />
        Charger une conversation
      </h1>
      
      <div 
        className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 text-center mb-6`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-col items-center">
          <FileText size={48} className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className="mb-2">Glissez-déposez vos fichiers ici ou</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".json,.csv,.txt"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <button 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Téléchargement...' : 'Parcourir les fichiers'}
          </button>
          <p className="mt-2 text-sm text-gray-500">Formats supportés: .json, .csv, .txt</p>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadConversationPage;