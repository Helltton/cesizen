import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PageContent from './pages/PageContent';
import InformationsList from './pages/InformationsList';
import Diagnostic from './pages/Diagnostic';
import DiagnosticResult from './pages/DiagnosticResult';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDiagnostic from './pages/admin/AdminDiagnostic';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MesResultats from './pages/MesResultats';
import AdminPages from './pages/admin/AdminPages';
import MonCompte from './pages/MonCompte';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <a href="#main-content" style={{
          position: 'absolute', left: '-9999px', top: 'auto',
          width: 1, height: 1, overflow: 'hidden', zIndex: 9999
        }}
          onFocus={e => { e.target.style.left = '0'; e.target.style.width = 'auto'; e.target.style.height = 'auto'; }}
          onBlur={e => { e.target.style.left = '-9999px'; e.target.style.width = '1px'; e.target.style.height = '1px'; }}
        >
          Aller au contenu principal
        </a>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/informations/:slug" element={<InformationsList />} />
          <Route path="/pages/:slug" element={<PageContent />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/diagnostic/result/:id" element={
            <ProtectedRoute><DiagnosticResult /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminUsers /></AdminRoute>
          } />
          <Route path="/admin/diagnostic" element={
            <AdminRoute><AdminDiagnostic /></AdminRoute>
          } />
          <Route path="/mes-resultats" element={
            <ProtectedRoute><MesResultats /></ProtectedRoute>
          } />
          <Route path="/admin/pages" element={
            <AdminRoute><AdminPages /></AdminRoute>
          } />
          <Route path="/mon-compte" element={
            <ProtectedRoute><MonCompte /></ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}