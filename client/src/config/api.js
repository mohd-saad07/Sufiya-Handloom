// Centralized API configuration
// In local development: VITE_API_URL is undefined, so API_BASE is empty and Vite proxy (/api -> localhost:5000) handles the request.
// In production on Vercel: Set VITE_API_URL to your Render backend URL (e.g., https://sufiya-handloom-backend.onrender.com).

export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${path}`;
};
