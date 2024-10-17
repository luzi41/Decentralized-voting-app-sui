import './App.css'
import Login from './pages/login/Login';
import Elections from './pages/Elections/Elections';
import Candidates from './pages/Candidates/Candidates';
import RegisterPage from './pages/Register/Register';
import Elections2 from './pages/Elections2/Elections2';
import CreateElectionPage from './pages/CreateELection/CreateElection';
import StartElectionPage from './pages/StartElection/StartElection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Elections />} />
        <Route path="/election/:id" element={<Candidates />} />
        <Route path="/register/:id" element={<RegisterPage />} />
        <Route path="/election2/:id" element={<Elections2 />} />
        <Route path="/create-election" element={<CreateElectionPage />} />
        <Route path="/register/:id/start-election" element={<StartElectionPage />} />
      </Routes>
    </Router>
  );
}

export default App
