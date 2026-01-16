import React from 'react';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode;
}

const TreeNode: React.FC<{ node: MindMapNode; isRoot?: boolean }> = ({ node, isRoot = false }) => {
  return (
    <div className="flex flex-col items-center relative">
      {/* Node Card */}
      <div 
        className={`
          z-10 relative shadow-xl transition-transform hover:scale-105 duration-300
          ${isRoot 
            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl text-xl font-bold mb-8 border-4 border-slate-900' 
            : 'bg-slate-800 border border-slate-600 text-slate-200 p-3 px-5 rounded-xl text-sm font-medium mb-6 min-w-[120px] text-center'
          }
        `}
      >
        {node.label}
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <div className="flex gap-8 relative">
          {/* Connector Lines Container */}
          <div className="absolute top-0 left-0 w-full h-6 -mt-6 pointer-events-none overflow-visible">
             {/* Horizontal bar connecting all children */}
             <div className="absolute top-1/2 left-[25%] right-[25%] h-px bg-slate-600/50"></div> 
             {/* Vertical line from parent */}
             <div className="absolute bottom-1/2 left-1/2 w-px h-4 bg-slate-600/50 -translate-x-1/2"></div>
          </div>

          {node.children.map((child, idx) => (
             <div key={idx} className="relative pt-4">
                {/* Vertical line to child */}
                <div className="absolute top-0 left-1/2 w-px h-4 bg-slate-600/50 -translate-x-1/2"></div>
                <TreeNode node={child} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MindMap: React.FC<MindMapProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[600px] overflow-auto bg-slate-950 rounded-3xl border border-slate-800 p-8 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
       <TreeNode node={data} isRoot />
    </div>
  );
};