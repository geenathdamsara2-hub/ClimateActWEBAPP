
const API_URL = import.meta.env.VITE_API_URL;
// ARTICLES
export async function getArticles() {
  const response = await fetch(`${API_URL}/api/articles`);
  return response.json();
}

// REGISTER
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return response.json();
}

// LOGIN
export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return response.json();
}

// DASHBOARD
export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/api/dashboard`);
  return response.json();
}