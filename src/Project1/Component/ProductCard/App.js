import React, { useState, useEffect, useRef } from 'react';
import Timer from './components/Timer';
import Controls from './components/Controls';
import './styles.css';

const App = () => {
  const [breaklength, setBreaklength] = useState(5);
  const [sessionlength, setSessionlength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionlength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            audioRef.current.play();
            if (isSession) {
              setIsSession(false);
              return breaklength * 60;
            } else {
              setIsSession(true);
              return sessionlength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRunning, breaklength, sessionlength, isSession]);

  const reset = () => {
    setBreaklength(5);
    setSessionlength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <div className="container">
      <h1>25 + 5 Clock</h1>
      <Controls 
        breaklength={breaklength}
        sessionlength={sessionlength}
        setBreaklength={setBreaklength}
        setSessionlength={setSessionlength}
        reset={reset}
      />
      <Timer 
        timeLeft={timeLeft}
        isSession={isSession}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
      />
      <audio id="beep" ref={audioRef} src="beep.mp3" />
    </div>
  );
};

export default App;
