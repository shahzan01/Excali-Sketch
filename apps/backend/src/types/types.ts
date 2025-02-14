export interface ServiceResponse<T = any> {
  success: boolean; // Indicates if the operation was successful
  message: string; // Descriptive message about the result
  data?: T; // Holds the actual response data (optional)
  error?: string; // Error message if the request fails (optional)
}

// Type for user data
export interface User {
  id: string;
  name: string;
  email: string;
}

// Type for signup response
export interface SignupResponse extends ServiceResponse<User> {}

// Type for login response, includes user data & token
export interface LoginResponse
  extends ServiceResponse<{ token: string; user: User }> {}

// Type for rooms response
export interface RoomsResponse extends ServiceResponse<{ rooms: any[] }> {}

// Type for login request body
export interface LoginRequest {
  email: string;
  password: string;
}

// Type for signup request body
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}
