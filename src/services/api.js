import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";
import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000/api";
// const API_BASE_URL = 'https://sabapplier-ai-backend.onrender.com/api';

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
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("first_name", userData.first_name);
      formData.append("last_name", userData.last_name);
      formData.append("phone_number", userData.phone_number);
      formData.append("address", userData.address);
      formData.append("city", userData.city);
      formData.append("state", userData.state);
      formData.append("country", userData.country);
      formData.append("pincode", userData.pincode);
      formData.append("profile_photo", userData.profile_photo);
      formData.append("aadhaar_card", userData.aadhaar_card);
      formData.append("pan_card", userData.pan_card);

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

  autoFill: async (data) => {
    try {
      console.log(
        "data",
        data,
        JSON.parse(localStorage.getItem("currentUser")).email
      );
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const userData = await api.getProfile();
      const response = await axios.post(`${API_BASE_URL}/users/auto-fill/`, {
        link: data,
        user_data: userData,
      });
      return response.data.autofill_data;
    } catch (error) {
      throw error;
    }
  },
};
