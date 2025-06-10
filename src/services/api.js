// import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"
// const API_BASE_URL = 'https://api.sabapplier.com/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem("token");

// Helper function to set auth token
// const setAuthToken = (token) => {
//   if (token) {
//     localStorage.setItem("token", token);
//   } else {
//     localStorage.removeItem("token");
//   }
// };

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



  // OTP: Send OTP to email
  sendOtp: async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/send-otp/`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    } catch (error) {
      throw new Error(error.detail || "Could not send OTP. Please try again.");
    }
  },

  // OTP: Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/verify-otp/`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    } catch (error) {
      throw new Error(error.detail || "Invalid OTP. Please try again.");
    }
  },




  signup: async (userData) => {
    try {
      // Only send the required fields as JSON
      const payload = {
        email: userData.email,
        password: userData.password,
      };
      if (userData.confirmPassword) {
        payload.confirmPassword = userData.confirmPassword;
      }
      const response = await axios.post(
        `${API_BASE_URL}/users/register/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      throw new Error("Signup failed: user already exists or invalid data");
    }
  },

  update: async (userData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      console.log(userData.email);
      if (!('email' in userData) || !userData.email){
        userData.email = currentUser.email
      }
      const payload =  {
        ...userData
      };
      if (userData.confirmPassword) {
        payload.confirmPassword = userData.confirmPassword;
      }
      const response = await axios.post(
        `${API_BASE_URL}/users/update/`,
        payload,
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

  delete: async (userData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      console.log(userData.email);
      if (!('email' in userData) || !userData.email){
        userData.email = currentUser.email
      }
      const payload =  {
        ...userData
      };
      const response = await axios.post(
        `${API_BASE_URL}/users/delete/`,
        payload,
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

  updateProfile: async (formData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_BASE_URL}/users/update/`,
        formData,
        {
          headers: {
            ...getHeaders(true),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Profile update failed");
    }
  },

  deleteDocument: async (docType) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_BASE_URL}/users/delete-document/`,
        { document_type: docType },
        {
          headers: getHeaders(true),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Document deletion error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Document deletion failed");
    }
  },
};
