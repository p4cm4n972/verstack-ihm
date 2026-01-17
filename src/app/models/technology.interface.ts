/**
 * Represents a technology version with its support information
 */
export interface TechnologyVersion {
  label: string;
  releaseDate: string;
  supportTime?: number;
  supportDuration?: number;
  updatedAt?: string;
  type: 'lts' | 'current' | 'livingstandard' | 'edition' | 'standard' | 'security' | 'maintenance' | string;
}

/**
 * Represents a technology/language/framework in the system
 */
export interface Technology {
  _id?: string;
  name: string;
  logoUrl: string;
  description?: string;
  domain: string[];
  versions?: TechnologyVersion[];
  recommendations?: number;
  officialUrl?: string;
  documentation?: string;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * Represents a favorite technology stored in user profile
 * Minimal version with just the essential fields
 */
export interface FavoriteTechnology {
  name: string;
  logoUrl: string;
}

/**
 * State for the favoris feature with loading/error states
 */
export interface FavorisState {
  favoris: FavoriteTechnology[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Domain types for technology categorization
 */
export type TechnologyDomain =
  | 'web'
  | 'mobile'
  | 'embedded'
  | 'datascience'
  | 'ia'
  | 'game'
  | 'devops'
  | 'language'
  | 'framework'
  | 'tools'
  | 'database';

/**
 * Trending status for technologies
 */
export type TrendingStatus = 'up' | 'down' | 'stable';
