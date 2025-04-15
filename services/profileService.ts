import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  // Get current user's profile
  getCurrentProfile: async (token: string) => {
    const response = await axios.get(`${API_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (data: ProfileData, token: string) => {
    const response = await axios.post(`${API_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (data: PasswordData, token: string) => {
    const response = await axios.post(`${API_URL}/auth/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get profile by user ID
  getProfileById: async (userId: string, token: string) => {
    const response = await axios.get(`${API_URL}/profile/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Delete profile
  deleteProfile: async (token: string) => {
    const response = await axios.delete(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
