const express = require('express');
const app = express();

app.get('/api/by-state', (req, res) => {
	res.json('Finish everything.');
});

app.listen(3000, () => {
	console.log('Listening on port ' + 3000);
});
