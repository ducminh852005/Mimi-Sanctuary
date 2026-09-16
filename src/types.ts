export type ScreenId =
  | 'dump-ambient-home'
  | 'persona-qna'
  | 'workload-overview'
  | 'one-next-action-focus'
  | 'break-soothing-rest'
  | 'reflection-study-mirror';

export type Language = 'en' | 'vi';

export type Mood = 'grounded' | 'light' | 'tired';

export type EnergyRhythm = 'morning' | 'afternoon' | 'dusk';

export type TaskSource = 'lms' | 'brain_dump';

export interface Task {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  durationMin: number;
  category: {
    en: string;
    vi: string;
  };
  source: TaskSource;
  courseCode?: string;
  deadline?: {
    en: string;
    vi: string;
  } | string;
  dumpOrigin?: {
    en: string;
    vi: string;
  } | string;
  description: {
    en: string;
    vi: string;
  };
  note?: {
    en: string;
    vi: string;
  };
  attachmentName?: string;
  status: 'pending' | 'active' | 'completed';
  workTree?: WorkTreeDraft;
  currentBranchIndex?: number;
  completedBranchIndices?: number[];
}

export interface AttachedDocument {
  id: string;
  name: string;
  sizeStr: string;
  type: 'pdf' | 'doc' | 'text' | 'image';
  previewExcerpt?: {
    en: string;
    vi: string;
  };
  tasksFound?: number;
}

export interface TaskMethodology {
  id: string;
  name: {
    en: string;
    vi: string;
  };
  badge: {
    en: string;
    vi: string;
  };
  howToApply: {
    en: string;
    vi: string;
  };
  scientificBenefit: {
    en: string;
    vi: string;
  };
  steps: {
    en: string[];
    vi: string[];
  };
}

export interface TaskResource {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  sourceType: 'lms' | 'attachment' | 'brain_dump' | 'web';
  sourceTag: {
    en: string;
    vi: string;
  };
  urlOrPath: string;
  description: {
    en: string;
    vi: string;
  };
  keyExcerpt?: {
    en: string;
    vi: string;
  };
}

export interface FocusChatMessage {
  id: string;
  sender: 'user' | 'mimi';
  text: string;
  timestamp: string;
  groundedSource?: {
    en: string;
    vi: string;
  };
  suggestedFollowUps?: string[];
}

export interface WorkTreeLeaf {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  durationMin: number;
  completed?: boolean;
}

export interface WorkTreeBranch {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  phase: number;
  estimatedMin: number;
  energyRequired: 'low' | 'medium' | 'high';
  leaves: WorkTreeLeaf[];
}

export interface WorkTreeDraft {
  rootTaskId: string;
  rootTaskTitle: {
    en: string;
    vi: string;
  };
  userIntentSummary: {
    en: string;
    vi: string;
  };
  surveyedState: {
    energyLevel: 'high' | 'medium' | 'low';
    availableMinutes: number;
    cognitiveReadiness: {
      en: string;
      vi: string;
    };
  };
  branches: WorkTreeBranch[];
  isApproved: boolean;
  lastRevisedAt?: string;
}

export function getLocalizedText(
  value: { en: string; vi: string } | string | undefined,
  lang: Language,
  fallback = ''
): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value[lang] || value.vi || value.en || fallback;
}

export interface SmartWatchBiometrics {
  connected: boolean;
  deviceName: string;
  heartRate: number; // bpm
  stressScore: number; // 0 - 100
  stressLevel: 'low' | 'moderate' | 'high';
  battery: number; // %
  lastSync: string;
}
