import axios from "axios";

export const api = axios.create({ baseURL: "http://localhost:3000/api", });

// attach auth to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("auth_user");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // TEMP — until backend fully switches to JWT middleware
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed?.unitId) {
      config.headers["x-unit-id"] = parsed.unitId;
    }
  }

  return config;
});

// ADD THIS PART (IMPORTANT)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized → redirecting to login");

      // clear session
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      // redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;