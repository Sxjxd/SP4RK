import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBikeManagement = () => {
  const [bikes, setBikes] = useState([]);
  const [stations, setStations] = useState([]);
  const [newBike, setNewBike] = useState({
    name: '',
    description: '',
    totalQuantity: 0,
    station: '',
    pricePerDay: 0,
    status: 'available',
  });
  const [imageFile, setImageFile] = useState(null); // New state for handling image file
  const [editingBike, setEditingBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        const [bikeResponse, stationResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/bikes', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/stations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBikes(Array.isArray(bikeResponse.data) ? bikeResponse.data : []);
        setStations(Array.isArray(stationResponse.data) ? stationResponse.data : []);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewBike({ ...newBike, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Update the image file state when a new file is selected
  };

  const handleCreateOrUpdateBike = async (e) => {
    e.preventDefault();
    if (!newBike.name || !newBike.description || !newBike.totalQuantity || !newBike.station || !newBike.pricePerDay) {
      setError('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newBike.name);
    formData.append('description', newBike.description);
    formData.append('totalQuantity', newBike.totalQuantity);
    formData.append('station', newBike.station);
    formData.append('pricePerDay', newBike.pricePerDay);
    formData.append('status', newBike.status);
    if (imageFile) {
      formData.append('image', imageFile); // Append the selected image file to the form data
    }

    try {
      const token = localStorage.getItem('token');

      if (editingBike) {
        // Update existing bike
        const response = await axios.put(`http://localhost:5000/api/bikes/${editingBike._id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setBikes(bikes.map((bike) => (bike._id === editingBike._id ? response.data : bike)));
        setEditingBike(null);
      } else {
        // Create a new bike
        const response = await axios.post('http://localhost:5000/api/bikes', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setBikes([...bikes, response.data]);
      }

      setNewBike({ name: '', description: '', totalQuantity: 0, station: '', pricePerDay: 0, status: 'available' });
      setImageFile(null); // Clear image file state after submission
      setIsFormVisible(false);
      setError(null);
    } catch (error) {
      setError(editingBike ? 'Error updating bike' : 'Error creating bike');
      console.error('Error creating/updating bike', error);
    }
  };

  const handleEditBike = (bike) => {
    setEditingBike(bike);
    setNewBike({
      name: bike.name,
      description: bike.description,
      totalQuantity: bike.totalQuantity,
      station: bike.station ? bike.station._id : '',
      pricePerDay: bike.pricePerDay,
      status: bike.status,
    });
    setIsFormVisible(true);
    setError(null);
  };

  const handleDeleteBike = async (bikeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bikes/${bikeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBikes(bikes.filter((bike) => bike._id !== bikeId));
    } catch (error) {
      setError('Error deleting bike');
      console.error('Error deleting bike', error);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    setEditingBike(null);
    setNewBike({ name: '', description: '', totalQuantity: 0, station: '', pricePerDay: 0, status: 'available' });
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Bikes</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={toggleFormVisibility}
        className="mb-6 px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg"
      >
        {isFormVisible ? 'Hide Form' : 'Add New Bike'}
      </button>

      {isFormVisible && (
        <form className="space-y-6 mb-8" onSubmit={handleCreateOrUpdateBike} encType="multipart/form-data">
          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="bikeName">
              Bike Name
            </label>
            <input
              type="text"
              name="name"
              value={newBike.name}
              id="bikeName"
              placeholder="Bike Name"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="bikeDescription">
              Bike Description
            </label>
            <textarea
              name="description"
              value={newBike.description}
              id="bikeDescription"
              placeholder="Bike Description"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="totalQuantity">
              Total Quantity
            </label>
            <input
              type="number"
              name="totalQuantity"
              value={newBike.totalQuantity}
              id="totalQuantity"
              placeholder="Total Quantity"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="pricePerDay">
              Price Per Day (LKR)
            </label>
            <input
              type="number"
              name="pricePerDay"
              value={newBike.pricePerDay}
              id="pricePerDay"
              placeholder="Price Per Day (LKR)"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="station">
              Select Station
            </label>
            <select
              name="station"
              value={newBike.station}
              id="station"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-100"
            >
              <option value="" disabled>Select Station</option>
              {stations.length > 0 ? (
                stations.map((station) => (
                  <option key={station._id} value={station._id}>
                    {station.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No stations available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="image">
              Upload Bike Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="status">
              Bike Status
            </label>
            <select
              name="status"
              value={newBike.status}
              id="status"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-100"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          >
            {editingBike ? 'Update Bike' : 'Create Bike'}
          </button>
        </form>
      )}

      <h3 className="text-2xl font-semibold mb-4">Bikes List</h3>
      <ul className="space-y-4">
        {bikes.length > 0 ? (
          bikes.map((bike) => (
            <li
              key={bike._id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-md"
            >
              <div className="w-1/2">
                <strong className="block text-xl font-bold">{bike.name}</strong>
                <p className="text-gray-700">{bike.description}</p>
                <p className="text-gray-600">Total Quantity: {bike.totalQuantity}</p>
                <p className="text-gray-600">Available Quantity: {bike.availableQuantity}</p>
                <p className="text-gray-600">Price Per Day: LKR {bike.pricePerDay}</p>
                <p className="text-gray-600">
                  Station: {bike.station && bike.station.name ? bike.station.name : 'Station not available'}
                </p>
                <p className="text-gray-600">Status: {bike.status}</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEditBike(bike)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBike(bike._id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="w-1/2 flex justify-center">
                <img
                  src={bike.images.length > 0 ? `http://localhost:5000/${bike.images[0]}` : 'https://via.placeholder.com/150'}
                  alt={bike.name}
                  className="w-48 h-auto object-cover rounded-lg"
                />
              </div>
            </li>
          ))
        ) : (
          <p>No bikes available.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminBikeManagement;
