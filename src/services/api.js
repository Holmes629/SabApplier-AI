import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";
import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000/api";
const API_BASE_URL = 'https://sabapplier-ai-backend.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem("token");

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// Helper function to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"), // Send CSRF token
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const api = {
  signup: async (userData) => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("fullname", userData.fullname);
      formData.append("email", userData.email);
      formData.append("dateofbirth", userData.dateofbirth);
      formData.append("password", userData.password);
      formData.append("phone_number", userData.phone_number);
      formData.append("passport_size_photo_file_url", userData.passport_size_photo);
      formData.append("aadhaar_card_file_url", userData.aadhaar_card);
      formData.append("pan_card_file_url", userData.pan_card);
      formData.append("_10th_certificate_file_url", userData._10th_certificate);
      formData.append("_12th_certificate_file_url", userData._12th_certificate);
      formData.append("graduation_certificate_file_url", userData.graduation_certificate);
      formData.append("address", userData.address);
      formData.append("city", userData.city);
      formData.append("state", userData.state);
      formData.append("country", userData.country);
      formData.append("pincode", userData.pincode);

      const response = await axios.post(
        `${API_BASE_URL}/users/register/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      throw new Error("Signup failed: user already exists or invalid data");
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login/`,
        credentials
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${API_BASE_URL}/users/logout/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },

  getProfile: async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch(
        `${API_BASE_URL}/users/profile/?email=${currentUser.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get profile");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};
