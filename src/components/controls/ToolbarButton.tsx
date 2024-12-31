import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
}

export const ToolbarButton: React.FC<Props> = ({
  label,
  icon: Icon,
  onClick,
  active
}) => (
  <button
    onClick={onClick}
    className={`
      relative overflow-hidden
      flex items-center gap-2 px-6 py-3
      text-sm font-medium rounded-lg
      transition-all duration-300
      before:absolute before:inset-0
      before:transition-transform before:duration-300
      before:translate-x-full hover:before:translate-x-0
      before:bg-gradient-to-r before:from-indigo-600/10 before:to-indigo-600/20
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
      ${active
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
        : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:border-indigo-300'
      }
    `}
  >
    <Icon className={`
      w-5 h-5 transition-transform duration-300
      group-hover:scale-110 relative z-10
      ${active ? 'text-white' : 'text-indigo-600'}
    `} />
    <span className="relative z-10">{label}</span>
  </button>
);