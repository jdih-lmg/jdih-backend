export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
  };
}
