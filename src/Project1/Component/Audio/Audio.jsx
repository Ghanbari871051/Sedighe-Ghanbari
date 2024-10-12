import React, { useState } from 'react';

function Audio() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className='audio-component'>
      <audio
        src={'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'}
        controls // Show default audio controls (play, pause, volume, etc.)
        onPlay={() => setIsPlaying(true)} // Update state when audio starts playing
        onPause={() => setIsPlaying(false)} // Update state when audio is paused
      />
    </div>
  );
}

export default Audio;
