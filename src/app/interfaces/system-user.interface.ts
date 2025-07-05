export interface SystemUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "admin" | "manager" | "agent" | "support";
  status: "active" | "inactive" | "suspended";
  avatar?: string;
  department?: string;
  permissions: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  isOnline: boolean;
  loginAttempts: number;
  lastPasswordChange?: Date;
}
