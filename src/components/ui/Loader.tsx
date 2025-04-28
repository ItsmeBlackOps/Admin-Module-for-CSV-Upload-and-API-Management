import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-10 h-10'
  };

  return (
    <Loader2 
      className={`animate-spin text-indigo-600 ${sizeMap[size]} ${className}`} 
    />
  );
};