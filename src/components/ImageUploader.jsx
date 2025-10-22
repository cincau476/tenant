import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

const ImageUploader = ({ initialImage, onImageSelect }) => {
  const [preview, setPreview] = useState(initialImage);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = (e) => {
    e.stopPropagation(); // Mencegah trigger klik pada div
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input file
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg"
        />
        {preview ? (
            <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                <img src={preview} alt="Pratinjau Stand" className="w-full h-full object-cover" />
                <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>
        ) : (
            <div 
                onClick={handleContainerClick}
                className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
                <div className="p-4 bg-gray-100 rounded-full mb-2">
                    <UploadCloud size={32} className="text-gray-500" />
                </div>
                <p className="font-semibold text-blue-600">Upload Gambar</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG hingga 5MB</p>
            </div>
        )}
    </div>
  );
};

export default ImageUploader;
