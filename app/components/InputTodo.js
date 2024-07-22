"use client"

import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import handler from '../pages/api/tasks'

const InputTodo = (props) => {
  const [inputTitle, setTitle] = useState({
    title: '',
  });
  const onChange = (e) => {
    setTitle({
      ...inputTitle,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { addTodoItem } = props;
    if (inputTitle.title.trim()) {
      try {
        // Add the todo item locally
        addTodoItem(inputTitle.title);

        // Send the todo item to the backend
        const response = await axios.post('http://localhost:3000/tasks', { title: inputTitle.title });
        console.log('Task added:', response.data);

        setTitle({
          title: '',
        });
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form">
      <input type="text" placeholder="Add todo..." value={inputTitle.title} onChange={onChange} name="title" className="add-todo" />
      <button type="submit" className="add-btn">
        <FaPlusCircle className="add-icon" />
      </button>
    </form>
  );
};

InputTodo.propTypes = {
  addTodoItem: PropTypes.func.isRequired,
};

export default InputTodo;
