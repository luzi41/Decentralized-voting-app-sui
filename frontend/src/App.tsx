import './App.css'
import Login from './pages/login/Login';
import Elections from './pages/Elections/Elections';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Elections />} />
      </Routes>
    </Router>
  );
}

export default App
