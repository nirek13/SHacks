import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardJournal() {
    const [entry, setEntry] = useState('');
    const [entries, setEntries] = useState([]);

    

    const handleEntryChange = (e) => {
        setEntry(e.target.value);
    };

    const handleEntrySubmit = async (e) => {
        e.preventDefault();
        if (entry.trim()) {
            try {
                const username = localStorage.getItem("username");

                const response = await axios.post('http://localhost:1000/api/createPost', {
                    username: username,
                    message: entry,
                });

                setEntries([response.data, ...entries]);
                setEntry('');
            } catch (error) {
                console.error('Error posting journal entry:', error);
            }
        }
    };

    return (
        <div style={styles.appContainer}>
            <div style={styles.mainContent}>
                <JournalInput
                    entry={entry}
                    onEntryChange={handleEntryChange}
                    onEntrySubmit={handleEntrySubmit}
                />
                
            </div>
        </div>
    );
}

const JournalInput = ({ entry, onEntryChange, onEntrySubmit }) => (
    <div style={styles.entryInputContainer}>
        <form onSubmit={onEntrySubmit}>
            <textarea
                value={entry}
                onChange={onEntryChange}
                placeholder="What's on your mind?"
                style={styles.textarea}
            />
            <button type="submit" style={styles.button}>Post Reflection</button>
        </form>
    </div>
);

const JournalList = ({ entries }) => (
    <div style={styles.entryListContainer}>
        {entries.map((entry, index) => (
            <JournalEntry key={index} entry={entry} />
        ))}
    </div>
);

const JournalEntry = ({ entry }) => (
    <div style={styles.entryContainer}>
        <p><strong>{entry.username}</strong>: {entry.message}</p>
    </div>
);

const styles = {
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '30vh',
        backgroundColor: '#f5f5f5',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
    },
    mainContent: {
        flex: 1,
        width: '100%',
        maxWidth: '600px',
        padding: '20px',
        boxSizing: 'border-box',
    },
    entryInputContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        border: '1px solid #e0e0e0',
    },
    textarea: {
        width: '100%',
        border: '1px solid #e0e0e0',
        outline: 'none',
        padding: '12px',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        resize: 'none',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    button: {
        marginTop: '10px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '100px',
        backgroundColor: '#000000',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
    },
    entryListContainer: {
        width: '100%',
    },
    entryContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '15px',
        border: '1px solid #e0e0e0',
    },
};
