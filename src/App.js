import React from 'react';
import MeditationSession from './Components/Meditation';
import './App.css';

function App() {
  return (
      <div className="App">
        <MeditationSession
            title="Guided Meditation for Relaxation"
            audioSrc="path/to/your/audio/file.mp3"
            duration={300} // duration in seconds
        />
      </div>
  );
}

export default App;