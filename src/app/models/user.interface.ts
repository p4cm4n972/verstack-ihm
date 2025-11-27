export interface UserProfile {
  _id: string;
  pseudo: string;
  firstName?: string;
  lastName?: string;
  email: string;
  favoris: any[];
  profilePicture?: string;
  role: 'admin' | 'user' | 'subscriber';
  job: string;
  ageRange: string;
  salaryRange: string;
  experience: string;
  sexe?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  sexe: string;
  pseudo: string;
  email: string;
  password: string;
  job: string;
  ageRange: string;
  salaryRange: string;
  experience: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface DecodedToken {
  id: string;
  email: string;
  pseudo: string;
  role: 'admin' | 'user' | 'subscriber';
  exp: number;
  iat: number;
}