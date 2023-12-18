const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


app.use(express.static(path.join(__dirname, 'build')));

app.post('/upload', upload.single('audio'), (req, res) => {
  try {
    const audioBuffer = req.file.buffer; 

    console.log('Audio data received and processed successfully');
    res.status(200).send('Audio data received and processed successfully');
  } catch (error) {
    console.error('Error processing audio data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
