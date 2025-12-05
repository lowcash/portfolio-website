import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  description: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Reusable card component with icon, title, and content
 * Used across all section cards for consistency
 */
export function Card({ 
  icon: Icon, 
  iconColor = 'text-gray-400',
  title, 
  subtitle,
  description, 
  children,
  style,
  className = ''
}: CardProps) {
  return (
    <div 
      className={`rounded-2xl p-8 transition-all duration-500 flex flex-col ${className}`}
      style={style}
    >
      <div className="flex items-start gap-4 mb-4">
        {Icon && <Icon className={`w-10 h-10 ${iconColor} shrink-0`} />}
        <div className="grow">
          <h3 className="text-xl mb-1 text-white">{title}</h3>
          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        </div>
      </div>
      <p className={`text-gray-400 ${children ? 'mb-6' : ''}`}>{description}</p>
      {children}
    </div>
  );
}