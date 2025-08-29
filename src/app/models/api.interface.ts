export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Language {
  _id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  image: string;
  website: string;
  popularity: number;
  lastUpdated: string;
  isLTS?: boolean;
  supportEndDate?: string;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  featured?: boolean;
  image?: string;
}

export interface JobListData {
  jobList: string[];
  experienceList: string[];
  ageRanges: string[];
  salaryRanges: string[];
}