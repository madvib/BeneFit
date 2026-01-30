export interface RecommendationData {
  id: number | string;
  title: string;
  reason: string;
  type: string;
}

export interface ChatData {
  id: number | string;
  title: string;
  excerpt?: string;
}
