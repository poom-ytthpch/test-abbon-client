export type User = {
  id: string;
  email: string;
  userName: string;
};
export type LoginResponse = {
  status: boolean;
  token: string;
  refreshToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
  userName: string;
  email: string;
  id: string;
};
