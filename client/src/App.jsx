import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import For_You from "./pages/App/For_You";
import Following from "./pages/App/Following";
import Profile from "./pages/App/Profile";
import Inbox from "./pages/App/Inbox";
import Chat from "./pages/App/Chat";
import Camera from "./pages/App/Camera/Camera";
import Auth from "./pages/Auth/Auth";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import About_Post from "./pages/App/Camera/About_Post";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />}></Route>
        <Route path="/auth" element={<Auth />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      <Route path="/en" element={<Dashboard />}>
        <Route path="" element={<For_You />} />
        <Route path="following" element={<Following />} />
        <Route path="profile" element={<Profile />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="chat" element={<Chat />} />
        <Route path="upload" element={<Camera />} />
        <Route path="about_post" element={<About_Post />} />
      </Route>
    </Routes>
  );
}

export default App;
