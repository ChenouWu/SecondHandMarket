import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingPage";
import SignUpPage from "./Pages/SignUpPage";
import Navbar from "./Conponent/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import AddFriends from "./Pages/AddFriends";
import Landing from "./Pages/Landing";
import Posting from "./Pages/Posting";
import SinglePostingPage from "./Pages/SinglePostingPage";
function App() {
  const { authUser, checkAuth, ischeckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (ischeckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <Routes>
        <Route path="/posting" element ={<Posting/>}/>
        <Route path="/posting/:id" element={<SinglePostingPage />} />
        <Route path="/HomePage" element={<HomePage/>}/> // MessagePage
        <Route path="/" element={authUser ? <Landing /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} /> 
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/add-friend" element={<AddFriends />} />

      </Routes>
    </div>
  );
}

export default App;
