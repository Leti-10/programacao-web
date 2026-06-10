import { useState } from "react";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";

export default function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem("atlas_user") ?? "");
  const authenticated = Boolean(localStorage.getItem("atlas_token") && userName);

  function logout() {
    localStorage.removeItem("atlas_token");
    localStorage.removeItem("atlas_user");
    setUserName("");
  }

  return authenticated ? (
    <DashboardPage userName={userName} onLogout={logout} />
  ) : (
    <LoginPage onAuthenticated={setUserName} />
  );
}
