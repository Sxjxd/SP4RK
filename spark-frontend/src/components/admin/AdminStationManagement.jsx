import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminStationManagement = () => {
  const [stations, setStations] = useState([]); // Initialize as an empty array
  const [newStation, setNewStation] = useState({ name: '', address: '' });
  const [editingStation, setEditingStation] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching stations
  const [formSubmitting, setFormSubmitting] = useState(false); // Loading state for form submission
  const [error, setError] = useState(''); // State to store errors

  // Fetch stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          setError("No token found, authorization failed.");
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/stations', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the headers
          },
        });

        // Ensure the response is an array
        if (Array.isArray(response.data)) {
          setStations(response.data);
        } else {
          setStations([]); // Fallback to an empty array if response is not as expected
        }
      } catch (error) {
        setError('Error fetching stations');
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewStation({ ...newStation, [e.target.name]: e.target.value });
  };

  // Handle create or update station submission
  const handleCreateOrUpdateStation = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newStation.name || !newStation.address) {
      setError('Please fill out both the station name and address.');
      return;
    }

    setFormSubmitting(true);
    try {
      const token = localStorage.getItem('token'); // Retrieve token for authenticated request
      if (!token) {
        setError("No token found, authorization failed.");
        setFormSubmitting(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`, // Attach the token to the headers
      };

      if (editingStation) {
        // Update station
        await axios.put(`http://localhost:5000/api/stations/${editingStation._id}`, newStation, { headers });
        setStations(stations.map(station => 
          station._id === editingStation._id ? { ...station, ...newStation } : station
        ));
        setEditingStation(null);
      } else {
        // Create station
        const response = await axios.post('http://localhost:5000/api/stations', newStation, { headers });
        setStations([...stations, response.data]);
      }

      // Reset form
      setNewStation({ name: '', address: '' });
      setError(''); // Clear any previous error messages
    } catch (error) {
      setError('Error creating/updating station');
      console.error('Error creating/updating station:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle station editing
  const handleEditStation = (station) => {
    setNewStation(station);
    setEditingStation(station);
    setError(''); // Clear any previous error messages
  };

  // Handle station deletion
  const handleDeleteStation = async (stationId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token for authenticated request
      if (!token) {
        setError("No token found, authorization failed.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/stations/${stationId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Attach the token to the headers
      });
      setStations(stations.filter(station => station._id !== stationId));
    } catch (error) {
      setError('Error deleting station');
      console.error('Error deleting station:', error);
    }
  };

  if (loading) return <p className="text-gray-700">Loading stations...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Stations</h2>

      {/* Display error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{editingStation ? 'Edit Station' : 'Create New Station'}</h3>
        <form onSubmit={handleCreateOrUpdateStation} className="space-y-4">
          <div>
            <label className="block text-gray-700">Station Name</label>
            <input
              type="text"
              name="name"
              value={newStation.name}
              placeholder="Enter Station Name"
              onChange={handleInputChange}
              className="w-full bg-gray-200 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Station Address</label>
            <input
              type="text"
              name="address"
              value={newStation.address}
              placeholder="Enter Station Address"
              onChange={handleInputChange}
              className="w-full bg-gray-200 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={formSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                formSubmitting ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {formSubmitting ? (editingStation ? 'Updating...' : 'Creating...') : (editingStation ? 'Update Station' : 'Create Station')}
            </button>
            {editingStation && (
              <button
                type="button"
                onClick={() => {
                  setEditingStation(null);
                  setNewStation({ name: '', address: '' });
                }}
                className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Stations List</h3>
      {stations.length === 0 ? (
        <p className="text-gray-700">No stations available.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {stations.map(station => (
              <li key={station._id} className="p-4 bg-gray-100 rounded-md flex justify-between items-center">
                <div>
                  <strong className="text-lg text-gray-800">{station.name}</strong>
                  <p className="text-gray-600">{station.address}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditStation(station)}
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStation(station._id)}
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminStationManagement;
