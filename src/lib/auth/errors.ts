export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN: 'An unexpected error occurred',
} as const;

interface AuthError {
  message: string;
  status?: number | undefined;
}

export function getAuthErrorMessage(error: any): AuthError {
  if (!error) {
    return { message: AUTH_ERRORS.UNKNOWN, status: undefined };
  }

  if (error.message?.includes('Invalid login credentials')) {
       return { message: AUTH_ERRORS.INVALID_CREDENTIALS, status: error.status };
    }
  if (error.message?.includes('NetworkError')) {
       return { message: AUTH_ERRORS.NETWORK_ERROR, status: error.status };
     }
     return { message: error.message || AUTH_ERRORS.UNKNOWN, status: error.status };
   }