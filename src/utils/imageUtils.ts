import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.2, // ~200KB limit
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: 'image/webp' // webp for better compression
  };
  
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Error compressing image', error);
    return file; // fallback to original file if compression fails
  }
}

export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
