import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Token missing. Please log in again.');
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/reservations/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching reservations');
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleBackToHome = () => {
    navigate('/user-dashboard');
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const currentDate = new Date();

  const upcomingReservations = reservations.filter((reservation) =>
    new Date(reservation.startDate) > currentDate
  );

  const ongoingReservations = reservations.filter((reservation) =>
    new Date(reservation.startDate) <= currentDate && (!reservation.endDate || new Date(reservation.endDate) >= currentDate)
  );

  const pastReservations = reservations.filter(
    (reservation) => reservation.endDate && new Date(reservation.endDate) < currentDate
  );

  return (
    <div className="p-6">
      {/* Back Button */}
      <button 
        onClick={handleBackToHome}
        className="bg-[#facc15] hover:bg-[#eab308] text-white py-2 px-4 rounded-lg mb-6"
      >
        &lt; Back
      </button>

      <h2 className="text-4xl font-bold mb-8 text-center text-[#1e3a8a]">My Reservations</h2>

      {/* Upcoming Reservations */}
      <section>
        <h3 className="text-3xl font-semibold mb-6 text-[#1e3a8a]">Upcoming Reservations</h3>
        {upcomingReservations.length > 0 ? (
          <ul className="space-y-6">
            {upcomingReservations.map((reservation) => (
              <li key={reservation._id} className="border rounded-lg bg-white shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <strong className="block text-2xl font-bold text-[#1e3a8a]">
                      {reservation.bike ? reservation.bike.name : 'N/A'}
                    </strong>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Reservation ID:</span> {reservation.reservationId}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Start Date:</span> {new Date(reservation.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">End Date:</span> {reservation.endDate ? new Date(reservation.endDate).toLocaleDateString() : 'Ongoing'}
                    </p>
                  </div>
                  <div className="text-lg font-semibold mt-4 sm:mt-0 text-yellow-500">
                    Upcoming
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-600">No upcoming reservations found.</p>
        )}
      </section>

      {/* Ongoing Reservations */}
      <section className="mt-12">
        <h3 className="text-3xl font-semibold mb-6 text-[#1e3a8a]">Ongoing Reservations</h3>
        {ongoingReservations.length > 0 ? (
          <ul className="space-y-6">
            {ongoingReservations.map((reservation) => (
              <li key={reservation._id} className="border rounded-lg bg-white shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <strong className="block text-2xl font-bold text-[#1e3a8a]">
                      {reservation.bike ? reservation.bike.name : 'N/A'}
                    </strong>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Reservation ID:</span> {reservation.reservationId}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Start Date:</span> {new Date(reservation.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">End Date:</span> {reservation.endDate ? new Date(reservation.endDate).toLocaleDateString() : 'Ongoing'}
                    </p>
                  </div>
                  <div className="text-lg font-semibold mt-4 sm:mt-0 text-blue-500">
                    Ongoing
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-600">No ongoing reservations found.</p>
        )}
      </section>

      {/* Past Reservations */}
      <section className="mt-12">
        <h3 className="text-3xl font-semibold mb-6 text-[#1e3a8a]">Past Reservations</h3>
        {pastReservations.length > 0 ? (
          <ul className="space-y-6">
            {pastReservations.map((reservation) => (
              <li key={reservation._id} className="border rounded-lg bg-white shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <strong className="block text-2xl font-bold text-[#1e3a8a]">
                      {reservation.bike ? reservation.bike.name : 'N/A'}
                    </strong>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Reservation ID:</span> {reservation.reservationId}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Start Date:</span> {new Date(reservation.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">End Date:</span> {new Date(reservation.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-lg font-semibold mt-4 sm:mt-0 text-green-500">
                    Completed
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-600">No past reservations found.</p>
        )}
      </section>
    </div>
  );
};

export default MyReservations;
