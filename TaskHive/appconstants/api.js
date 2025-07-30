// Centralized API configuration
export const API_BASE_URL = "http://100.112.17.249:8080/api";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  GOOGLE_LOGIN: "/auth/google",
};

// Workspace endpoints
export const WORKSPACE_ENDPOINTS = {
  CREATE: "/workspaces",
  GET_ALL: "/workspaces",
  INVITE: "/workspaces/invite",
};

// Board endpoints
export const BOARD_ENDPOINTS = {
  CREATE: "/boards",
  GET_BY_WORKSPACE: "/boards",
};

// Other endpoints
export const USER_ENDPOINTS = {
  PROFILE: "/users/me",
};
