import './App.css'; 
import RecordAudio from './RecordAudio'; 
import NewsList from './NewsList'; 



function App() { 
  const handleAudioRecorded = (audioData) => {
    console.log('Audio recorded:', audioData);
  };
  return (
    <div className='App'>  
    <h1>Web Push Notifications Example</h1>
    <NewsList />
      <RecordAudio onAudioRecorded={handleAudioRecorded} />
    </div>
  );
}

export default App;  













