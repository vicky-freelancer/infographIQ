
import React from 'react';
import { InfographicData, ThemeColor } from '../types';
import { DynamicIcon } from './Icons';

interface InfographicPreviewProps {
  data: InfographicData;
  headerImage: string | null;
  theme: ThemeColor;
  id?: string;
}

const themeStyles: Record<ThemeColor, { bg: string, text: string, accent: string, accentBg: string, card: string }> = {
  [ThemeColor.Blue]: {
    bg: 'bg-slate-900',
    text: 'text-blue-100',
    accent: 'text-blue-400',
    accentBg: 'bg-blue-500',
    card: 'bg-slate-800/50 border-slate-700'
  },
  [ThemeColor.Purple]: {
    bg: 'bg-indigo-950',
    text: 'text-indigo-100',
    accent: 'text-purple-400',
    accentBg: 'bg-purple-500',
    card: 'bg-indigo-900/50 border-indigo-800'
  },
  [ThemeColor.Emerald]: {
    bg: 'bg-teal-950',
    text: 'text-teal-100',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    card: 'bg-teal-900/50 border-teal-800'
  },
  [ThemeColor.Orange]: {
    bg: 'bg-orange-950',
    text: 'text-orange-100',
    accent: 'text-orange-400',
    accentBg: 'bg-orange-500',
    card: 'bg-orange-900/50 border-orange-800'
  },
  [ThemeColor.Pink]: {
    bg: 'bg-pink-950',
    text: 'text-pink-100',
    accent: 'text-pink-400',
    accentBg: 'bg-pink-500',
    card: 'bg-pink-900/50 border-pink-800'
  },
  [ThemeColor.Crimson]: {
    bg: 'bg-red-950',
    text: 'text-red-100',
    accent: 'text-red-400',
    accentBg: 'bg-red-600',
    card: 'bg-red-900/50 border-red-800'
  },
  [ThemeColor.Amber]: {
    bg: 'bg-amber-950',
    text: 'text-amber-100',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500',
    card: 'bg-amber-900/50 border-amber-800'
  },
  [ThemeColor.Cyan]: {
    bg: 'bg-cyan-950',
    text: 'text-cyan-100',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    card: 'bg-cyan-900/50 border-cyan-800'
  },
  [ThemeColor.Slate]: {
    bg: 'bg-slate-950',
    text: 'text-slate-200',
    accent: 'text-slate-400',
    accentBg: 'bg-slate-500',
    card: 'bg-slate-900/80 border-slate-700'
  },
};

export const InfographicPreview: React.FC<InfographicPreviewProps> = ({ data, headerImage, theme, id }) => {
  const styles = themeStyles[theme];

  return (
    <div 
      id={id}
      className={`w-full max-w-3xl mx-auto ${styles.bg} ${styles.text} p-8 md:p-12 shadow-2xl transition-all duration-500 ease-in-out`}
      style={{ minHeight: '800px' }}
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="mb-6 relative inline-block">
           <div className={`absolute -inset-1 rounded-full blur opacity-30 ${styles.accentBg}`}></div>
           <span className={`relative px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${styles.card} ${styles.accent}`}>
             Infographic
           </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-white">
          {data.title}
        </h1>
        <p className={`text-lg md:text-xl opacity-80 max-w-xl mx-auto leading-relaxed`}>
          {data.subtitle}
        </p>
      </div>

      {/* AI Generated Header Image */}
      {headerImage ? (
        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
          <img 
            src={headerImage} 
            alt="Topic Header" 
            className="w-full h-64 object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-${styles.bg.split('-')[1]}-900 to-transparent opacity-60`}></div>
        </div>
      ) : (
        <div className="mb-12 h-12 flex items-center justify-center">
             <div className={`h-px w-full ${styles.accentBg} opacity-30`}></div>
        </div>
      )}

      {/* Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {data.points.map((point, index) => (
          <div 
            key={index} 
            className={`${styles.card} border backdrop-blur-sm p-6 rounded-2xl flex flex-col items-start gap-4 hover:translate-y-[-4px] transition-transform duration-300`}
          >
            <div className={`p-3 rounded-xl ${styles.accentBg} text-white shadow-lg`}>
              <DynamicIcon name={point.iconKeyword} size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white">{point.title}</h3>
              <p className="opacity-80 leading-relaxed text-sm">{point.description}</p>
            </div>
            <div className="mt-auto pt-4 w-full">
                 <div className={`h-1 w-12 ${styles.accentBg} rounded-full opacity-50`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className={`text-center p-8 rounded-2xl border ${styles.card} relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${styles.accentBg}`}></div>
        <h3 className={`text-lg font-semibold ${styles.accent} mb-2 uppercase tracking-wide`}>Takeaway</h3>
        <p className="text-xl md:text-2xl font-medium text-white">
          {data.conclusion}
        </p>
      </div>

      {/* Branding Footer */}
      <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center text-xs opacity-50 font-mono">
        <span>Generated by InfographIQ</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </div>
  );
};
