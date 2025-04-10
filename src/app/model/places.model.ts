// models/place.model.ts
export interface Place {
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    description: string;
    ratings: number;
    //optional properties
    imageUrl?: string;
    reviewCount?: number;
    openingHours?: string;
  }
  