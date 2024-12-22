import { ChangeEvent, useState } from 'react';
import { Edit, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import * as React from 'react';

interface AvatarUploadProps {
  onAvatarChange: (file: File) => void;
  currentAvatarUrl?: string;
}

export default function AvatarUpload({
  onAvatarChange,
  currentAvatarUrl,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentAvatarUrl || undefined
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <label className="relative w-24 h-24 cursor-pointer group">
        <Avatar className="h-full w-full rounded-full">
          <AvatarImage src={previewUrl} alt="avatar" />
          <AvatarFallback>
            <UserRound
              size={32}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit className="h-6 w-6 text-white" />
        </div>
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
