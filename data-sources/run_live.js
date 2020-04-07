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
	const response = await axios({
		method: 'POST',
		url: 'https://worldometer-puppet.herokuapp.com/api/update_live',
		headers: {
			access_token: process.env.ACCESS_TOKEN,
		},
		data: {
			states,
			countries,
		},
	});
	return response;
}

runScrape();
