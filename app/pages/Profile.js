import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies'; // For cookie parsing
const jwt = require('jsonwebtoken');

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get the token from cookies
        const { token } = parseCookies();
        console.log(token)
        if (!token) {
          throw new Error('No token found');
        }

        // Fetch user profile from backend
        const response = await axios.get('/api/login', { headers: { Authorization: `Bearer ${token}` } });
        setUser(response.data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.displayName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>No user data</p>
      )}
    </div>
  );
};

export default Profile;