import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDollarSign, FaBicycle, FaChartBar } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [popularBikes, setPopularBikes] = useState([]);
  const [revenueOverTime, setRevenueOverTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const revenueResponse = await axios.get('http://localhost:5000/api/analytics/total-revenue', { headers });
        setTotalRevenue(revenueResponse.data.totalRevenue || 0);

        const bikesResponse = await axios.get('http://localhost:5000/api/analytics/total-bikes', { headers });
        setTotalBikes(bikesResponse.data.totalBikes);

        const reservationsResponse = await axios.get('http://localhost:5000/api/analytics/total-reservations', { headers });
        setTotalReservations(reservationsResponse.data.totalReservations);

        const popularBikesResponse = await axios.get('http://localhost:5000/api/analytics/popular-bikes-rentals', { headers });
        setPopularBikes(Array.isArray(popularBikesResponse.data) ? popularBikesResponse.data : []);

        const revenueOverTimeResponse = await axios.get('http://localhost:5000/api/analytics/revenue-over-time', { headers });
        setRevenueOverTime(Array.isArray(revenueOverTimeResponse.data) ? revenueOverTimeResponse.data : []);

        setError('');
      } catch (error) {
        setError('Error fetching analytics data');
        console.error('Error fetching analytics data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <p>Loading analytics data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Prepare data for charts
  const popularBikesData = {
    labels: popularBikes.map((bike) => bike.bikeDetails.name),
    datasets: [
      {
        label: 'Rentals',
        data: popularBikes.map((bike) => bike.totalRentals),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const revenueOverTimeData = {
    labels: revenueOverTime.map((data) => data._id),
    datasets: [
      {
        label: 'Revenue',
        data: revenueOverTime.map((data) => data.totalRevenue),
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  // Chart options for responsiveness and layout
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    layout: {
      padding: 20,
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Analytics Overview</h2>

      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <FaDollarSign className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">LKR {totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <FaBicycle className="text-4xl text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Total Bikes</h3>
          <p className="text-3xl font-bold text-gray-900">{totalBikes}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <FaChartBar className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Total Reservations</h3>
          <p className="text-3xl font-bold text-gray-900">{totalReservations}</p>
        </div>
      </div>

      {/* Popular Bikes by Rentals */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Popular Bikes by Rentals</h3>
        <div style={{ height: '300px' }}>
          <Bar data={popularBikesData} options={chartOptions} />
        </div>
      </div>

      {/* Revenue Over Time */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Revenue Over Time</h3>
        <div style={{ height: '300px' }}>
          <Line data={revenueOverTimeData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
