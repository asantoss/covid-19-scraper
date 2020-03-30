const select = document.getElementById('filterData');
const lastUpdate = document.getElementById('lastUpdate');
const JSONarea = document.getElementById('JSONarea');
const CSVarea = document.getElementById('CSVarea');
select.addEventListener('change', function() {
	console.log(this.value);
	fetch(`/api/${this.value}`)
		.then(res => res.json())
		.then(data => {
			const date = new Date(Date.parse(data[0]['updatedAt']));
			JSONarea.value = JSON.stringify(data, null, 2);
			CSVarea.value = JSONtoCSV(data);
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
