import {
  User,
  Memory,
  FamilyMember,
  GameResult,
  AssessmentResult,
  PatientCard,
  AIActivity,
  UserSettings,
  ProgressSummary,
  LanguageCode
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('neuronest_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorDetail = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  // Check if response has content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return {} as T;
}

// Auth API
export const authApi = {
  signup: async (data: {
    name: string;
    email: string;
    password: string;
    confirm_password?: string;
    age?: number;
    preferred_language: string;
    role: string;
  }) => {
    return request<{ message: string; user_id: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return request<{ access_token: string; token_type: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getMe: async (): Promise<User> => {
    return request<User>('/users/me');
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    return request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: { old_password: string; new_password: string }) => {
    return request<{ message: string }>('/users/me/password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSettings: async (): Promise<UserSettings> => {
    return request<UserSettings>('/users/settings');
  },

  updateSettings: async (data: Partial<UserSettings>): Promise<UserSettings> => {
    return request<UserSettings>('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

// Memories API
export const memoriesApi = {
  list: async (category?: string, search?: string, patientId?: string): Promise<Memory[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (patientId) params.append('patient_id', patientId);
    return request<Memory[]>(`/memories?${params.toString()}`);
  },

  create: async (data: Partial<Memory>, patientId?: string): Promise<Memory> => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<Memory>(`/memories${params}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Memory>): Promise<Memory> => {
    return request<Memory>(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request<{ message: string }>(`/memories/${id}`, {
      method: 'DELETE',
    });
  }
};

// Family Members API
export const familyApi = {
  list: async (patientId?: string): Promise<FamilyMember[]> => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<FamilyMember[]>(`/family-members${params}`);
  },

  create: async (data: Partial<FamilyMember>, patientId?: string): Promise<FamilyMember> => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<FamilyMember>(`/family-members${params}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<FamilyMember>): Promise<FamilyMember> => {
    return request<FamilyMember>(`/family-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request<{ message: string }>(`/family-members/${id}`, {
      method: 'DELETE',
    });
  }
};

// Games API
export const gamesApi = {
  submitResult: async (result: GameResult) => {
    return request<{ message: string; result: GameResult; aiRecommendation: any }>('/games/results', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  },

  getResults: async (patientId?: string): Promise<GameResult[]> => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<GameResult[]>(`/games/results${params}`);
  }
};

// Assessment API
export const assessmentApi = {
  submit: async (scores: {
    memory_score: number;
    working_memory_score: number;
    attention_score: number;
    reasoning_score: number;
  }, patientId?: string) => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<{ message: string; disclaimer: string; result: AssessmentResult }>(`/assessment${params}`, {
      method: 'POST',
      body: JSON.stringify(scores),
    });
  },

  getResults: async (patientId?: string): Promise<AssessmentResult[]> => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<AssessmentResult[]>(`/assessment/results${params}`);
  }
};

// Progress API
export const progressApi = {
  getProgress: async (patientId?: string): Promise<ProgressSummary> => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<ProgressSummary>(`/progress${params}`);
  }
};

// AI Companion API
export const aiApi = {
  chat: async (message: string, language: LanguageCode = 'en', patientId?: string) => {
    return request<{
      response: string;
      source: string;
      language: string;
      detected_intent?: string;
      context_used?: string[];
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language, patient_id: patientId }),
    });
  },

  getConversations: async (patientId?: string) => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<any[]>(`/ai/conversations${params}`);
  },

  getActivities: async (patientId?: string): Promise<AIActivity[]> => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return request<AIActivity[]>(`/ai/activities${params}`);
  }
};

// Caregiver API
export const caregiverApi = {
  getPatients: async (): Promise<PatientCard[]> => {
    return request<PatientCard[]>('/caregiver/patients');
  },

  linkPatient: async (patientEmail: string, relationship: string) => {
    return request<{ message: string }>('/caregiver/patients', {
      method: 'POST',
      body: JSON.stringify({ patient_email: patientEmail, relationship }),
    });
  },

  getPatientInsights: async (patientId: string) => {
    return request<any>(`/caregiver/patients/${patientId}/insights`);
  }
};

// Photo Upload API
export const uploadPhoto = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('neuronest_token');
  const response = await fetch(`${API_BASE}/upload/photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Failed to upload photo');
  }

  const data = await response.json();
  return {
    url: `${API_BASE}${data.url}`,
    filename: data.filename
  };
};
