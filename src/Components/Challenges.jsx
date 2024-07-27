import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChallengeBoard.css';

const ChallengeBoard = () => {
    const [challenges, setChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState('');

    useEffect(() => {
        axios.get('http://localhost:1000/api/challenges')
            .then(response => setChallenges(response.data))
            .catch(error => console.error('Error fetching challenges:', error));
    }, []);

    const addChallenge = () => {
        if (newChallenge.trim() !== '') {
            const challenge = { text: newChallenge, participants: [] };
            axios.post('http://localhost:1000/api/challenges', challenge)
                .then(response => setChallenges([...challenges, response.data]))
                .catch(error => console.error('Error adding challenge:', error));
            setNewChallenge('');
        }
    };

    const joinChallenge = (index) => {
        const userName = prompt('Enter your name:');
        if (userName) {
            axios.post(`http://localhost:1000/api/challenges/${index}/join`, { userName })
                .then(response => {
                    const updatedChallenges = challenges.map((challenge, i) =>
                        i === index ? response.data : challenge
                    );
                    setChallenges(updatedChallenges);
                })
                .catch(error => console.error('Error joining challenge:', error));
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
                {challenges.map((challenge, index) => (
                    <li key={index} className="challenge-item">
                        <div className="challenge-text">
                            <span>{challenge.text}</span>
                            <button onClick={() => joinChallenge(index)} className="join-button">Join Challenge</button>
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
