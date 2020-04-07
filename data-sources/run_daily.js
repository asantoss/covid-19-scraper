// console.log(process.env.NODE_ENV);
async function runScrape() {
	const countries = await scraper(
		'https://www.worldometers.info/coronavirus/',
		'#main_table_countries_today'
	);
	const states = await scraper(
		'https://www.worldometers.info/coronavirus/country/us/',
		'#usa_table_countries_today'
	);
	const today = new Date();
	states.forEach((element) => {
		element.entry_date = today.toDateString();
	});
	countries.forEach((element) => {
		element.entry_date = today.toDateString();
	});

	axios({
		method: 'POST',
		url: 'https://worldometer-puppet.herokuapp.com/api/update_daily/countries',
		headers: {
			access_token: process.env.ACCESS_TOKEN,
		},
		data: {
			data: countries,
		},
	});
	axios({
		method: 'POST',
		url: 'https://worldometer-puppet.herokuapp.com/api/update_daily/states',
		headers: {
			access_token: process.env.ACCESS_TOKEN,
		},
		data: {
			data: states,
		},
	});
}

runScrape();
