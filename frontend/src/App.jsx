import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Channel from "./pages/Channel";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/messages/:userId" element={<Channel />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/users/:userId" element={<UserProfile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;