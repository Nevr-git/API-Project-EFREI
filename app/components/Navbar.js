"use client"

import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const links = [
    {
      id: 1,
      path: '/',
      text: 'Home',
    },
    {
      id: 2,
      path: '/about',
      text: 'About',
    },
    {
      id: 3,
      path: '/profile',
      text: 'Profile',
    },
    {
      id: 4,
      path: '/login',
      text: 'Login with Google'
    }
  ];
  return (
    <nav>
      <ul className="nav-menu">
        {
                    links.map((link) => (
                      <li key={link.id}>
                        <NavLink to={link.path} className="nav-item">{link.text}</NavLink>
                      </li>
                    ))
                }
      </ul>
    </nav>
  );
};

export default Navbar;
