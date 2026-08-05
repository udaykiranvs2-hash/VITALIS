import React, { useState, useEffect, useRef } from 'react';
import { Droplet, X, BellOff, CheckCircle } from 'lucide-react';
import './WaterAlarm.css';

const WaterAlarm = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [previousTimeLeft, setPreviousTimeLeft] = useState(null);
  const [isRinging, setIsRinging] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize AudioContext on first user interaction to bypass autoplay restrictions
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playLoudAlarm = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Play a sequence of attentive beeps
    let time = ctx.currentTime;
    for (let i = 0; i < 10; i++) { // Play 10 iterations of double beeps
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, time); // High pitch
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(1, time + 0.05); // Loud
      gainNode.gain.setValueAtTime(1, time + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, time + 0.25);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.25);
      
      time += 0.5; // Gap between beeps
    }
    
    // Store a reference to maybe stop earlier, though it's queued.
    // A better approach for continuous ring is looping, but this is simple.
  };

  const playContinuousAlarm = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Create an oscillator that just keeps going (or we use an interval to beep)
    const interval = setInterval(() => {
        playLoudAlarm();
    }, 5500); // Repeat every 5.5s
    
    playLoudAlarm(); // Play immediately
    return interval;
  };

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isRinging) {
      triggerAlarm();
    }
    
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isRinging]);

  const triggerAlarm = () => {
    setIsRinging(true);
    setIsActive(true);
    const alarmInterval = playContinuousAlarm();
    oscillatorRef.current = alarmInterval;
  };

  const stopAlarm = () => {
    setIsRinging(false);
    
    if (previousTimeLeft !== null) {
      setTimeLeft(previousTimeLeft);
      setPreviousTimeLeft(null);
    } else {
      setTimeLeft(60 * 60); // Reset for next hour
    }

    if (oscillatorRef.current) {
      clearInterval(oscillatorRef.current);
      oscillatorRef.current = null;
    }
    
    // Completely close the audio context to instantly kill all queued sounds
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
      });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleTestAlarm = () => {
    setPreviousTimeLeft(timeLeft);
    setTimeLeft(2);
  };

  return (
    <div className={`water-alarm-container ${isRinging ? 'ringing' : ''}`}>
      {!isActive && !isRinging && (
        <button 
          className="water-alarm-mini-btn" 
          onClick={() => setIsActive(true)}
          title="Water Reminder"
        >
          <Droplet size={24} />
        </button>
      )}

      {isActive && (
        <div className="water-alarm-panel">
          <div className="water-alarm-header">
            <div className="water-alarm-title">
              <Droplet size={20} className="drop-icon" />
              <span>Hydration Tracker</span>
            </div>
            <button className="water-alarm-close" onClick={() => setIsActive(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="water-alarm-body">
            {isRinging ? (
              <div className="water-alarm-alert">
                <div className="pulse-ring"></div>
                <Droplet size={48} className="alert-icon" />
                <h3>Time to Drink Water!</h3>
                <p>Stay hydrated to maintain your health and focus.</p>
                
                <div className="water-alarm-actions">
                  <button className="btn-stop-alarm" onClick={stopAlarm}>
                    <BellOff size={18} /> Stop Alarm
                  </button>
                  <button className="btn-drank-water" onClick={stopAlarm}>
                    <CheckCircle size={18} /> I Drank Water
                  </button>
                </div>
              </div>
            ) : (
              <div className="water-alarm-status">
                <div className="water-level-indicator">
                  <div className="water-level" style={{ height: `${(timeLeft / 3600) * 100}%` }}></div>
                </div>
                <div className="water-timer-info">
                  <p>Next reminder in:</p>
                  <h2>{formatTime(timeLeft)}</h2>
                  <button className="btn-test-alarm" onClick={handleTestAlarm}>
                    Test Alarm (2s)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterAlarm;
