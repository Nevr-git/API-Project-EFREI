require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express()

const BASE_URL = process.env.TASKS_MICROSERVICE_URL; // Ensure this is set in your .env.local

// Function to get all tasks
async function getTasks() {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

// Function to get a task by ID
async function getTaskById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
}

// Function to create a new task
async function createTask(task) {
  try {
    const response = await axios.post(`${BASE_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

// Function to update an existing task
async function updateTask(id, task) {
  try {
    const response = await axios.put(`${BASE_URL}/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw error;
  }
}

// Function to delete a task
async function deleteTask(id) {
  try {
    await axios.delete(`${BASE_URL}/tasks/${id}`);
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw error;
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

app.listen(SERVER_PORT, () => {
    console.log(`Login is running on http://localhost:${SERVER_PORT}`);
  });