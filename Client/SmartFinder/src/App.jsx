import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/Home.jsx'
import LoginPage from './pages/Login.jsx'
import RestaurantDetailPage from './pages/RestaurantDetails.jsx'
import ProfilePage from './pages/Profile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Register from './pages/Register.jsx'
import RestaurantsPage from './pages/Restaurants.jsx'
import FavoritesPage from './pages/Favorites.jsx'
import AboutPage from './pages/About.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/restaurants" element={
          <ProtectedRoute>
            <RestaurantsPage />
          </ProtectedRoute>
        } />
        <Route path="/restaurants/:id" element={
          <ProtectedRoute>
            <RestaurantDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/restaurant/:id" element={
          <ProtectedRoute>
            <RestaurantDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        } />

        {/* Protected — must be logged in */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Protected — must be admin */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
