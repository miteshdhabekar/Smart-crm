// import axios from "axios";

// const api = axios.create({
//   baseURL: ["http://localhost:5000",import.meta.env.VITE_BACKEND_URL],
//   withCredentials: true,
// });

// export default api;

import axios from "axios";

// Check if the app is running in development mode
const isDevelopment = import.meta.env.MODE === 'development';

const api = axios.create({
  // If local, use localhost. If deployed, use the Vercel/Production URL.
  baseURL: isDevelopment 
    ? "http://localhost:5000/api" 
    : `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

export default api;