
import React, { useState, useCallback } from 'react';
import { InventoryItem } from './types';
import { analyzeEquipmentImage } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { InventoryCard } from './components/InventoryCard';
import { Loader } from './components/Loader';
import { GithubIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null, base64: string | null) => {
    setImageFile(file);
    setImageBase64(base64);
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageBase64 || !imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newItem = await analyzeEquipmentImage(imageBase64, imageFile.type);
      setInventoryItems(prevItems => [{ ...newItem, id: Date.now().toString(), image: URL.createObjectURL(imageFile) }, ...prevItems]);
      setImageFile(null);
      setImageBase64(null);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64, imageFile]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <div className="container mx-auto px-4 py-8">
        
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <SparklesIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              AI Factory Inventory
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload a picture of factory equipment. Gemini will analyze it, perform OCR on data plates, and generate a structured inventory entry automatically.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">1. Upload Equipment Image</h2>
            <ImageUploader onImageChange={handleImageChange} currentImage={imageFile} />
            
            <button
              onClick={handleAnalyzeClick}
              disabled={!imageFile || isLoading}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader />
                  Analyzing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Analyze Equipment
                </>
              )}
            </button>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg lg:col-span-1">
             <h2 className="text-2xl font-semibold mb-4 text-cyan-400">2. Generated Inventory</h2>
             <div className="h-[60vh] overflow-y-auto pr-2 space-y-4">
              {inventoryItems.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7v10m16-10v10m-8 4v-5m-4 2l4-2m0 0l4-2m-4 2v5" />
                      </svg>
                      <p className="text-lg">Your inventory will appear here.</p>
                  </div>
              )}
               {isLoading && inventoryItems.length === 0 && (
                 <div className="flex items-center justify-center h-full">
                    <Loader />
                 </div>
               )}
              {inventoryItems.map(item => (
                <InventoryCard key={item.id} item={item} />
              ))}
             </div>
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500">
          <a href="https://github.com/google/genai-patterns" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors">
            <GithubIcon className="w-5 h-5"/>
            Powered by Gemini
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
