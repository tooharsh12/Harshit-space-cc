
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onImageUpload: (file: File | null) => void;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      onImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileName('');
    onImageUpload(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-800/50 border border-dashed border-gray-600 rounded-xl p-6 text-center transition-all duration-300 hover:border-cyan-500 hover:bg-gray-800 group">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="relative w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
              aria-label="Remove image"
            >
              <CloseIcon />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-semibold text-cyan-400 cursor-pointer" onClick={() => fileInputRef.current?.click()}>Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-600">PNG, JPG, WEBP, AVIF, HEIC</p>
          </div>
        )}
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/png, image/jpeg, image/webp, image/avif, image/heic"
          onChange={handleFileChange}
        />
      </div>
      {fileName && <p className="mt-3 text-sm text-gray-400 truncate">File: {fileName}</p>}
    </div>
  );
};

export default ImageUploader;
