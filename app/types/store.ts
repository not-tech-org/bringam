// Store-related types and interfaces

export interface StoreAddress {
  city: number;
  country: number;
  landmark: string;
  lga: string;
  state: number;
  street: string;
  longitude: number;
  latitude: number;
}

export interface StoreFormData {
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  website: string;
  category?: string;
  country: string;
  street: string;
  city: string;
  lga: string;
  state: string;
  landmark: string;
  address?: StoreAddress;
  profilePhotoUrl: string;
  coverPhotoUrl: string;
  active: boolean;
}

export interface StoreData {
  id?: string;
  uuid?: string;
  name: string;
  description?: string;
  type?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  category?: string;
  address?: StoreAddress;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
  active: boolean;
  members?: StoreMember[];
}

export interface StoreMember {
  id: string;
  avatar?: string;
  name?: string;
  email?: string;
}

// Geographic data types
export interface Country {
  id: number;
  name: string;
  code?: string;
}

export interface State {
  id: number;
  name: string;
  countryId: number;
}

export interface City {
  id: number;
  name: string;
  stateId: number;
}
