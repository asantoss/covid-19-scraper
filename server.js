const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/countries', (req, res) => {
	db.country.findAll({ raw: true }).then(models => {
		if (models) {
			res.json(models);
		}
	});
});

app.get('/api/states', (req, res) => {
	db.state.findAll({ raw: true }).then(models => {
		if (models) {
			res.json(models);
		}
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + 3000);
});
