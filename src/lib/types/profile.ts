export interface CloudinaryImage {
  public_id: string;
  url: string;
}

export interface UserProfile {
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  dateOfBirth: string | null;
  email: string;
  firstName: string;
  lastName: string;
  image: CloudinaryImage;
  isSuspended: boolean;
  isVerified: boolean;
  location: string;
  phone: string;
  postalCode: string;
  role: string;
  street: string;
}

export interface ProfileResponse {
  data: UserProfile;
  message: string;
  statusCode: number;
  success: boolean;
}