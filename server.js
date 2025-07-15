// server.js
// dito ang server logic

const express = require('express'); // express
const { checkReader } = require('./checkReader'); // check if reader is connected
const { writeNFC } = require('./nfc_write'); // nfc wrtie function
const { readNFC }  = require('./nfc_read'); // nfc read function
const bodyParser = require('body-parser'); // for json
const path = require('path'); // path module for node
const app = express(); // instantiate express
const port = 3000;

app.use(bodyParser.json()); // ready json parser

// make express js api end point at /write-nfc
app.post('/write-nfc', async (req, res) => {  
  try {
    const payload = req.body; // read payload

    // check if valid payload
    if (!payload || typeof payload !== 'object') {
      return res.status(400).send('Invalid or missing JSON payload');
    }

    // execute write to nfc function
    await writeNFC(payload);
    res.status(200).send('NFC card written successfully');
  } catch (err) { // catch error
    console.error(err);
    res.status(500).send('Failed to write NFC card');
  }
});
;

// same with /write-nfc api endpoint
app.get('/read-nfc', async (req, res) => {
  try {
    const data = await readNFC();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to read NFC card');
  }
});

// to check if reader is connected (for debugging)
app.get('/check-reader', (req, res) => {
  const isConnected = checkReader();
  res.json({ connected: isConnected });
});

// main page for nfc
app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// assign port to listen
app.listen(port, () => {
  console.log(`NFC server running at http://localhost:${port}`);
});
