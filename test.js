const cheerio = require('cheerio');
const fs = require('fs');


const html = fs.readFileSync('./sample.html', 'utf8');

const $ = cheerio.load(html)

const a = $('body').find('#div1').find('> div')
console.log(a.length)
a.map( row => console.log(a.eq(row).attr('id')));