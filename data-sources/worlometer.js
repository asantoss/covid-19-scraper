const Puppeteer = require('puppeteer');
require('dotenv').config();

/**
 *
 * @param {string} url url of the site to navigate
 * @param {string} table_name Id of the html element
 */
async function scraper(url, table_name) {
	// console.time();
	const browser = await Puppeteer.launch({
		headless: true,
		// executablePath: '/usr/bin/chromium-browser',
	});
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
	await page.goto(url);
	await page.waitForSelector(table_name, {
		timeout: 0,
	});
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
					if (j === 1) {
						header = 'total_cases';
					}
					if (header === 'deaths') {
						header = 'total_deaths';
					}
					if (header === 'tot_cases_1m_pop') {
						header = 'total_cases_1m_pop';
					}
					if (header === 'Source' || header === 'region') {
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
					Object.keys(countryData).length &&
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
		// console.timeEnd();
		return data;
	} catch (error) {
		console.error(error);
	}
}

module.exports = scraper;
