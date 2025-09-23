export interface Observation {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ObservationFormData {
  name: string;
  description?: string;
}

export interface CreateObservationData extends ObservationFormData {
  latitude: number;
  longitude: number;
}