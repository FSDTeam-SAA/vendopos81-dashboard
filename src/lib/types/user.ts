export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "user";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserProfile;
}
