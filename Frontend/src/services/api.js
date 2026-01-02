// API configuration
// Change localhost to your IP address if testing on a physical device
// Example: "http://192.168.1.100:3000/api"

// this is for hostel
const API_BASE_URL = "http://10.254.202.57:3001/api";
// const API_BASE_URL = "https://trend-stack-x2jh.vercel.app/api";

// this is for mobile hostpot
// const API_BASE_URL = "http://10.70.194.70:3000/api";

// Make API request
async function apiRequest(basePath, endpoint, method, body) {
  const url = `${API_BASE_URL}${basePath}${endpoint}`;

  console.log(`API Request: ${method} ${url}`);

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

  try {
    const response = await fetch(url, options);
    
    // Read text first to debug if JSON parsing fails
    const textData = await response.text();
    let data;
    
    try {
      data = JSON.parse(textData);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.error("Raw Response:", textData);
      throw new Error(`Server returned invalid response: ${textData.substring(0, 50)}...`);
    }

    if (!response.ok) {
      throw new Error(data.err || data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
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
    return apiRequest(
      "/users",
      `/search?q=${encodeURIComponent(query)}`,
      null
    );
  },

  // Update profile
  async updateProfile(userData) {
    return apiRequest("/users", "/profile", "PUT", userData);
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
    return apiRequest(
      "/posts",
      `/search?q=${encodeURIComponent(query)}`,
      "GET",
      null
    );
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
  // Toggle comment like
  async toggleCommentLike(commentId) {
    return apiRequest("/posts", `/comments/${commentId}/like`, "POST", null);
  },
  // Pin/unpin comment
  async pinComment(commentId) {
    return apiRequest("/posts", `/comments/${commentId}/pin`, "POST", null);
  },
};

export default userAPI;
