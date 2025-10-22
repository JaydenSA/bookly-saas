'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSnackbar } from '@/hooks/useSnackbar';

import { ImageUploadProps } from '@/types';

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  className = '' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  const handleUpload = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      showError(`You can only upload up to ${maxImages} images`);
      return;
    }

    const loadingToast = showLoading('Uploading images...', {
      description: 'Please wait while we upload your images',
    });

    try {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not a valid image file`);
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`);
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
      
      dismiss(loadingToast);
      showSuccess(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error('Error uploading images:', err);
      dismiss(loadingToast);
      showError('Failed to upload images', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, onImagesChange, showError, showSuccess, showLoading, dismiss]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    
    // Update the UI immediately
    onImagesChange(newImages);
    
    // Delete the file from server
    try {
      const response = await fetch(`/api/upload/image/delete?url=${encodeURIComponent(imageToRemove)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        console.warn('Failed to delete image from server:', imageToRemove);
        // Don't show error to user since UI is already updated
      }
    } catch (error) {
      console.error('Error deleting image from server:', error);
      // Don't show error to user since UI is already updated
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={openFileDialog}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Click to upload
            </button>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB each (max {maxImages} images)
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-80 hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload More Button */}
      {images.length > 0 && images.length < maxImages && (
        <Button
          variant="outline"
          onClick={openFileDialog}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload More Images ({images.length}/{maxImages})
        </Button>
      )}
    </div>
  );
}
