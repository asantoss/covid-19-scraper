const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bodyParser = require('body-parser');
const saveScrapeToDb = require('./data-sources/worlometer');
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/countries', (req, res) => {
	db.country
		.findAll({ raw: true, attributes: { exclude: ['id', 'createdAt'] } })
		.then(models => {
			if (models) {
				res.json(models);
			}
		});
});

app.get('/api/states', (req, res) => {
	db.state
		.findAll({ raw: true, attributes: { exclude: ['id', 'createdAt'] } })
		.then(models => {
			if (models) {
				res.json(models);
			}
		});
});

app.post('/api/update', (req, res) => {
	console.log(req.body);
	const CLIENT_ACCESS_TOKEN = req.headers.access_token;
	const SERVER_ACCESS_TOKEN = process.env.ACCESS_TOKEN;
	console.log(CLIENT_ACCESS_TOKEN === SERVER_ACCESS_TOKEN);
	if (CLIENT_ACCESS_TOKEN === SERVER_ACCESS_TOKEN) {
		// saveScrapeToDb()
		const { states, countries } = req.body;
		saveScrapeToDb([states, countries]);
	}
	// db.state.bulkCreate([...states.filter(state => state['name'])], {
	// 	returning: true
	// })
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + 3000);
});
