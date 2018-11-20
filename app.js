// MARK: import libraries
const { Observable, Subject, ReplaySubject, from, of, range } = require('rxjs');
const { map, filter, switchMap } = require('rxjs/operators');

const axios = require('axios');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const jquery = require('jquery')

const getHtml = url => {
  return from(axios.get(url))
    .pipe(
      // map(response => response.data.explanation)
      map(response => response.data)
    )
}

getHtml('https://www.amazon.com')
  .subscribe({next: html => {
    const dom = new JSDOM(html);
    const $ = jquery(dom.window);
    const a = $('div');
    console.log(a);
    console.log(html)
  }})