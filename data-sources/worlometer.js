const Puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function scraper(url, table_name, name) {
	const browser = await Puppeteer.launch({
		headless: true
	});
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitForSelector('#' + table_name);
	try {
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
		browser.close();
		console.log(data);
		const absolutePath = path.join(__dirname, '../data/', name);
		await fs.writeFile(absolutePath, JSON.stringify(data)).catch(console.log);
		return data;
	} catch (error) {
		console.error(error);
	}
}

module.exports = scraper;
