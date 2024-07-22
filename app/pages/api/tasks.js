import axios from 'axios';

export default async function handler(req, res) {
    const { method } = req;
  
    switch (method) {
      case 'GET':
        try {
          const response = await axios.get(`http://localhost${process.env.TASKS_PORT}`);
          res.status(200).json(response.data);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch tasks' });
        }
        break;
      case 'POST':
        try {
          const response = await axios.post(`http://localhost${process.env.TASKS_PORT}`, req.body);
          res.status(201).json(response.data);
        } catch (error) {
          res.status(500).json({ error: 'Failed to create task' });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }