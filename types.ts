
export interface Supplier {
  name: string;
  distance: string;
  directionsUrl: string;
}

export interface PlantDiagnosis {
  plantName: string;
  scientificName: string;
  status: 'Healthy' | 'Diseased' | 'Stressed' | 'Unknown';
  confidenceScore: number;
  conditionName: string;
  description: string;
  immediateActions: string[];
  organicTreatment: string;
  chemicalTreatment: string;
  preventionTips: string[];
  localLanguageSummary: string;
  suppliers?: Supplier[];
}

export interface DiagnosisHistoryItem {
  id: string;
  timestamp: number;
  image: string;
  diagnosis: PlantDiagnosis;
  isVerified?: boolean;
  verifiedBy?: string;
}

export type Language = 'English' | 'Shona' | 'Ndebele';

export type Province = 
  | 'Harare' | 'Bulawayo' | 'Manicaland' 
  | 'Mashonaland Central' | 'Mashonaland East' | 'Mashonaland West' 
  | 'Masvingo' | 'Matabeleland North' | 'Matabeleland South' | 'Midlands';

export interface IndabaComment {
  id: string;
  author: string;
  text: string;
  isExpert: boolean;
  timestamp: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  province: Province;
  district: string;
  image: string;
  diagnosis: PlantDiagnosis;
  likes: number;
  comments: IndabaComment[];
  timestamp: number;
  traditionalKnowledge?: string;
  isVerified?: boolean;
  verifiedBy?: string;
}

export interface ScoutPin {
  id: string;
  lat: number;
  lng: number;
  severity: 'Critical' | 'Monitoring' | 'Healthy';
  crop: string;
  issue: string;
}

export interface PendingScan {
  id: string;
  timestamp: number;
  imageBase64: string;
  isPfumvudza: boolean;
  language: Language;
}

export interface EmergencyDisease {
  name: string;
  crop: string;
  symptoms: string;
  cure: string;
}
