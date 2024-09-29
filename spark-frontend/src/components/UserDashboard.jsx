import { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavbar from './UserNavbar';  // Import Navbar
import BannerSlider from './BannerSlider'; // Import BannerSlider
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/bikes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBikes(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <UserNavbar />  {/* Include Navbar */}
      <BannerSlider />  {/* Include the BannerSlider at the top */}
      
      <div className="p-6">
        <h2 className="text-3xl font-bold mt-6 mb-6 text-center text-[#1e3a8a]">Reserve your bike!</h2>

        {/* Grid layout with 3 items per row on medium screens and up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bikes.length > 0 ? (
            bikes.map((bike) => (
              <div key={bike._id} className="bg-white border rounded-lg shadow-md p-4 text-center">
                <img
                  src={bike.images.length > 0 ? `http://localhost:5000/${bike.images[0]}` : 'https://via.placeholder.com/150'}
                  alt={bike.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-[#1e3a8a]">{bike.name}</h3>
                <p className="text-lg text-[#fadb15] font-semibold">LKR {bike.pricePerDay.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">{bike.description}</p>
                <Link
                  to={`/bikes/${bike._id}`}
                  className="mt-4 inline-block bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-[#334155]"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p>No bikes available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
