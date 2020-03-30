const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/countries', (req, res) => {});

app.get('/api/by-us-states', (req, res) => {});

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + 3000);
});
