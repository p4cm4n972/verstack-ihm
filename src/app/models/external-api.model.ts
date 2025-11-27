/**
 * Modèles pour les réponses des APIs externes
 */

// Stack Overflow API
export interface StackOverflowTag {
  name: string;
  count: number;
  has_synonyms: boolean;
  is_required: boolean;
  last_activity_date: number;
  collectives?: any[];
}

export interface StackOverflowResponse {
  items: StackOverflowTag[];
  quota_max: number;
  quota_remaining: number;
}

// TIOBE Index
export interface TIOBEEntry {
  rank: number;
  name: string;
  rating: number;
  change: string; // "+0.24%", "-1.5%", etc.
  year?: number;
}

export interface TIOBEIndexResponse {
  date: string;
  entries: TIOBEEntry[];
}

// GitHub Octoverse
export interface GitHubLanguageStats {
  rank: number;
  language: string;
  pullRequests: number;
  percentage: number;
  change: string;
}

export interface GitHubOctoVerseResponse {
  year: number;
  topLanguages: GitHubLanguageStats[];
  lastUpdated: string;
}

// Google Trends (approximation)
export interface GoogleTrendsData {
  keyword: string;
  interest: number[]; // 0-100 (relatif)
  years: string[];
}

// Données agrégées
export interface AggregatedPopularity {
  language: string;
  sources: {
    stackoverflow?: number;      // 0-100 (basé sur tag count)
    tiobe?: number;             // 0-100 (rating direct)
    github?: number;            // 0-100 (pull requests)
    googleTrends?: number;      // 0-100 (relative interest)
  };
  average: number;              // moyenne pondérée
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}
