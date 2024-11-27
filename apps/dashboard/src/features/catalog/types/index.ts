export interface InfluencerFilters {
  category: string;
  language: string;
  country: string;
  minFollowers: string;
  maxFollowers: string;
  minPrice: string;
  maxPrice: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ServiceConfig {
  service: Service;
  price: number;
  isActive: boolean;
}