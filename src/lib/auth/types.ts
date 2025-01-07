export type AuthError = {
  message: string;
  status?: number;
};

export type AuthResponse<T = any> = {
  data: T | null;
  error: AuthError | null;
};