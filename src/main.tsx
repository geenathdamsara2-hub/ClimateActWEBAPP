
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { registerUser } from "../services/api";
  import { loginUser } from "../services/api";
  import { getUser } from "../utils/auth";

  const user = getUser();
  createRoot(document.getElementById("root")!).render(<App />);
  const result = await registerUser({

    name,
    email,
    password,
    location,
    bio

  });

  if (result.success) {

    alert("Registration Successful!");
  } else {
    alert(result.message);
  }
  const result = await loginUser({
  email,
  password,
});

if (result.success) {
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));

  alert("Welcome " + result.user.name);
} else {
  alert(result.message);
}