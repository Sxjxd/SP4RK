import { Link, useNavigate } from 'react-router-dom';

const UserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#1e3a8a] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/user-dashboard" className="text-white text-2xl font-extrabold">SP4RK</Link>
        </div>
        <div>
          <Link to="/user-dashboard" className="text-white hover:text-yellow-400 mr-6 font-semibold">Dashboard</Link>
          <Link to="/bikes" className="text-white hover:text-yellow-400 mr-6 font-semibold">Bikes</Link>
          <Link to="/reservations" className="text-white hover:text-yellow-400 mr-6 font-semibold">My Reservations</Link>
          <button
            onClick={handleLogout}
            className="bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg hover:bg-yellow-500 ml-4 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
