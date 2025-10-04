import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ThemeProvider, useTheme } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const AppContent = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={isDark ? 'dark-theme' : 'light-theme'}>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/add-book" element={
          <ProtectedRoute><AddEditBook /></ProtectedRoute>
        } />
        <Route path="/edit-book/:id" element={
          <ProtectedRoute><AddEditBook /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
