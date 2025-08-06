import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mission from './pages/Mission';

function App() {
  return (
    <div className="min-h-screen app-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
      </Routes>
    </div>
  );
}

export default App;
