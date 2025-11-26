// API configuration
// Change localhost to your IP address if testing on a physical device
// Example: "http://192.168.1.100:3000/api"
const API_BASE_URL = "http://10.254.201.72:3000/api";

// Make API request
async function apiRequest(basePath, endpoint, method, body) {
  const url = `${API_BASE_URL}${basePath}${endpoint}`;

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.err || data.message || "Something went wrong");
  }

  return data;
}

// User API functions
export const userAPI = {
  // Sign up
  async signup(userData) {
    return apiRequest("/users", "/signup", "POST", userData);
  },

  // Login
  async login(credentials) {
    return apiRequest("/users", "/login", "POST", credentials);
  },

  // Logout
  async logout() {
    return apiRequest("/users", "/logout", "POST", null);
  },

  // Search users
  async search(query) {
    return apiRequest("/users", `/search?q=${encodeURIComponent(query)}`, "GET", null);
  },
};

// Post API functions
export const postAPI = {
  // Create a new post
  async createPost(postData) {
    return apiRequest("/posts", "/", "POST", postData);
  },

  // Get all posts
  async getAllPosts() {
    return apiRequest("/posts", "/", "GET", null);
  },

  // Search posts
  async search(query) {
    return apiRequest("/posts", `/search?q=${encodeURIComponent(query)}`, "GET", null);
  },

  // Toggle like
  async toggleLike(postId) {
    return apiRequest("/posts", `/${postId}/like`, "POST", null);
  },

  // Add comment
  async addComment(postId, content) {
    return apiRequest("/posts", `/${postId}/comments`, "POST", { content });
  },

  // Get comments
  async getComments(postId) {
    return apiRequest("/posts", `/${postId}/comments`, "GET", null);
  },
};

export default userAPI;
