// console.log(process.env.NODE_ENV);
const JSONtoCSV = require('../../utils/JSONtoCSV');
const scraper = require('../worlometer');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const fetch = require('isomorphic-fetch');
// io.on('connect', (socket) => {
// 	console.log('Connected');
// });
// io.connect()
async function runArchiveScrape(url, date) {
	const countries = await scraper(
		'https://www.worldometers.info/coronavirus/',
		'main_table_countries_today'
	);
}

function dateLoop(year, month, day, site) {
	let maxDay = getMonthTotal(year, month);
	const today = new Date();
	if (month === today.getMonth() && maxDay > today.getDate()) {
		maxDay = today.getDate();
	}
	let Urls = [];

	for (let i = day; i <= maxDay; i++) {
		if (month === 1 && i === 9) {
			continue;
		}
		const date = new Date(year, month, i);
		const dateStamp = date.toDateString();

		const url = `https://web.archive.org/web/${createArchiveStamp(
			today.getFullYear(),
			month + 1,
			i
		)}/${site}`;

		if (month === 12 && i === maxDay) {
			month = 0;
		}
		Urls.push({ url, dateStamp });
		if (i === maxDay && month !== today.getMonth()) {
			return [...Urls, ...dateLoop(date.getFullYear(), month + 1, 1, site)];
		}
	}
	return Urls;
}
/**
 *
 * @param {String} inputDate string representing a %%MM:DD:YY
 */

async function run_archives(inputDate) {
	const date = new Date(inputDate);
	const month = date.getMonth();
	const monthString = (date) =>
		date.toLocaleString('default', { month: 'long' }).toLowerCase();
	const day = date.getDate();
	const year = date.getFullYear();
	// const today = new Date();
	const countryUrls = dateLoop(
		year,
		month,
		day,
		'https://www.worldometers.info/coronavirus/'
	);
	const stateUrls = dateLoop(
		year,
		month,
		day,
		'https://www.worldometers.info/coronavirus/country/us/'
	);

	// console.log({ urls });
	const scrapedFiles = path.join(__dirname, '../../data');
	fs.readdir(scrapedFiles, (err, files) => {
		if (err) console.error(err);
		const filtered = files.filter((file) => path.extname(file) === '.json');
		filtered.forEach((file) => {
			fs.readFile(scrapedFiles + '/' + file, (err, data) => {
				const myData = JSON.parse(data.toString());
				myData.forEach((entry) => {
					if (entry['cases']) {
						entry.total_cases = entry['cases'];
					}
					if (entry['deaths']) {
						entry.total_deaths = entry['deaths'];
					}
				});
				fetch('http://localhost:3000/api/update_daily/country', {
					method: 'POST',
					headers: {
						access_token: process.env.ACCESS_TOKEN,
						'content-type': 'application/json',
					},
					body: JSON.stringify({ countries: myData }),
				}).then((res) => {
					if (res.status === 200) {
						console.log('Success');
					}
				});
			});
		});
	});
}

run_archives('01/29/2020');

function getMonthTotal(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

function createArchiveStamp(year, month, day) {
	return `${year}0${month}0${day}`;
}

// dateLoop(0, 29);

// console.log(__dirname);

// console.log(createDate(2020, 0, 29));
