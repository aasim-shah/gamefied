import request from "./request";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await request.post<AuthResponse>("/auth/login", credentials);
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await request.post<AuthResponse>("/auth/register", data);
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  const response = await request.get<AuthResponse["user"]>("/auth/me");
  return response.data;
};
