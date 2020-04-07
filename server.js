const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');
require('dotenv').config();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
// const io = require('socket.io')(server);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/countries', (req, res) => {
	db.country_live
		.findAll({ raw: true, attributes: { exclude: ['id', 'createdAt'] } })
		.then((models) => {
			if (models) {
				res.json(models);
			}
		});
});

app.get('/api/states', (req, res) => {
	db.state_live
		.findAll({ raw: true, attributes: { exclude: ['id', 'createdAt'] } })
		.then((models) => {
			if (models) {
				res.json(models);
			}
		});
});

app.post('/api/update_live', (req, res) => {
	const CLIENT_ACCESS_TOKEN = req.headers.access_token;
	const SERVER_ACCESS_TOKEN = process.env.ACCESS_TOKEN;
	if (CLIENT_ACCESS_TOKEN === SERVER_ACCESS_TOKEN) {
		const { states, countries } = req.body;
		saveScrapeLiveToDb(states, countries)
			.then((response) => {
				res.json({
					message: response,
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
app.post('/api/update_daily/:model', (req, res) => {
	const CLIENT_ACCESS_TOKEN = req.headers.access_token;
	const SERVER_ACCESS_TOKEN = process.env.ACCESS_TOKEN;
	if (CLIENT_ACCESS_TOKEN === SERVER_ACCESS_TOKEN) {
		const { data } = req.body;
		saveScrapeDailyToDb(data, req.params.model).then((response) => {
			res.json({ message: response });
		});
	}
});

server.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + 3000);
});

async function saveScrapeLiveToDb(states, countries) {
	const cleanDB = await Promise.all([
		db.country_live.findAll(),
		db.state.findAll(),
	]);
	if (cleanDB[0].length && cleanDB[1].length) {
		await Promise.all([
			...cleanDB.map((array) => [...array.map((model) => model.destroy())]),
		]);
	}
	await Promise.all([
		db.state_live.bulkCreate([...states.filter((state) => state['name'])], {
			returning: true,
		}),
		db.country_live.bulkCreate(
			[...countries.filter((country) => country['name'])],
			{
				returning: true,
			}
		),
	]);

	return 'Sucessfully scraped worldometers';
}

async function saveScrapeDailyToDb(data, model) {
	await db[model].bulkCreate([...data]);

	return 'Sucessfully scraped worldometers';
}
