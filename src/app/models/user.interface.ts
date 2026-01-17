export interface UserProfile {
  _id: string;
  pseudo: string;
  firstName?: string;
  lastName?: string;
  email: string;
  favoris: any[];
  projects?: any[];
  contacts?: string[];
  profileViews?: number;
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
  pseudo: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  // Champs optionnels - complétés dans le profil
  sexe?: string;
  job?: string;
  ageRange?: string;
  salaryRange?: string;
  experience?: string;
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