import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import UserDashboard from './Pages/UserDashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/userDashboard' element={<UserDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
