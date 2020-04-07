module.exports = function (data) {
	var json = Object.values(data);
	var csv = '';
	var keys = (json[0] && Object.keys(json[0])) || [];
	csv += keys.join(',') + '\n';
	for (var line of json) {
		csv += keys.map((key) => line[key]).join(',') + '\n';
	}
	return csv;
};
