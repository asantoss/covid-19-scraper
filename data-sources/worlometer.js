const Puppeteer = require('puppeteer');
require('dotenv').config();
const cron = require('node-cron');
const date = require('../utils/date_func');
const axios = require('axios');

async function scraper(url, table_name, name) {
	console.time();
	const browser = await Puppeteer.launch({
		headless: true,
		executablePath: '/usr/bin/chromium-browser',
		timeout: 60000
	});
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
	await page.goto(url);
	await page.waitForSelector('#' + table_name);
	try {
		const data = await page.evaluate(() => {
			const cleanHeader = new RegExp(/[\W]/g);
			const rows = document.querySelectorAll('tr');
			const countryList = [];
			for (let i = 0; i !== rows.length; i++) {
				let countryData = {};
				const cols = rows[i].querySelectorAll('td');
				// const name = cols[0].innerText.trim();
				const headers = rows[0].querySelectorAll('th');
				for (let j = 0; j < cols.length; j++) {
					let header = headers[j].innerText
						.trim()
						.replace(/[/,]/g, '')
						.replace(cleanHeader, '_')
						.toLowerCase();
					const data = cols[j].innerText.trim().replace(/[,+]/g, '') || 0;
					const dataInt = Number(data);
					if (j === 0) {
						header = 'name';
					}
					if (header === 'tot_cases_1m_pop') {
						header = 'total_cases_1m_pop';
					}
					if (header === 'Source') {
						continue;
					}
					if (header === 'reported_1st_case') {
						header = 'first_case';
					}
					if (dataInt) {
						countryData[header] = dataInt;
					} else {
						countryData[header] = data;
					}
				}
				if (
					Object.keys(countryData) &&
					countryData.name !== 'Total:' &&
					countryData.name !== 'World'
				) {
					countryList.push({ ...countryData });
				}
			}
			return countryList;
		});
		browser.close();
		// const absolutePath = path.join(__dirname, '../data/', name);
		// fs.writeFile(absolutePath, JSON.stringify(data)).catch(console.log);
		console.timeEnd();
		return data;
	} catch (error) {
		console.error(error);
	}
}

// console.log(process.env.NODE_ENV);
async function runScrape() {
	const countries = await scraper(
		'https://www.worldometers.info/coronavirus/',
		'main_table_countries_today',
		'Todays_Country_data.json'
	);
	const states = await scraper(
		'https://www.worldometers.info/coronavirus/country/us/',
		'usa_table_countries_today',
		'Today_Data.json'
	);
	const response = await axios({
		method: 'POST',
		url: 'https://worldometer-puppet.herokuapp.com/api/update',
		headers: {
			access_token: process.env.ACCESS_TOKEN
		},
		data: {
			states,
			countries
		}
	});
	return response;
}

cron.schedule('25 * * * *', function() {
	runScrape().then(console.log);
});

module.exports = runScrape;
