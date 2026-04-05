export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  category: 'Academic' | 'Sports' | 'Alumni' | 'Innovation' | 'General';
  author: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  category: 'Academic' | 'Sports' | 'Arts' | 'Innovation';
}

export interface LeaderboardEntry {
  id: string;
  houseName: string;
  points: number;
  rank: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'alumni' | 'student' | 'guest';
  graduationYear?: string;
  bio?: string;
  occupation?: string;
  location?: string;
  linkedin?: string;
  isPublic?: boolean;
}

export interface AlumniProfile extends UserProfile {
  notable?: boolean;
  achievements?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
