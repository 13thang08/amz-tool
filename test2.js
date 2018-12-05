
const cheerio = require('cheerio');
const fs = require('fs');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const jquery = require('jquery');

const utils = require('./utils');
const q = require('./const');

const html = fs.readFileSync('input.html', 'utf8');

const url = "https://www.amazon.com/Organizer-Mossio-Multifunctional-Compact-Clothing/dp/B01E923T5W/ref=sr_1_24";
const dom = new JSDOM(html);
const $ = jquery(dom.window);
const DetailParser = require('./test');
const parse = new DetailParser();

let result = parse($);

console.log(result);