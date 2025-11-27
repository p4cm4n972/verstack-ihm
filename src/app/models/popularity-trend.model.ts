/**
 * Modèle de données pour les tendances de popularité
 */
export interface PopularityTrend {
  id?: string;
  name: string;
  popularity: number[];
  metadata?: {
    color?: string;
    icon?: string;
    category?: string;
  };
}

/**
 * Réponse de l'API pour les données de tendances
 */
export interface TrendsResponse {
  data: PopularityTrend[];
  years: string[];
  metadata?: {
    sources: string[];
    lastUpdated: string;
  };
}

/**
 * Paramètres pour les requêtes d'API
 */
export interface TrendsFilterParams {
  year?: string;
  language?: string;
  limit?: number;
  sort?: 'asc' | 'desc';
}
