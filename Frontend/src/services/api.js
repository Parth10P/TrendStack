// API configuration
// Change localhost to your IP address if testing on a physical device
// Example: "http://192.168.1.100:3000/api/users"
const API_BASE_URL = "http://localhost:3000/api/users";

// Make API request
async function apiRequest(endpoint, method, body) {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
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
    return apiRequest("/signup", "POST", userData);
  },

  // Login
  async login(credentials) {
    return apiRequest("/login", "POST", credentials);
  },

  // Logout
  async logout() {
    return apiRequest("/logout", "POST", null);
  },
};

export default userAPI;
