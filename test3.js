const Crawler = require('crawler');
const jsdom = require('jsdom');
const crawler = new Crawler({ jquery: jsdom });

crawler.queue({
    uri: 'http://test.crawler.com/pagination',
    callback: (error, response, done) => {
        let $ = response['$'];
        console.log(typeof($));
    }
});