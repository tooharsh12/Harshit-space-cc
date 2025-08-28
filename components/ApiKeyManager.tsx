
import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        setApiKey(storedKey);
        setIsKeySet(true);
      } else {
        setApiKey('');
        setIsKeySet(false);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsKeySet(true);
      onKeySaved();
      onClose();
    } else {
      alert('Please enter a valid API key.');
    }
  };
  
  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsKeySet(false);
    onKeySaved();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">API Key Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close settings">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-400 mb-4">
          This app requires a Google Gemini API key to function. Your key is stored securely in your browser's local storage and is never shared.
        </p>
        <p className="text-gray-400 mb-6">
          You can get a free API key from{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            Google AI Studio
          </a>.
        </p>

        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
            Your Gemini API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter your API key here"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-md shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            disabled={!apiKey.trim()}
          >
            Save Key
          </button>
          <button
            onClick={handleClear}
            disabled={!isKeySet}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-bold rounded-md transition-colors hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
