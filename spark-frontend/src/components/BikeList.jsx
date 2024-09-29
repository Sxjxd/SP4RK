import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Use navigate for the back button

const BikeList = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For the back button navigation

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/bikes', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBikes(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching bikes');
        console.error('Error fetching bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  if (loading) return <p className="text-center">Loading bikes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/user-dashboard')}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
      >
      &lt; Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-[#1e3a8a]">Available Bikes for Rent</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bikes.length > 0 ? (
          bikes.map((bike) => (
            <div key={bike._id} className="bg-white border rounded-lg shadow-lg p-4 text-center transition-transform transform hover:scale-105">
              <img
                src={bike.images.length > 0 ? `http://localhost:5000/${bike.images[0]}` : 'https://via.placeholder.com/150'}
                alt={bike.name}
                className="w-full h-48 object-contain mb-4 rounded-lg"
              />
              <h3 className="text-xl font-bold text-[#1e3a8a]">{bike.name}</h3>
              <p className="text-lg text-[#facc15] font-semibold">LKR {bike.pricePerDay.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">{bike.description}</p>
              <Link
                to={`/bikes/${bike._id}`}
                className="mt-4 inline-block bg-[#1e3a8a] text-white py-2 px-6 rounded-lg hover:bg-[#334155] hover:text-[#facc15] transition-colors"
              >
                Rent Now
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-600">No bikes available.</p>
        )}
      </div>
    </div>
  );
};

export default BikeList;
