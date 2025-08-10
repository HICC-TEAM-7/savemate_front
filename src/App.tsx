import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Friend from './pages/Friend';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const location = useLocation();
  const hideSidebar = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen app-background">
      {!hideSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/friend" element={<Friend />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
