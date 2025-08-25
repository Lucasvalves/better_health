
"use client"
import { useState, useRef} from "react";

export default function useEditProfileModel(){
  const [imageUrl, setImageUrl] = useState<string | null >(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem');
        return;
      }
      
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  return{
    handleFileChange,
    triggerFileInput,
    imageUrl,
  }
}

