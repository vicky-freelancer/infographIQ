import React, { useState } from 'react';
import { Flashcard, Idea } from '../types';
import { Lightbulb, HelpCircle, RotateCcw } from 'lucide-react';

interface StudyGuideProps {
  cards: Flashcard[];
  ideas: Idea[];
}

export const StudyGuide: React.FC<StudyGuideProps> = ({ cards, ideas }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'ideas'>('cards');
  
  return (
    <div className="w-full max-w-4xl mx-auto">
       <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('cards')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'cards' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Power Study
          </button>
          <button 
            onClick={() => setActiveTab('ideas')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'ideas' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Spark Ideas
          </button>
       </div>

       {activeTab === 'cards' ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {cards.map((card, idx) => (
                   <FlipCard key={idx} card={card} index={idx} />
               ))}
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {ideas.map((idea, idx) => (
                   <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-yellow-500">
                           <Lightbulb size={64} />
                       </div>
                       <h3 className="text-lg font-bold text-white mb-2 relative z-10">{idea.title}</h3>
                       <p className="text-slate-400 text-sm leading-relaxed relative z-10">{idea.description}</p>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};

const FlipCard: React.FC<{ card: Flashcard, index: number }> = ({ card, index }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div 
            className="h-64 perspective-1000 cursor-pointer group"
            onClick={() => setFlipped(!flipped)}
        >
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl group-hover:border-orange-500/50 transition-colors">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mb-4 text-orange-500">
                        <HelpCircle size={20} />
                    </div>
                    <h4 className="text-slate-500 text-xs uppercase tracking-widest mb-4">Question {index + 1}</h4>
                    <p className="text-xl font-medium text-white">{card.question}</p>
                    <span className="mt-auto text-xs text-slate-500 flex items-center gap-1">Click to reveal <RotateCcw size={10}/></span>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-orange-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center rotate-y-180 shadow-xl">
                    <h4 className="text-white/70 text-xs uppercase tracking-widest mb-4">Answer</h4>
                    <p className="text-lg font-medium text-white">{card.answer}</p>
                </div>
            </div>
        </div>
    );
}