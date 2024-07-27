import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Meditate from "./Components/Meditation";
import './App.css';
import Navbar from "./Components/Navbar";
import ChallengeBoard from "./Components/Challenges";
import Register from "./Components/Register";
import Login from "./Components/Login";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>

                    <Route path="/" element={<Meditate />} />
                    <Route path="/challenges" element={<ChallengeBoard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
