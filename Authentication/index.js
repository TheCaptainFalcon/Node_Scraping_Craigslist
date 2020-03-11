const request = require('request-promise').defaults({ jar: true});
const fs = require('fs');

async function main() {
    try {
    const html = await request.post('https://accounts.craigslist.org/login', {
    form: {
        // username 
        inputEmailHandle: 'danktrashpanda@gmail.com',
        // password
        inputPassword: 'digitalcraftscraigslist'
    },

    headers: {
        Referer: 'https://accounts.craigslist.org/login?rt=L&rp=%2Flogin%2Fhome',
        // JSON parsing identifies '-' as subtraction operator, therefore
        // placing bracket quotes in the key will fix this issue
        ['User-Agent']: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Mobile Safari/537.36'
        
    },
        simple: false,
        followAllRedirects: true,
        jar: true
    }); 
    fs.writeFileSync('./login.html', html);

// Since cookies are authenticated in jar above, we can redirect to this url
// after log in request is accepted
const billingHtml = await request.get(
    'https://accounts.craigslist.org/login/home?show_tab=billing'
);
// creates a file that gives the html code of the link above
// after login
fs.writeFileSync('./billing.html', billingHtml);
    } catch (error) {
        console.error(error);
    }
}
main();