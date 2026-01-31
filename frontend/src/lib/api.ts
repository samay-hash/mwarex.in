import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  // User (Creator) auth
  userSignup: (data: { email: string; password: string; name: string; creatorId?: string; role?: string }) =>
    api.post("/api/v1/user/signup", data),

  userSignin: (data: { email: string; password: string }) =>
    api.post("/api/v1/user/signin", data),

  // Admin auth
  adminSignup: (data: { email: string; password: string; name: string }) =>
    api.post("/api/v1/admin/signup", data),

  adminSignin: (data: { email: string; password: string }) =>
    api.post("/api/v1/admin/signin", data),

  // Editor auth
  editorSignup: (data: { email: string; password: string }) =>
    api.post("/api/editor/signup", data),
};

// Video APIs
export const videoAPI = {
  upload: (formData: FormData) =>
    api.post("/api/v1/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getVideos: () => api.get("/api/v1/videos"),

  getPending: () => api.get("/api/v1/videos/pending"),

  approve: (id: string) => api.post(`/api/v1/videos/${id}/approve`),

  reject: (id: string, reason?: string) => api.post(`/api/v1/videos/${id}/reject`, { reason }),

  storeYouTubeTokens: (data: { accessToken: string; refreshToken?: string }) =>
    api.post("/api/v1/videos/store-youtube-tokens", data),

  updateThumbnail: (id: string, thumbnailUrl: string) =>
    api.put(`/api/v1/videos/${id}/thumbnail`, { thumbnailUrl }),

  updateSettings: (id: string, editSettings: any) =>
    api.put(`/api/v1/videos/${id}/edit-settings`, { editSettings }),

  addComment: (id: string, text: string) =>
    api.post(`/api/v1/videos/${id}/comments`, { text }),

  getVideo: (id: string) => api.get(`/api/v1/videos/${id}`),
};



// AI APIs
export const aiAPI = {
  generateTitles: (data: { keywords: string }) => api.post("/api/v1/ai/generate-titles", data),
  generateThumbnails: (data: { topic: string }) => api.post("/api/v1/ai/generate-thumbnails", data),
  analyzeScore: (data: { title: string; description: string }) => api.post("/api/v1/ai/analyze-score", data),
};

// User APIs
export const userAPI = {
  getMe: () => api.get("/api/v1/user/me"),
  getSettings: () => api.get("/api/v1/user/get-settings"),
  updateSettings: (settings: any) => api.put("/api/v1/user/settings", { settings }),
};

// Invite APIs
export const inviteAPI = {
  sendInvite: (email: string) => api.post("/api/v1/invite", { email }),

  verifyInvite: (token: string) => api.get(`/api/v1/verify?token=${token}`),
};

// Google OAuth
export const getGoogleAuthUrl = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${API_BASE_URL}/auth/google?origin=${encodeURIComponent(origin)}`;
};

// Payment APIs
export const paymentAPI = {
  createOrder: (plan: string) => api.post("/api/v1/payment/create-order", { plan }),

  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string
  }) => api.post("/api/v1/payment/verify", data),

  getSubscription: () => api.get("/api/v1/payment/subscription"),

  getPaymentHistory: () => api.get("/api/v1/payment/history"),
};

// Razorpay Key for frontend
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_S9APuUYcsOCve3";

export default api;
