// src/types/user.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}