import React, { useState } from 'react';
import './VideoStyle.scss'

function Video() {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className='video-component'>
            <video
                src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                controls // Show default video controls (play, pause, volume, etc.)
                onPlay={() => setIsPlaying(true)} // Update state when video starts playing
                onPause={() => setIsPlaying(false)} // Update state when video is paused
            />
            {/* <button onClick={togglePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button> */}
        </div>
    );
}

export default Video;
