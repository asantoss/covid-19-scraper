const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const dateFunc = require('./utils/date_func');
const scraper = require('./data-sources/worlometer');

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/countries', (req, res) => {});

app.get('/api/by-us-states', (req, res) => {
	const dataFolder = path.join(__dirname, '/data');
	const name = `worlometer_${dateFunc()}_data_us_states.json`;
	fs.readdir(dataFolder)
		.then(files => {
			console.log(files);
			const file = files.find(e => e === name);
			if (file) {
				return fs.readFile(dataFolder + '/' + file);
			} else {
				const newData = scraper(
					'https://www.worldometers.info/coronavirus/country/us/',
					'usa_table_countries_today',
					name
				);
				return newData;
			}
		})
		.then(data => {
			console.log(data);
			if (Buffer.isBuffer(data)) {
				const stringData = data.toString();
				return res.json(JSON.parse(stringData));
			} else {
				res.json(data);
			}
		})
		.catch(error => {
			return;
		});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + 3000);
});
