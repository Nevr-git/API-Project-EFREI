"use client"

import Image from "next/image";
import React from 'react';
import TodoContainer from ".//components/TodoContainer.js";
import { BrowserRouter as Router } from 'react-router-dom';

export default function Home() {
  return (
    <Router>
      <TodoContainer />
    </Router>
  );
}
