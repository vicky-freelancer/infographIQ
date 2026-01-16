import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

// A simplified mapping or fallback mechanism
export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className, size = 24 }) => {
  // Normalize name: lowercase, remove spaces
  const normalized = name.toLowerCase().trim().replace(/\s+/g, '-');
  
  // Capitalize for Lucide lookup (e.g., "rocket" -> "Rocket")
  // We try to find a matching icon in lucide-react, otherwise fallback to 'Sparkles'
  const lucideName = Object.keys(LucideIcons).find(key => key.toLowerCase() === normalized);
  
  const IconComponent = lucideName 
    ? (LucideIcons as any)[lucideName] 
    : LucideIcons.Info; // Fallback

  return <IconComponent className={className} size={size} />;
};
