import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import BikeList from './components/BikeList';
import BikeDetails from './components/BikeDetails';
import MyReservations from './components/MyReservations';
import AdminLayout from './components/AdminLayout';
import AdminBikeManagement from './components/admin/AdminBikeManagement';
import AdminStationManagement from './components/admin/AdminStationManagement';
import AdminReservationManagement from './components/admin/AdminReservationManagement';
import AdminAnalytics from './components/admin/AdminAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/bikes" element={<BikeList />} />
        <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route path="/reservations" element={<MyReservations />} />


        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="bikes" element={<AdminBikeManagement />} />
          <Route path="stations" element={<AdminStationManagement />} />
          <Route path="reservations" element={<AdminReservationManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
