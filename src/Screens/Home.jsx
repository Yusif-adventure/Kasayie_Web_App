

import { useState, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => {
  const [muted, setMuted] = useState(true);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const toggleMic = async () => {
    if (muted) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.wav');

          try {
            const res = await fetch('https://kasayie-asr.onrender.com/transcribe', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            setTranscript(data.transcript || '[No transcript returned]');
          } catch (err) {
            console.error('API error:', err);
            setTranscript('Failed to transcribe');
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();

        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);
      } catch (err) {
        console.error('Mic access denied or error:', err);
        setTranscript('[Mic access denied]');
      }
    } else {
      mediaRecorderRef.current?.stop();
    }

    setMuted((prev) => !prev);
  };

  return (
    <div style={{
      background: 'linear-gradient(to right,rgba(171, 149, 227, 0.83),rgba(104, 237, 159, 0.7))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      justifyContent: 'center',
      padding: 20,
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.9)',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#3d5afe',
        fontWeight: 'bold',
        textAlign: 'center',
        border: 'solid 2px #3d5afe',
        borderRadius: '20px',
        padding: '20px',
        background: 'white',
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)'
      }}>
        Welcome to Kasayie 👋🙂
      </h1>

      <hr />

      <div style={{ padding: 20, background: 'white', borderRadius: 10, width: '100%', maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{
            fontSize: '1.5rem',
            background: '#ffffff',
            padding: '10px',
            color: '#388e3c',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            Transcibe 
          </h3>
          <h4 style={{
            padding: 4,
            background: 'rgba(247, 241, 241, 0.5)',
            borderRadius: 20,
            color: '#3d5afe',
            minWidth: 100,
            textAlign: 'center'
          }}>
            Ready
          </h4>
        </div>

        <textarea
          placeholder="Your words will be transcribed here"
          value={transcript}
          readOnly
          style={{
            height: 200,
            width: '100%',
            padding: 15,
            fontSize: '1rem',
            marginTop: 10,
            marginBottom: 20,
            borderRadius: '10px',
            border: 'solid 1px #ccc',
            resize: 'none',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.9)',
          }}
        />
      </div>

      <div
        onClick={toggleMic}
        style={{
          fontSize: '4rem',
          cursor: 'pointer',
          color: muted ? '#dc3545' : '#0d6efd',
          transition: 'color 0.3s ease',
          border: 'solid 2px',
          borderRadius: '50%',
          padding: '25px',
          marginTop: 20,
          backgroundColor: 'white',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <i className={`fas ${muted ? 'fa-microphone-slash' : 'fa-microphone'}`} />
      </div>

      {/* Sound bars for visual feedback */}
      <div style={{ height: '60px', display: 'flex', gap: '5px', marginTop: 40 }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`bar ${!muted ? 'listening' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>

      <div className="text-center text-gray-500 text-sm" style={{ marginTop: 10 }}>
        <p style={{fontWeight:'bold'}}>© 2025 Kasayie - Voice Transcription App</p>
      </div>

  <style>{`
  .bar {
    width: 6px;
    height: 10px;
    background: #0f0;
    border-radius: 4px;
    transform-origin: bottom;
  }

  .listening {
    animation: bounce 1s infinite ease-in-out;
  }

  @keyframes bounce {
    0%, 100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(4);
    }
  }
`}</style> 




    </div>
  );
};

export default Home;
