import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Meditate from "./Components/Meditation";
import './App.css';
import Navbar from "./Components/Navbar";
import ChallengeBoard from "./Components/Challenges";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Home from "./Components/Home";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>

                    <Route path="/" element={<Home/>} />
                    <Route path="/challenges" element={<ChallengeBoard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/meditate" element={<Meditate />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
