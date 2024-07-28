import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChallengeBoard.css';

const ChallengeBoard = () => {
    const [challenges, setChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState('');
    const [completedChallenges, setCompletedChallenges] = useState(new Set());

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await axios.get('http://localhost:1000/api/challenges');
                setChallenges(response.data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            }
        };

        fetchChallenges();
    }, []);

    const addChallenge = async () => {
        if (newChallenge.trim()) {
            try {
                const username = localStorage.getItem("username");
                const response = await axios.post('http://localhost:1000/api/createChallenge', {
                    username: username, // Replace with actual username
                    text: newChallenge,
                });
                setChallenges([...challenges, response.data]);
                setNewChallenge('');
            } catch (error) {
                console.error('Error adding challenge:', error);
            }
        }
    };

    const joinChallenge = async (id) => {
        try {
            const username = localStorage.getItem("username");
            const response = await axios.post(`http://localhost:1000/api/joinChallenge/${id}`, {
                username: username, // Replace with actual username
            });
            setChallenges(challenges.map(challenge => challenge.id === id ? response.data : challenge));
        } catch (error) {
            console.error('Error joining challenge:', error);
        }
    };

    const completeChallenge = async (id) => {
        try {
            let i = String(localStorage.getItem("completed-challenges"));
            if (!i) {
                localStorage.setItem("completed-challenges", 1);
            } else {
                localStorage.setItem("completed-challenges", parseInt(i) + 1);
            }
            
            // Add the challenge ID to the completedChallenges set
            setCompletedChallenges(new Set([...completedChallenges, id]));

            setTimeout(async () => {
                const response = await axios.post(`http://localhost:1000/api/completeChallenge/${id}`);
                
                // Remove the challenge from the state after the animation
                setChallenges(prevChallenges => prevChallenges.filter(challenge => challenge.id !== id));
                // Remove the challenge ID from the completedChallenges set
                setCompletedChallenges(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            }, 500); // Match the animation duration
        } catch (error) {
            console.error('Error completing challenge:', error);
        }
    };

    return (
        <div className="challenge-board">
            <h2>Challenge Board</h2>
            <div className="input-container">
                <input
                    type="text"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    placeholder="Enter a new challenge"
                    className="input-field"
                />
                <button onClick={addChallenge} className="add-button">Add Challenge</button>
            </div>
            <ul className="challenge-list">
                {challenges.map((challenge) => (
                    <li 
                        key={challenge.id} 
                        className={`challenge-item ${completedChallenges.has(challenge.id) ? 'fade-down' : ''}`}
                    >
                        <div className="challenge-text">
                            <span>{challenge.text} (created by {challenge.creator})</span>
                            <button onClick={() => joinChallenge(challenge.id)} className="join-button">Join Challenge</button>
                            <button onClick={() => completeChallenge(challenge.id)} className="complete-button">Complete Challenge</button>
                            <span>Completed: {challenge.completedCount}</span>
                        </div>
                        <ul className="participants-list">
                            {challenge.participants.map((participant, i) => (
                                <li key={i} className="participant-item">{participant}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChallengeBoard;
