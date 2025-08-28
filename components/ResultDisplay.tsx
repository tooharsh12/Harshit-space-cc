
import React from 'react';

interface ResultDisplayProps {
  image: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ImageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, isLoading, loadingMessage, error }) => {
  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-xl min-h-[50vh] flex flex-col items-center justify-center p-6 transition-all duration-300">
      {isLoading && (
        <div className="text-center">
          <LoadingSpinner />
          <h3 className="text-2xl font-bold text-white mt-4">Generating Your Look...</h3>
          <p className="text-cyan-300 mt-2 animate-pulse">{loadingMessage}</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center text-red-400">
          <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h3>
          <p>{error}</p>
        </div>
      )}

      {image && !isLoading && (
        <div className="w-full flex flex-col items-center">
          <h3 className="text-3xl font-bold text-white mb-4">Your New Look!</h3>
          <div className="max-w-lg w-full rounded-lg overflow-hidden shadow-2xl shadow-black/50">
            <img src={image} alt="Generated virtual try-on" className="w-full h-auto object-contain" />
          </div>
          <a
            href={image}
            download="my-virtual-try-on.png"
            className="mt-6 px-8 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold text-lg rounded-full shadow-lg shadow-teal-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Download Image
          </a>
        </div>
      )}

      {!image && !isLoading && !error && (
        <div className="text-center text-gray-500">
          <ImageIcon/>
          <h3 className="text-2xl font-bold mt-4">Your result will appear here</h3>
          <p>Upload your images and click "Visualize My Style" to see the magic.</p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
