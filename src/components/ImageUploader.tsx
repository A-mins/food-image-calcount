
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, []);

  const processFile = useCallback((file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageUpload(file);
  }, [onImageUpload]);

  const resetImage = useCallback(() => {
    setPreviewImage(null);
  }, []);

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        {!previewImage ? (
          <div 
            className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-2">Drag and drop your food image here</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
              </div>
              <label className="cursor-pointer">
                <Button className="bg-primary hover:bg-primary/90 flex gap-2 items-center">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full h-64 mb-4 overflow-hidden rounded-md">
              <img 
                src={previewImage} 
                alt="Food preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={resetImage}>
                Upload Different Image
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Analyze Calories
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
