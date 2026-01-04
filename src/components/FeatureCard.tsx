import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  compact?: boolean;
  fill?: boolean;
}

const FeatureCard = ({ to, title, description, icon, color, compact, fill }: FeatureCardProps) => {
  if (fill) {
    return (
      <Link 
        to={to}
        className={cn(
          "flex flex-col bg-white rounded-2xl p-4 shadow-soft w-full",
          "border-r-4 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        )}
        style={{ borderRightColor: color }}
      >
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-2" 
          style={{ backgroundColor: `${color}15` }}
        >
          {React.cloneElement(icon as React.ReactElement, { 
            size: 22,
            style: { color } 
          })}
        </div>
        <h3 className="font-bold text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </Link>
    );
  }

  if (compact) {
    return (
      <Link 
        to={to}
        className={cn(
          "block bg-white rounded-2xl p-3 shadow-soft",
          "border-r-4 hover:scale-[1.02] active:scale-[0.98] transition-transform h-full"
        )}
        style={{ borderRightColor: color }}
      >
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" 
          style={{ backgroundColor: `${color}20` }}
        >
          {React.cloneElement(icon as React.ReactElement, { 
            style: { color } 
          })}
        </div>
        <h3 className="font-bold text-sm mb-0.5">{title}</h3>
        <p className="text-[11px] text-muted-foreground leading-tight">{description}</p>
      </Link>
    );
  }

  return (
    <Link 
      to={to}
      className={cn(
        "feature-card flex items-center gap-4 bg-white",
        "border-r-4 hover:translate-x-1 transition-transform"
      )}
      style={{ borderRightColor: color }}
    >
      <div 
        className="p-3 rounded-full flex items-center justify-center" 
        style={{ backgroundColor: `${color}20` }}
      >
        {React.cloneElement(icon as React.ReactElement, { 
          size: 28, 
          className: "text-tameny-primary",
          style: { color } 
        })}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
};

export default FeatureCard;
