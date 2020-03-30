const Puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const db = require('../models');

async function scraper(url, table_name, name) {
	console.time();
	const browser = await Puppeteer.launch({
		headless: true
	});
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitForSelector('#' + table_name);
	try {
		const data = await page.evaluate(() => {
			const cleanHeader = new RegExp(/[,/\n]/g);
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
						.replace(cleanHeader, '_')
						.toLowerCase();

					if (j === 0) {
						header = 'name';
					}
					if (header === '1st_case') {
						header = '';
					}

					const data = cols[j].innerText.trim().replace(/[,+]/g, '') || 0;
					const dataInt = Number.parseInt(data, 10);
					if (header === 'Source') {
						continue;
					}
					if (dataInt) {
						countryData[header] = dataInt;
					} else {
						countryData[header] = data;
					}
				}
				if (Object.keys(countryData)) {
					countryList.push(countryData);
				}
			}
			return countryList;
		});
		browser.close();
		const absolutePath = path.join(__dirname, '../data/', name);
		fs.writeFile(absolutePath, JSON.stringify(data)).catch(console.log);
		console.timeEnd();
		return data;
	} catch (error) {
		console.error(error);
	}
}

const dataFolder = path.join(__dirname, '/data');

scraper(
	'https://www.worldometers.info/coronavirus/',
	'main_table_countries_today',
	'Todays_Country_data.json'
).then(data => {
	data.forEach(countryData => {
		console.log(countryData);
		// db.country.create({ ...countryData });
	});
});

scraper(
	'https://www.worldometers.info/coronavirus/country/us/',
	'usa_table_countries_today',
	'Today_Data.json'
).then(data => {
	data.forEach(stateObject => {
		db.state.set;
	});
});
