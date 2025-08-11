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
    <div className="h-screen overflow-hidden app-background">
      {!hideSidebar && <Sidebar />}

      <div className={`${hideSidebar ? 'ml-0' : 'ml-48'} h-screen flex flex-col`}>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/friend" element={<Friend />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
