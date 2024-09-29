import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4">
          <h2 className="text-xl font-bold mt-2 mb-8">SP4RK Dashboard</h2>
          <ul className="mt-4">
          <li className="mt-2">
              <Link to="/admin/analytics" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Analytics
              </Link>
            </li>
            <li className="mt-2">
              <Link to="/admin/bikes" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Manage Bikes
              </Link>
            </li>
            <li className="mt-2">
              <Link to="/admin/stations" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Manage Stations
              </Link>
            </li>
            <li className="mt-2">
              <Link to="/admin/reservations" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Manage Reservations
              </Link>
            </li>
          </ul>
          <hr className="my-4" />
          <button
            onClick={handleLogout}
            className="w-full block px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-center font-bold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* This will render the specific admin page content */}
      </main>
    </div>
  );
};

export default AdminLayout;
