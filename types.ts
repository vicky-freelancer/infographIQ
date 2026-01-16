
export enum ThemeColor {
  Blue = 'blue',
  Purple = 'purple',
  Emerald = 'emerald',
  Orange = 'orange',
  Pink = 'pink',
  Crimson = 'crimson',
  Amber = 'amber',
  Cyan = 'cyan',
  Slate = 'slate'
}

export interface InfographicPoint {
  title: string;
  description: string;
  iconKeyword: string; // Used to pick a Lucide icon
}

export interface InfographicData {
  title: string;
  subtitle: string;
  points: InfographicPoint[];
  conclusion: string;
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface Idea {
  title: string;
  description: string;
}

export enum AppState {
  Landing,
  Features,
  Input,
  GeneratingText,
  Editing,
  GeneratingImage,
  Final
}

export enum ViewMode {
  Infographic = 'infographic',
  MindMap = 'mindmap',
  Audio = 'audio',
  Study = 'study',
  Ideas = 'ideas'
}
