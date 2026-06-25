// Sends HTTP requests to the backend. No business logic — just fetch calls.
// Singleton pattern ensures only one instance is created per page load.

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?:   T;
  errors?: Record<string, string>;
}

export interface AuthTokenData {
  token: string;
  user: {
    id:         number;
    email:      string;
    first_name: string;
    last_name:  string;
    role:       string;
  };
}

export class AuthApi {

  private static instance: AuthApi;

  private constructor(private readonly baseUrl: string) {}

  // Returns the single shared instance (creates it on first call)
  static getInstance(baseUrl = 'http://localhost:8080/api'): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi(baseUrl);
    }
    return AuthApi.instance;
  }

  login(email: string, password: string): Promise<ApiResponse<AuthTokenData>> {
    return this.post('/auth/login', { email, password });
  }

  register(payload: {
    first_name: string;
    last_name:  string;
    email:      string;
    password:   string;
  }): Promise<ApiResponse<AuthTokenData>> {
    return this.post('/auth/register', payload);
  }

  private async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    return response.json() as Promise<ApiResponse<T>>;
  }
}
