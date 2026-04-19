import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PageContent from './pages/PageContent';
import Diagnostic from './pages/Diagnostic';
import DiagnosticResult from './pages/DiagnosticResult';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDiagnostic from './pages/admin/AdminDiagnostic';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import InformationsList from './pages/InformationsList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pages/:slug" element={<PageContent />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/informations/:slug" element={<InformationsList />} />
        <Route path="/diagnostic/result/:id" element={
          <ProtectedRoute><DiagnosticResult /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminUsers /></AdminRoute>
        } />
        <Route path="/admin/diagnostic" element={
          <AdminRoute><AdminDiagnostic /></AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}