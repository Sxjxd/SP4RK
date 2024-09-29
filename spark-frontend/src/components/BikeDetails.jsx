import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BikeDetails = () => {
  const { id } = useParams(); 
  const [bike, setBike] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserveError, setReserveError] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(null); 
  const navigate = useNavigate(); 

  const today = new Date().toISOString().split('T')[0]; 

  useEffect(() => {
    const fetchBike = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/bikes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBike(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching bike details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [id]);

  const handleReserveBike = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setReserveError('Please select both start and end dates.');
      return;
    }

    if (endDate < startDate) {
      setReserveError('End date must be the same as or later than the start date.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/reservations/rent/${id}`,
        { startDate, endDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage('Bike reserved successfully!');
      setReserveError(null);

      // Redirect to "My Reservations" page after 2 seconds
      setTimeout(() => {
        navigate('/reservations');
      }, 2000);
    } catch (error) {
      setReserveError('Failed to reserve the bike. Please try again.');
      console.error('Reservation Error:', error);
    }
  };

  if (loading) return <p>Loading bike details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!bike) return <p>Bike not found</p>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)} 
        className="mb-8 text-gray-600 hover:text-black font-semibold"
      >
        &lt; Back to Bikes
      </button>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Bike Image Gallery */}
        <div className="flex justify-center items-center">
          {bike.images && bike.images.length > 0 ? (
            <div className="carousel p-4 border border-gray-300 rounded-lg">
              {bike.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
                  alt={`Bike image ${index + 1}`}
                  className="w-full h-auto max-w-lg object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <img
              src={'https://i.imgur.com/TUC2TnG.png'}
              alt={bike.name}
              className="w-full h-auto max-w-lg object-cover rounded-lg shadow-lg border border-gray-300 p-4"
            />
          )}
        </div>

        {/* Right Column - Bike Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{bike.name}</h1>
          <p className="text-gray-700 text-lg leading-relaxed">{bike.description}</p>
          <div className="text-gray-600 text-lg">
            <p>Station: <strong>{bike.station?.name || 'N/A'}</strong></p>
            <p>Price Per Day: <strong>LKR {bike.pricePerDay}</strong></p>
            <p>Status: <strong>{bike.status === 'available' ? 'Available' : 'Unavailable'} ({bike.availableQuantity})</strong></p>
          </div>

          {/* Display Success or Error Messages */}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {reserveError && <p className="text-red-500">{reserveError}</p>}

          {/* Date Selection for Reservation */}
          <form onSubmit={handleReserveBike} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                min={today} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                min={startDate || today} 
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-300"
                required
              />
            </div>

            {/* Reserve Button */}
            <div>
              {bike.status === 'available' ? (
                <button
                  type="submit"
                  className="w-full py-3 bg-[#facc15] text-[#1e3a8a] text-lg font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Reserve this Bike
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full py-3 bg-gray-400 text-white text-lg font-semibold rounded-lg cursor-not-allowed"
                  disabled
                >
                  Bike Unavailable
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BikeDetails;
