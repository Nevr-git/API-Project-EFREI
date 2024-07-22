"use client"

import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Route, Routes } from 'react-router-dom';
import TodoList from './TodoList';
import Header from './Header';
import InputTodo from './InputTodo';
import About from '../pages/About';
import Login from '../pages/Login'
import NotMatch from '../pages/NotMatch';
import Navbar from './Navbar';
import Profile from '../pages/Profile'
import '../style.css';
import axios from 'axios';

const TodoContainer = () => {
  const [todos, setState] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tasks');  // Fetch from API gateway
        setState(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTodos();
  }, []);


  const handleChange = (id) => {
    setState((prevState) => prevState.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo, completed: !todo.completed,
        };
      }
      return todo;
    }));
  };
  const delTodo = (id) => {
    setState([
      ...todos.filter((todo) => todo.id !== id),
    ]);
  };


  const addTodoItem = (title) => {
    const newTodo = {
      id: uuidv4(),
      title,
      completed: false,
    };
    setState([...todos, newTodo]);
  };


  const setUpdate = (title, id) => {
    setState((prevState) => (
      prevState.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo, title,
          };
        }
        return todo;
      })
    ));
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={(
            <div className="main-container">
              <Header />
              <InputTodo addTodoItem={addTodoItem} />
              <TodoList
                todos={todos}
                handleChange={handleChange}
                delTodo={delTodo}
                setUpdate={setUpdate}
              />
            </div>
    )}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotMatch />} />
      </Routes>
    </>
  );
};

export default TodoContainer;
