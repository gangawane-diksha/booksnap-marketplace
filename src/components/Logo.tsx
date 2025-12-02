import { BookOpen } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <BookOpen className={`${sizeClasses[size]} text-primary`} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-terracotta rounded-full animate-bounce" />
      </div>
      {showText && (
        <span className={`font-serif font-bold ${textSizeClasses[size]} text-foreground`}>
          Book<span className="text-primary">Snap</span>
        </span>
      )}
    </div>
  );
}
