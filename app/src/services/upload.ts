// import { db } from '@/config/firebase';

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

// Upload image to external service (ImgBB - free tier)
// You can also use Cloudinary, Imgur, or any other service
/*
const uploadToImgBB = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY || 'demo_key'; // Add your ImgBB API key
  
  onProgress?.(20);
  
  const formData = new FormData();
  formData.append('image', file);
  
  onProgress?.(40);
  
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });
  
  onProgress?.(80);
  
  if (!response.ok) {
    throw new Error('Failed to upload to ImgBB');
  }
  
  const data = await response.json();
  onProgress?.(100);
  
  return data.data.url;
};
*/

// Simple URL input - just store the URL directly
export const saveImageUrl = async (url: string): Promise<string> => {
  // Validate URL format
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error('Invalid URL format');
  }
};

// Convert file to base64 data URL (for small images only)
export const uploadImageAsDataURL = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    onProgress?.(10);

    // Compress if needed
    let processedFile = file;
    if (file.size > 100 * 1024) {
      processedFile = await compressImage(file, 800, 0.7);
    }

    onProgress?.(50);

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(processedFile);
    });

    onProgress?.(100);
    return dataUrl;

  } catch (error: any) {
    console.error('Data URL conversion error:', error);
    throw new Error(error.message || 'Failed to process image');
  }
};

// Compress image
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, 1);
      const newWidth = Math.floor(img.width * ratio);
      const newHeight = Math.floor(img.height * ratio);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Primary upload method - uses external service or data URL
export const uploadImage = async (
  file: File,
  _folder: string = 'images',
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image size must be less than 10MB');
    }

    onProgress?.(5);

    // Option 1: Use external image hosting (ImgBB, Cloudinary, etc.)
    // Uncomment and add API key in .env file: VITE_IMGBB_API_KEY=your_key
    // return await uploadToImgBB(file, onProgress);

    // Option 2: Use data URLs (stores image as base64 in Firestore)
    // Good for small images, but increases Firestore storage
    console.log('Using data URL upload (storing in Firestore)');
    return await uploadImageAsDataURL(file, onProgress);

  } catch (error: any) {
    console.error('Upload failed:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

// Upload multiple images sequentially
export const uploadMultipleImages = async (
  files: FileList | File[],
  folder: string = 'images',
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  const fileArray = Array.from(files);
  const results: string[] = [];
  
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    
    try {
      const url = await uploadImage(file, folder, (fileProgress) => {
        const overallProgress = ((i * 100) + fileProgress) / fileArray.length;
        onProgress?.(overallProgress);
      });
      
      results.push(url);
      
      // Small delay between uploads
      if (i < fileArray.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      throw error;
    }
  }
  
  return results;
};

// Delete image (only works for external services, not data URLs)
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    if (imageUrl.startsWith('data:')) {
      console.log('Data URL - no deletion needed');
      return;
    }

    if (imageUrl.startsWith('http')) {
      console.log('External URL - deletion not supported');
      return;
    }

    console.log('Image deletion not implemented for this storage method');
  } catch (error: any) {
    console.error('Failed to delete image:', error);
  }
};
