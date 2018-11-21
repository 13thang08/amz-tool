// MARK: import libraries
const { Observable, Subject, ReplaySubject, from, of, range } = require('rxjs');
const { map, filter, switchMap } = require('rxjs/operators');

const axios = require('axios');

const Crawler = require('crawler')

const requestData = uri => {
  const crawler = new Crawler()
  return Observable.create(observer => {
    crawler.queue({
      uri: uri,
      callback: function(error, res, done) {
        if(error){
          observer.error(error);
        }else{
          observer.next(res.$);
          observer.complete();
        }
        done();
      }
    })
  })
}

/*
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
*/

requestData('https://www.amazon.com')
  .subscribe({next: $ => {
    console.log($('a').length);
  }})