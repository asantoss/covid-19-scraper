const Puppeteer = require('puppeteer');
const fs = require('fs');

async function scraper(table_name) {
	const browser = await Puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto('https://www.worldometers.info/coronavirus/');
	await page.waitForSelector('#' + table_name);
	const data = await page.evaluate(() => {
		const rows = document.querySelectorAll('tr');
		const countryList = [];
		for (let i = 0; i !== rows.length; i++) {
			let countryData = {};
			const cols = rows[i].querySelectorAll('td');
			for (let j = 0; j < cols.length; j++) {
				const name = cols[0].innerText.trim();
				const totalCases = cols[1].innerText.trim() || 0;
				const totalDeaths = cols[3].innerText || 0;
				if (name !== 'Total:') {
					countryData = { name, totalCases, totalDeaths };
				}
			}
			if (countryData['name']) {
				countryList.push(countryData);
			}
		}
		return countryList;
	});
	// console.log(data);
	browser.close();
	const date = new Date();
	const name = `worldometer_${date.getMonth() +
		1}_${date.getDate()}_${date.getFullYear()}.json`;
	fs.writeFileSync(name, JSON.stringify(data), function(error) {
		if (error) {
			throw error;
		}
		console.log('Saved!');
	});
}

scraper('main_table_countries_today');
