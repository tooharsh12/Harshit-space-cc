import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Footer from './components/Footer';
import type { ImageInfo } from './types';
import { generateVirtualTryOnImage } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageInfo | null>(null);
  const [clothImage, setClothImage] = useState<ImageInfo | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  const fileToImageInfo = (file: File): Promise<ImageInfo> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // Read the file as a data URL to load it into an Image object
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        if (!e.target?.result) {
          return reject(new Error("Failed to read file."));
        }
        
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Set a max dimension for the images to optimize performance and reduce payload size.
          const MAX_DIMENSION = 1024;
          let { width, height } = img;

          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }
          
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not get canvas context for image conversion.'));
          }
          ctx.drawImage(img, 0, 0, width, height);

          // Convert the image to PNG format, which is widely supported by Gemini.
          // This also solves the issue with unsupported formats like AVIF.
          const dataUrl = canvas.toDataURL('image/png');
          const base64 = dataUrl.split(',')[1];
          resolve({ base64, mimeType: 'image/png', name: file.name });
        };
        img.onerror = () => reject(new Error('The selected file could not be loaded as an image. It may be corrupted or in an unsupported format.'));
        img.src = e.target.result as string;
      };
      reader.onerror = (error) => reject(error);
    });
  };


  const handlePersonImageUpload = async (file: File | null) => {
    if (file) {
      try {
        setError(null);
        const info = await fileToImageInfo(file);
        setPersonImage(info);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(errorMessage);
        setPersonImage(null);
      }
    } else {
      setPersonImage(null);
    }
  };

  const handleClothImageUpload = async (file: File | null) => {
    if (file) {
       try {
        setError(null);
        const info = await fileToImageInfo(file);
        setClothImage(info);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(errorMessage);
        setClothImage(null);
      }
    } else {
      setClothImage(null);
    }
  };
  
  const handleGenerate = useCallback(async () => {
    if (!personImage || !clothImage) {
      setError("Please upload both your photo and a clothing item photo.");
      return;
    }

    setIsLoading(true);
    setResultImage(null);
    setError(null);
    
    try {
      const generatedImage = await generateVirtualTryOnImage(personImage, clothImage);
      setResultImage(generatedImage);
    } catch (e) {
      console.error(e);
      let displayError: string;
      if (e instanceof Error) {
          if (e.message.includes('PERMISSION_DENIED')) {
              displayError = "There seems to be a service configuration issue. We are unable to process your request at this time. Please try again later.";
          } else {
              const cleanedMessage = e.message.replace('Gemini API Error:', '').trim();
              displayError = `Failed to generate image. ${cleanedMessage}`;
          }
      } else {
          displayError = "Failed to generate image due to an unknown error.";
      }
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothImage]);

  useEffect(() => {
    // FIX: Changed NodeJS.Timeout to ReturnType<typeof setInterval> for browser compatibility.
    // NodeJS.Timeout is a Node.js specific type, while browser's setInterval returns a number.
    // ReturnType<typeof setInterval> correctly infers the return type in any JS environment.
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      let messageIndex = 0;
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col antialiased">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ImageUploader id="person-uploader" title="1. Your Photo" description="Upload a clear, front-facing photo of yourself." onImageUpload={handlePersonImageUpload} />
            <ImageUploader id="cloth-uploader" title="2. Clothing Item" description="Upload a photo of the clothing item, preferably on a plain background." onImageUpload={handleClothImageUpload} />
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={!personImage || !clothImage || isLoading}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg shadow-blue-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Styling Your Look...' : 'Visualize My Style'}
            </button>
          </div>
          
          <ResultDisplay image={resultImage} isLoading={isLoading} loadingMessage={loadingMessage} error={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;