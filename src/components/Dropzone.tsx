import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface Props {
  onImageUpload: (file: string) => void;
}

export const Dropzone: React.FC<Props> = ({ onImageUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        flex flex-col items-center justify-center
        transition-colors duration-200 ease-in-out
        cursor-pointer
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-300 hover:border-indigo-400'
        }
      `}
    >
      <input {...getInputProps()} />
      <Upload 
        className={`w-12 h-12 mb-4 ${
          isDragActive ? 'text-indigo-500' : 'text-gray-400'
        }`}
      />
      <p className="text-center text-gray-600">
        {isDragActive
          ? 'Drop your image here...'
          : 'Drag & drop an image here, or click to select'}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Supports PNG, JPG, JPEG, GIF
      </p>
    </div>
  );
};