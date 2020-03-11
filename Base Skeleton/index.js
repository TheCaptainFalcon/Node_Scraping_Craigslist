const request = require('request-promise');

// To handle network problems <use below and not above>
// full response by default is true - making it false will make it return html strings only
// const request = require('requestretry').defaults({fullResponse: false});

const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

const url = "https://atlanta.craigslist.org/search/jjj?query=software+developer"

const scrapeSample = {
    title: 'Job Title',
    description: 'Job requirements',
    datePosted: new Date('2018-07-13'),
    url: 'https://atlanta.craigslist.org/atl/sof/d/atlanta-filemaker-developer-and/7088781345.html',
    hood: 'Atlanta, GA',
    address: "idk",
    compensation: 'DOE, x/hr'
}

const scrapeResults = [];

async function scrapeJobHeader() {
    try {
        const htmlResult = await request.get(url);
        const $ = await cheerio.load(htmlResult);

        // Look at parent class in inspector
        $('.result-info').each((index, element) => {
            // Job Title
            const resultTitle = $(element).children('.result-title');
            const title = resultTitle.text();
            // Job URL
            const url = resultTitle.attr('href');
            // Date Posted
            const datePosted = $(element).children('time').attr('datetime');
            // Neighborhood Info
            const hood = $(element).find('.result-hood').text();
            // All the info is converted from to an object => array
            const scrapeResult = { title, url, datePosted, hood };
            scrapeResults.push(scrapeResult);
        });
    return scrapeResults;
    } catch (err) {
    console.error(err);
    }
}

async function scrapeDescription(jobsWithHeaders) {
    //waits until all promises have been fulfilled
   return await Promise.all(jobsWithHeaders.map(async job => {
       try {
        const htmlResult = await request.get(job.url);
        const $ = await cheerio.load(htmlResult);
        //removal of QR code text in body
        $('.print-qrcode-container').remove();
        // Job Description Field
        job.description = $('#postingbody').text();
        // Job Address Field
        job.address = $('div.mapaddress').text();
        // Job Compensation with text formatting
        const compensationText = $('.attrgroup').children().first().text();
        job.compensation = compensationText.replace('compensation: ','');
        return job;
        } catch (error) {
       console.error(error);
     }
    })
);
}

// NPM documentation to convert obj to CSV
async function createCsvFile(data) {
    let csv = new ObjectsToCsv(data);
    // Save .csv file to local drive
    await csv.toDisk('./test.csv');
}

async function scrapeCraigslist() {
    const jobsWithHeaders = await scrapeJobHeader();
    const jobsFullData = await scrapeDescription(jobsWithHeaders);
    await createCsvFile(jobsFullData);
    // How many jobs (total) listed
    console.log(jobsFullData.length + ' total jobs');
}

scrapeCraigslist();