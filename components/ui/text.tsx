import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'mono' | 'sans';
}

export function Text({ className, variant = 'sans', ...props }: TextProps) {
  return (
    <p
      className={cn(
        'text-white text-lg',
        variant === 'mono' && 'font-[family-name:var(--font-geist-mono)]',
        variant === 'sans' && 'font-[family-name:var(--font-geist-sans)]',
        className
      )}
      {...props}
    />
  );
}
