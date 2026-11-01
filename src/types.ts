export interface User {
  id: number;
  email: string;
}

export interface Link {
  id: number;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}