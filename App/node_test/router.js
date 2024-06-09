const express = require('express');
const router = express.Router();
const multer = require('multer'); 

const ChatMessage = require('../models/ChatMessage');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './audio'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '.mp3'); 
  }
});
const upload = multer({ storage: storage });


router.post('/submit-audio', upload.single('audio'), async (req, res) => {
  const { userEmail } = req.body;
  const audioFilePath = req.file.path;

  try {
    const newChatMessage = new ChatMessage({
      userEmail,
      messageType: 'audio',
      message: audioFilePath 
    });
    await newChatMessage.save();
    res.status(200).send('Audio message uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading audio message');
  }
});


router.post('/submit-text', async (req, res) => {
  const { userEmail, message } = req.body;

  try {
    const newChatMessage = new ChatMessage({
      userEmail,
      messageType: 'text',
      message
    });
    await newChatMessage.save();
    res.status(200).send('Text message uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading text message');
  }
});

module.exports = router;
