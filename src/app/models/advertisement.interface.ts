/**
 * Advertisement model for managing display ads
 */

export type AdPosition = 'banner' | 'sidebar' | 'inline' | 'footer';
export type AdStatus = 'active' | 'inactive' | 'scheduled' | 'expired';

export interface Advertisement {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  position: AdPosition;
  status: AdStatus;
  priority: number; // Higher priority ads show first
  impressions: number; // Number of times displayed
  clicks: number; // Number of clicks
  startDate: Date;
  endDate?: Date;
  targetPages?: string[]; // Specific pages to show ad on (e.g., ['home', 'langages'])
  createdAt: Date;
  updatedAt: Date;
}

export interface AdDisplayConfig {
  position: AdPosition;
  page?: string; // Current page identifier
}

export interface AdClickEvent {
  advertisementId: string;
  userId?: string;
  timestamp: Date;
}

export interface AdImpressionEvent {
  advertisementId: string;
  userId?: string;
  timestamp: Date;
}

export interface AdCreateRequest {
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  position: AdPosition;
  priority?: number;
  startDate: Date;
  endDate?: Date;
  targetPages?: string[];
}

export interface AdUpdateRequest extends Partial<AdCreateRequest> {
  status?: AdStatus;
}
