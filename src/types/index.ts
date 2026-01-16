// src/types/index.ts - Todas las interfaces TypeScript

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
  preferences: {
    theme: 'cyberpunk' | 'dark' | 'matrix';
    notifications: boolean;
    sounds: boolean;
  };
  createdAt: string;
  lastSeen: string;
}

export interface Connection {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  tags: string[];
  connectedAt: string;
  lastInteraction: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'invite';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId: string;
  attendees: string[];
  maxAttendees: number;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  creatorId: string;
  members: string[];
  createdAt: string;
  isPrivate: boolean;
  tags: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
