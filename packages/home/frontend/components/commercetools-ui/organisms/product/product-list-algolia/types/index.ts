export interface FacetConfiguration {
  key: string;
  type: 'range' | 'color' | 'term';
  label: string;
}

export interface PriceConfigurationRange {
  min: number;
  max: number;
  refinements?: number;
}

export interface PriceConfiguration {
  key: string;
  ranges: PriceConfigurationRange[];
}
