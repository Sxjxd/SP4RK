import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authorization token is missing. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setReservations(response.data);
        } else {
          setReservations([]);
        }

        setError('');
      } catch (error) {
        setError('Error fetching reservations');
        console.error('Error fetching reservations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing. Please log in.');
        return;
      }

      await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the reservation list after deletion
      setReservations(reservations.filter((reservation) => reservation._id !== reservationId));
    } catch (error) {
      setError('Error deleting reservation');
      console.error('Error deleting reservation', error);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing. Please log in.');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/reservations/${reservationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the reservation list with the updated status
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === reservationId ? { ...reservation, status: newStatus } : reservation
        )
      );
    } catch (error) {
      setError('Error updating reservation status');
      console.error('Error updating reservation status', error);
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">Reservation ID</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">Bike</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">Station</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">Start Date</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">End Date</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">Total Cost</th>
                <th className="px-6 py-3 bg-gray-200 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="border-t border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-700">{reservation.reservationId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{reservation.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{reservation.bike?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{reservation.station?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(reservation.startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{reservation.endDate ? new Date(reservation.endDate).toLocaleDateString() : 'Ongoing'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <select
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                      className="px-3 py-2 border bg-white border-gray-500 rounded-md"
                    >
                      <option value="reserved">Reserved</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">LKR {reservation.totalCost || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      onClick={() => handleDeleteReservation(reservation._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReservationManagement;
