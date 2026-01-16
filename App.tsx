
import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Image as ImageIcon, 
  Download, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  Type as TypeIcon, 
  Palette, 
  Layout, 
  Network, 
  Headphones, 
  BookOpen,
  Zap,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import { 
  generateInfographicContent, 
  generateHeaderImage, 
  generateMindMapData, 
  generateStudyData 
} from './services/geminiService';
import { InfographicData, AppState, ThemeColor, ViewMode, MindMapNode, Flashcard, Idea } from './types';
import { InfographicPreview } from './components/InfographicPreview';
import { MindMap } from './components/MindMap';
import { AudioOverview } from './components/AudioOverview';
import { StudyGuide } from './components/StudyGuide';

const EXAMPLE_TOPICS = [
  "The Benefits of Meditation",
  "History of Coffee",
  "How Blockchain Works",
  "Sustainable Living Tips"
];

const THEME_COLORS = [
  { value: ThemeColor.Purple, color: '#a855f7' },
  { value: ThemeColor.Blue, color: '#3b82f6' },
  { value: ThemeColor.Cyan, color: '#06b6d4' },
  { value: ThemeColor.Emerald, color: '#10b981' },
  { value: ThemeColor.Amber, color: '#f59e0b' },
  { value: ThemeColor.Orange, color: '#f97316' },
  { value: ThemeColor.Crimson, color: '#dc2626' },
  { value: ThemeColor.Pink, color: '#ec4899' },
  { value: ThemeColor.Slate, color: '#64748b' },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Landing);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Infographic);
  const [topic, setTopic] = useState('');
  
  // Data States
  const [data, setData] = useState<InfographicData | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [studyData, setStudyData] = useState<{ cards: Flashcard[], ideas: Idea[] } | null>(null);
  
  const [theme, setTheme] = useState<ThemeColor>(ThemeColor.Purple);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isGeneratingExtra, setIsGeneratingExtra] = useState(false);

  const messages = [
    "Analyzing topic...",
    "Extracting key insights...",
    "Structuring visual layout...",
    "Drafting copy...",
    "Polishing details..."
  ];

  const handleGenerateText = async () => {
    if (!topic) return;
    setAppState(AppState.GeneratingText);
    setViewMode(ViewMode.Infographic);
    setMindMapData(null);
    setStudyData(null);
    setHeaderImage(null);
    
    let msgIdx = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 1500);

    try {
      const result = await generateInfographicContent(topic);
      setData(result);
      clearInterval(interval);
      setAppState(AppState.Editing);
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      setAppState(AppState.Input); // Go back to input on error
      alert("Failed to generate content. Please try again.");
    }
  };

  const handleGenerateImage = async () => {
    if (!topic) return;
    setAppState(AppState.GeneratingImage);
    try {
      const img = await generateHeaderImage(topic);
      setHeaderImage(img);
      setAppState(AppState.Final);
    } catch (e) {
      console.error(e);
      setAppState(AppState.Final); // Proceed even if image fails
    }
  };

  const handleSkipImage = () => {
    setAppState(AppState.Final);
  };

  // Lazy load other features
  const handleViewChange = async (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === ViewMode.MindMap && !mindMapData && !isGeneratingExtra) {
      setIsGeneratingExtra(true);
      try {
        const mm = await generateMindMapData(topic);
        setMindMapData(mm);
      } catch (e) { console.error(e); }
      setIsGeneratingExtra(false);
    }
    if ((mode === ViewMode.Study || mode === ViewMode.Ideas) && !studyData && !isGeneratingExtra) {
      setIsGeneratingExtra(true);
      try {
        const sd = await generateStudyData(topic);
        setStudyData(sd);
      } catch (e) { console.error(e); }
      setIsGeneratingExtra(false);
    }
  };

  // Landing Page Component
  if (appState === AppState.Landing) {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-purple-500 selection:text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-8 flex flex-col min-h-screen">
          <header className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => setAppState(AppState.Landing)}>
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              InfographIQ
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
              <button onClick={() => setAppState(AppState.Features)} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => setAppState(AppState.Input)} className="hover:text-white transition-colors">Showcase</button>
            </nav>
            <button 
              onClick={() => setAppState(AppState.Input)}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium transition-all"
            >
              Get Started
            </button>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-8">
              <Sparkles size={12} />
              <span>Powered by Google Gemini 2.5</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Your Ultimate <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">AI Learning Companion.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              Generate beautiful infographics, deep-dive podcasts, mind maps, and study guides from any topic instantly.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <button 
                onClick={() => setAppState(AppState.Input)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Create New Project
                <ChevronRight size={20} />
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Features Page
  if (appState === AppState.Features) {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-y-auto selection:bg-purple-500 selection:text-white">
        <div className="container mx-auto px-6 py-8">
          <header className="flex justify-between items-center mb-16">
             <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => setAppState(AppState.Landing)}>
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              InfographIQ
            </div>
            <button onClick={() => setAppState(AppState.Landing)} className="text-slate-400 hover:text-white">
              &larr; Back Home
            </button>
          </header>

          <main className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
               <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore the Suite</h1>
               <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                 InfographIQ isn't just about pictures. It's a complete toolkit for understanding complex information faster.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
               {/* Infographic Card */}
               <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-900 transition-colors">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                    <Layout size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Smart Infographics</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Instantly convert paragraphs or topics into clean, structured visual summaries. Perfect for presentations, social media, or quick reviews.
                  </p>
               </div>

               {/* Audio Card */}
               <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-900 transition-colors">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                    <Headphones size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Audio Overviews</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Turn any subject into an engaging "Deep Dive" podcast. Listen to two AI hosts discuss the nuances of your topic for on-the-go learning.
                  </p>
               </div>

               {/* Mind Map Card */}
               <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-900 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                    <Network size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Dynamic Mind Maps</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Visualize connections and hierarchies. Our AI structures complex ideas into navigable trees, helping you see the big picture.
                  </p>
               </div>

               {/* Study Card */}
               <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-900 transition-colors">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-6">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Power Study & Sparks</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Generate flashcards for active recall and get "Spark Ideas" that connect your topic to the real world in unexpected ways.
                  </p>
               </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/10 rounded-3xl p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to transform your learning?</h2>
                <button 
                  onClick={() => setAppState(AppState.Input)}
                  className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors"
                >
                  Get Started for Free
                </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Input State
  if (appState === AppState.Input) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative">
        <button onClick={() => setAppState(AppState.Landing)} className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors">
          &larr; Back
        </button>
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-2 text-center">What do you want to explore?</h2>
          <p className="text-slate-400 text-center mb-8">Enter a subject, question, or paste a paragraph.</p>
          
          <div className="relative">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of Artificial Intelligence"
              className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-6 py-4 text-lg outline-none transition-all shadow-xl placeholder:text-slate-600"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateText()}
            />
            <button 
              onClick={handleGenerateText}
              disabled={!topic}
              className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate
            </button>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Try these examples</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_TOPICS.map(t => (
                <button 
                  key={t}
                  onClick={() => { setTopic(t); }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading States
  if (appState === AppState.GeneratingText || appState === AppState.GeneratingImage) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="relative w-24 h-24 mb-8">
           <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
           <Sparkles className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 animate-pulse">
           {appState === AppState.GeneratingImage ? "Designing visual assets..." : "Researching topic..."}
        </h2>
        <p className="text-slate-400">{loadingMessage || "Please wait a moment"}</p>
      </div>
    );
  }

  // Main Editor/Preview Layout
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen md:fixed md:left-0 top-0 z-20">
        <div className="p-6 flex items-center gap-2 text-white font-bold text-lg border-b border-slate-800 cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setAppState(AppState.Landing)}>
           <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
             <Activity size={14} />
           </div>
           InfographIQ
        </div>

        <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
           <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</div>
           <div className="px-4 mb-6">
             <div className="p-3 bg-slate-800 rounded-lg text-sm font-medium text-slate-300 truncate" title={topic}>
                {topic}
             </div>
             <button onClick={() => setAppState(AppState.Input)} className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
               <RefreshCw size={12} /> Start New Project
             </button>
           </div>

           <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Views</div>
           <div className="space-y-1 px-2">
              <button 
                onClick={() => handleViewChange(ViewMode.Infographic)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${viewMode === ViewMode.Infographic ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Layout size={18} /> Infographic
              </button>
              <button 
                onClick={() => handleViewChange(ViewMode.Audio)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${viewMode === ViewMode.Audio ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Headphones size={18} /> Audio Overview
              </button>
              <button 
                onClick={() => handleViewChange(ViewMode.MindMap)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${viewMode === ViewMode.MindMap ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Network size={18} /> Mind Map
              </button>
              <button 
                onClick={() => handleViewChange(ViewMode.Study)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${viewMode === ViewMode.Study ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <BookOpen size={18} /> Power Study
              </button>
           </div>
        </div>
        
        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
             {viewMode === ViewMode.Infographic && (
                <div className="mb-4">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Palette size={14} /> Theme
                   </h3>
                   <div className="grid grid-cols-5 gap-2">
                     {THEME_COLORS.map((c) => (
                       <button
                         key={c.value}
                         onClick={() => setTheme(c.value)}
                         className={`w-full aspect-square rounded-full border-2 flex items-center justify-center transition-all ${theme === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105 hover:border-white/20'}`}
                         style={{ backgroundColor: c.color }}
                         title={c.value}
                       />
                     ))}
                   </div>
                </div>
             )}

             {viewMode === ViewMode.Infographic && !headerImage && (
               <div className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-purple-200">AI Header</span>
                    <ImageIcon size={12} className="text-purple-300" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleGenerateImage} className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded transition-colors">
                      Generate
                    </button>
                    <button onClick={handleSkipImage} className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded transition-colors">
                      Skip
                    </button>
                  </div>
               </div>
             )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 md:ml-72 bg-slate-950 min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Toolbar / Breadcrumb placeholder */}
        <div className="h-16 border-b border-slate-800 flex items-center px-8 justify-between bg-slate-900/30 backdrop-blur-md z-10">
             <div className="text-sm font-medium text-slate-400">
               Project / <span className="text-white">{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
             </div>
             <div className="flex gap-2">
               <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                 <Download size={18} />
               </button>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 flex items-start justify-center">
           
           {/* View Router */}
           {viewMode === ViewMode.Infographic && data && (
             <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 duration-500">
                <InfographicPreview 
                   id="infographic-canvas"
                   data={data} 
                   theme={theme} 
                   headerImage={headerImage}
                 />
             </div>
           )}

           {viewMode === ViewMode.Audio && (
             <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                <AudioOverview topic={topic} contextData={JSON.stringify(data?.points || "")} />
             </div>
           )}

           {viewMode === ViewMode.MindMap && (
             <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                {isGeneratingExtra ? (
                   <div className="flex flex-col items-center gap-4 text-slate-400">
                     <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                     <p>Mapping out connections...</p>
                   </div>
                ) : mindMapData ? (
                   <MindMap data={mindMapData} />
                ) : (
                   <div className="text-slate-500">Failed to load Mind Map</div>
                )}
             </div>
           )}

           {(viewMode === ViewMode.Study || viewMode === ViewMode.Ideas) && (
             <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                {isGeneratingExtra ? (
                   <div className="flex flex-col items-center gap-4 text-slate-400">
                     <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                     <p>Preparing study materials...</p>
                   </div>
                ) : studyData ? (
                   <StudyGuide cards={studyData.cards} ideas={studyData.ideas} />
                ) : (
                   <div className="text-slate-500">Failed to load Study Guide</div>
                )}
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default App;
