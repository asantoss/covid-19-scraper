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
		const absolutePath = path.join(__dirname, '../data/', name);
		fs.writeFile(absolutePath, JSON.stringify(data)).catch(console.log);
		console.timeEnd();
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function main() {
	const cleanDB = await Promise.all([db.country.findAll(), db.state.findAll()]);
	if (cleanDB[0].length && cleanDB[1].length) {
		console.log('Data found', cleanDB);
		await Promise.all([
			...cleanDB.map(array => [...array.map(model => model.destroy())])
		]);
	}
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
	await Promise.all([
		db.state.bulkCreate([...states.filter(state => state['name'])], {
			returning: true
		}),
		db.country.bulkCreate([...countries.filter(country => country['name'])], {
			returning: true
		})
	]);

	return 'Sucessfully scraped worldometers';
}
// console.log(process.env.NODE_ENV);
main().then(console.log);
