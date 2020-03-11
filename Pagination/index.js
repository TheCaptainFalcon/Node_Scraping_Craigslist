const request = require('request-promise');
const cheerio = require('cheerio');

async function scrape() {
    // index max based on URL params, which also have a pattern of +120
    // Limited to Craigslist (static, easy example)
    for(let index = 0; index <=240; index = index + 120) {
        const html = await request.get('https://atlanta.craigslist.org/search/atl/jjj/vol?s=' + index
    );
    const $ = await cheerio.load(html)
    // Grabs title name per each iteration of above loop
    $('.result-title').each((index, element) => {
        console.log($(element).text());
    });
    console.log('At page number ' + index);
    }
}

scrape();