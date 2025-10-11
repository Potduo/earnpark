import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Hero from './components/Landing/Hero';
import CompanyLogos from './components/Landing/CompanyLogos';
import Testimonials from './components/Landing/Testimonials';
import TrustSection from './components/Landing/TrustSection';
import LoginForm from './components/Auth/LoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import DashboardLayout from './components/Dashboard/Layout';
import Overview from './components/Dashboard/Overview';
import Investments from './components/Dashboard/Investments';
import Deposits from './components/Dashboard/Deposits';
import Withdrawals from './components/Dashboard/Withdrawals';
import Transactions from './components/Dashboard/Transactions';
import Performance from './components/Dashboard/Performance';
import Support from './components/Dashboard/Support';
import Chatbot from './components/Dashboard/Chatbot';

// Pages
import Contact from './pages/Contact';
import Features from './pages/Features';
import Markets from './pages/Markets';
import About from './pages/About';

// ✅ Reusable PrivateRoute
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useAuth(); // Used to optionally show Chatbot only for logged-in users

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<PageLayout><LoginForm /></PageLayout>} />
        <Route path="/signup" element={<PageLayout><SignUpForm /></PageLayout>} />
        <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
        <Route path="/features" element={<PageLayout><Features /></PageLayout>} />
        <Route path="/markets" element={<PageLayout><Markets /></PageLayout>} />
        <Route path="/about" element={<PageLayout><About /></PageLayout>} />

        {/* ✅ Protected Dashboard */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Overview />} />
          <Route path="investments" element={<Investments />} />
          <Route path="deposits" element={<Deposits />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="performance" element={<Performance />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>

      {/* ✅ Optional: Chatbot only when logged in */}
      {user && <Chatbot />}
    </Router>
  );
}

// Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <CompanyLogos />
      <Testimonials />
      <TrustSection />
      <Footer />
    </div>
  );
};

// Page Layout Component
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default App;
