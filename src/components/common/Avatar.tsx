import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  avatarBg?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
  avatarBg,
}) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getColorFromName = (str: string) => {
    if (avatarBg) return avatarBg;
    const colors = [
      'bg-blue-600',
      'bg-indigo-600',
      'bg-violet-600',
      'bg-emerald-600',
      'bg-teal-600',
      'bg-cyan-600',
      'bg-sky-600',
      'bg-rose-600',
      'bg-amber-600',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-16 h-16 text-xl font-bold',
  }[size];

  const bgColor = getColorFromName(name);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full text-white font-medium select-none shadow-xs shrink-0 ${bgColor} ${sizeClasses} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
