const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');
require('dotenv').config();
const bodyParser = require('body-parser');

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
	const CLIENT_ACCESS_TOKEN = req.headers.access_token;
	const SERVER_ACCESS_TOKEN = process.env.ACCESS_TOKEN;
	if (CLIENT_ACCESS_TOKEN === SERVER_ACCESS_TOKEN) {
		const { states, countries } = req.body;
		saveScrapeToDb(states, countries)
			.then(response => {
				res.json({
					message: response
				});
			})
			.catch(() => {
				res.json("Couldn't save data to DB");
			});
	}
	// db.state.bulkCreate([...states.filter(state => state['name'])], {
	// 	returning: true
	// })
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + 3000);
});

async function saveScrapeToDb(states, countries) {
	const cleanDB = await Promise.all([db.country.findAll(), db.state.findAll()]);
	if (cleanDB[0].length && cleanDB[1].length) {
		await Promise.all([
			...cleanDB.map(array => [...array.map(model => model.destroy())])
		]);
	}
	await Promise.all([
		db.state.bulkCreate([...states.filter(state => state['name'])], {
			returning: true
		}),
		db.country.bulkCreate([...countries.filter(country => country['name'])], {
			returning: true
		})
	]);

	return 'Sucessfully scraped worldometers';
}
