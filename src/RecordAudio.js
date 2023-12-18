import React, { useState, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

const RecordAudio = ({ onAudioRecorded }) => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioRecordingSupported, setAudioRecordingSupported] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState(null);

  useEffect(() => {
    async function checkAudioRecordingSupport() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioRecordingSupported(true);
      } catch (error) {
        setAudioRecordingSupported(false);
      }
    }

    checkAudioRecordingSupport();
  }, []);

  const handleData = async (audioData) => {
    setAudioBlob(audioData);

    if (onAudioRecorded) {
      onAudioRecorded(audioData);
      await saveAudioDataToServer(audioData.blob); 
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setUploadedAudio(file);
    setAudioBlob(null); 
  };

  const saveAudioDataToServer = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('http://localhost:{port}', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Audio data successfully sent to the server');
      } else {
        console.error('Failed to send audio data to the server');
      }

      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync-audio');
      }
    } catch (error) {
      console.error('Error saving audio data:', error);
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>

      {audioRecordingSupported && (
        <ReactMediaRecorder
          audio
          onData={handleData}
          render={({ status, startRecording, stopRecording }) => (
            <div>
              <p>Status: {status}</p>
              {status === 'idle' && <button onClick={startRecording}>Start Recording</button>}
              {status === 'recording' && <button onClick={stopRecording}>Stop Recording</button>}
            </div>
          )}
        />
      )}

      {!audioRecordingSupported && (
        <div>
          <h2>Upload Audio</h2>
          <input type="file" accept="audio/*" onChange={handleUpload} />
        </div>
      )}

      {(audioBlob || uploadedAudio) && (
        <div>
          <h2>Playback</h2>
          {audioBlob && (
            <audio controls>
              <source src={audioBlob.blobURL} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
          {uploadedAudio && (
            <audio controls>
              <source src={URL.createObjectURL(uploadedAudio)} type="audio/*" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordAudio;






