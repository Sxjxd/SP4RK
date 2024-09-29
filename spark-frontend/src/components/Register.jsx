// src/components/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login'); // Redirect to login after successful registration
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 border border-black rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Create your SP4RK account
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-400 text-black placeholder-gray-500 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-400 text-black placeholder-gray-500 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
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
              className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-400 text-black placeholder-gray-500 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-all ease-in-out duration-300"
          >
            Register
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-500 hover:text-yellow-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
