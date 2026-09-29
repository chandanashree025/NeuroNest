export type UserRole = 'OLDER_ADULT' | 'CAREGIVER';

export type LanguageCode = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'ml' | 'bn' | 'as';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  role: UserRole;
  profile_photo?: string;
  preferred_language: LanguageCode;
  theme: 'light' | 'dark';
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  person?: string;
  relationship?: string;
  date?: string;
  description: string;
  category: 'Family' | 'Friends' | 'Places' | 'Important Moments' | 'Daily Routine' | 'Favorites';
  photo?: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  photo?: string;
  description?: string;
  important_memories?: string;
  created_at: string;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface GameResult {
  id?: string;
  userId: string;
  game?: string;
  gameId: string;
  gameName: string;
  cognitiveSkill: string;
  difficulty: DifficultyLevel;
  score: number;
  accuracy: number;
  mistakes: number;
  responseTime: number;
  timestamp?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  memoryScore: number;
  workingMemoryScore: number;
  attentionScore: number;
  reasoningScore: number;
  overallScore: number;
  suggestions?: string;
  timestamp: string;
}

export interface PatientCard {
  id: string;
  name: string;
  email: string;
  age?: number;
  profile_photo?: string;
  relationship: string;
  recent_activity?: string;
  last_active?: string;
  overall_progress: number;
  memory_count: number;
  games_completed: number;
}

export interface AIActivity {
  id: string;
  user_id: string;
  activity_name: string;
  observation: string;
  reasoning: string;
  agent: string;
  action: string;
  result: string;
  learning: string;
  timestamp: string;
}

export interface UserSettings {
  id?: string;
  user_id?: string;
  text_size: 'normal' | 'large' | 'extra_large';
  high_contrast: boolean;
  reduce_animation: boolean;
  voice_input_enabled: boolean;
  tts_enabled: boolean;
  activity_reminders: boolean;
  caregiver_notifications: boolean;
  memory_permissions: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  timestamp: string;
}

export interface ProgressSummary {
  overallScore: number;
  memoryScore: number;
  workingMemoryScore: number;
  attentionScore: number;
  reasoningScore: number;
  gamesCompleted: number;
  assessmentsCompleted: number;
  weeklyActivity: { day: string; date: string; activities: number }[];
  recentGames: GameResult[];
  latestAssessment?: {
    overallScore: number;
    suggestions?: string;
    timestamp: string;
  };
}
