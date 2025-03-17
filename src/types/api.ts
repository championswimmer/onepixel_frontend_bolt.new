export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  token: string;
}

export interface CreateUrlRequest {
  long_url: string;
}

export interface UrlResponse {
  creator_id: number;
  long_url: string;
  short_url: string;
}

export interface UrlInfoResponse {
  long_url: string;
  hit_count: number;
}

export interface ErrorResponse {
  status: number;
  message: string;
}