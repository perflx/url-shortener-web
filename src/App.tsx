import './App.css'
import LoginPage from './pages/LoginPage.tsx';
import { Routes, Route, Navigate } from "react-router";
import DashboardPage from './pages/DashboardPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App
