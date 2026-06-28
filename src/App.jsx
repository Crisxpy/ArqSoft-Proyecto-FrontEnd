import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import LandingPage from './pages/LandingPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import { AuthProvider, useAuth } from './adapters/hooks/useAuth.jsx';
import { CartProvider } from './adapters/hooks/useCart.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = () => {
    navigate('/tienda');
  };

  return <Login onLogin={login} onLoginSuccess={handleLoginSuccess} />;
}

// Protege /tienda - si no hay sesion, redirige a /login.
function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/tienda"
              element={
                <RequireAuth>
                  <StorePage />
                </RequireAuth>
              }
            />
            <Route path="/productos/:id" element={<ProductPage />} />

            {/* Admin: rutas separadas, sin link visible desde la tienda principal */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
