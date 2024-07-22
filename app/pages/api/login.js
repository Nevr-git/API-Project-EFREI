import axios from 'axios';

export default async function handler(req, res) {
  const { token } = req.headers.authorization.split(' ')[1];

  try {
    // Verify token with your backend or directly in this API route
    const response = await axios.get('http://localhost:3000/login/profile', {
      headers: {
        Cookie: `token=${token}`
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}