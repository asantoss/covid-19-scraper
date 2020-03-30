const select = document.getElementById('filterData');
const lastUpdate = document.getElementById('lastUpdate');
const JSONarea = document.getElementById('JSONarea');
const CSVarea = document.getElementById('CSVarea');
const JSONareaBtn = document.getElementById('JSONarea-btn');
const CSVareaBtn = document.getElementById('CSVarea-btn');
select.addEventListener('change', function() {
	console.log(this.value);
	fetch(`/api/${this.value}`)
		.then(res => res.json())
		.then(data => {
			const date = new Date(Date.parse(data[0]['updatedAt']));
			JSONarea.value = JSON.stringify(data, null, 2);
			CSVarea.value = JSONtoCSV(data);
			createBlobDownload(data, JSONareaBtn, 'json');
			createBlobDownload(JSONtoCSV(data), CSVareaBtn, 'csv');
			JSONareaBtn.querySelector('button').disabled = false;
			CSVareaBtn.querySelector('button').disabled = false;
			lastUpdate.innerText = date.toLocaleString('en-US');
		});
});

function JSONtoCSV(data) {
	var json = Object.values(data);
	var csv = '';
	var keys = (json[0] && Object.keys(json[0])) || [];
	csv += keys.join(',') + '\n';
	for (var line of json) {
		csv += keys.map(key => line[key]).join(',') + '\n';
	}
	return csv;
}

function createBlobDownload(data, button, type) {
	var json = type === 'json' ? JSON.stringify(data) : data;
	var blob = new Blob([json], {
		type: type === 'json' ? 'application/json' : 'text/csv'
	});
	var url = URL.createObjectURL(blob);
	button.download =
		type === 'json'
			? `worldometer_${select.value}_${dateFormat()}_data.json`
			: `worldometer_${select.value}_${dateFormat()}_data.csv`;
	button.href = url;
	return;
}

function dateFormat() {
	const date = new Date();
	return `${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}`;
}
