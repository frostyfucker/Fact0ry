
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageChange: (file: File | null, base64: string | null) => void;
  currentImage: File | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageChange(file, base64String);
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(null, null);
      setPreviewUrl(null);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);
  
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const resetImage = () => {
      handleFileChange(null);
  };

  if (currentImage && previewUrl) {
    return (
      <div className="relative">
        <img src={previewUrl} alt="Equipment preview" className="w-full h-64 object-cover rounded-lg shadow-md" />
        <button 
            onClick={resetImage} 
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-colors"
            aria-label="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <label
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-cyan-400 bg-slate-700' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'}`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
        <UploadIcon className="w-10 h-10 mb-3" />
        <p className="mb-2 text-sm"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
        <p className="text-xs">PNG, JPG, or WEBP</p>
      </div>
      <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={onInputChange} />
    </label>
  );
};
