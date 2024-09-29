import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      const { token, role } = res.data;  // Get token and role from the response

      // Store the JWT token in localStorage
      localStorage.setItem('token', token);

      // Set token in axios for future authenticated requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on user role
      if (role === 'admin') {
        navigate('/admin/analytics');  // Redirect to admin dashboard if user is admin
      } else {
        navigate('/user-dashboard');  // Redirect to user dashboard if normal user
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 border border-black rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login to SP4RK</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-400 text-black placeholder-gray-500 rounded-md shadow-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-400 text-black placeholder-gray-500 rounded-md shadow-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-all ease-in-out duration-300"
          >
            Login
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-yellow-500 hover:text-yellow-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
