import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import PostEditorPage from './pages/PostEditorPage.jsx';
import { AlertCircle } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-slate-600 mb-6">The page you were looking for does not exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-sm"
      >
        Go to Homepage
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/new"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <PostEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <PostEditorPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
