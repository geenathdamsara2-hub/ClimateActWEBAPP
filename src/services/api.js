const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "http://localhost:5000/api";

export async function getArticles() {

    const response = await fetch(`${API_URL}/articles`);

    return response.json();

}
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
}

export async function getDashboardStats() {
    const response = await fetch(`${API_URL}/dashboard`);
    return response.json();
}

export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
}
export async function getArticles() {

    const response = await fetch(
        `${API_URL}/articles`
    );

    return response.json();

}