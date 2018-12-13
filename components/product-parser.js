const Crawler = require("crawler");
const { Observable, Subject, ReplaySubject, from, of, range } = require("rxjs");
const { map, filter, switchMap, flatMap } = require("rxjs/operators");

const { JSDOM } = require("jsdom");

function requestData(uri) {
  const crawler = new Crawler();

  return Observable.create(observer => {
    crawler.queue({
      uri,
      jQuery: false,
      callback: function(err, res, done) {
        if (err) {
          observer.error(err);
        } else {
          observer.next(res.body);
          observer.complete();
        }
        done();
      }
    });
  });
}

function parseData(url, response) {
  const jsdom = new JSDOM(response);
  const background = require("../chrome-extension-code/background")(
    jsdom.window
  );
  const loader = require("../utils/webpack-loader");

  return Observable.create(observer => {
    background[8888] = function(e, t, n) {
      "use strict";
      const c = n(6);
      const o = n(574);
      const l = n(562);
      var tld = c.utils.getAmazonTLD(url);
      const r = l.locales[tld];
      const parser = new o.ProductParser(r);
      parser.parse(url, response).then(productDetail => {
        observer.next({n, productDetail});
        observer.complete();
      });
    };
    loader(background, 8888);
  });
}

function getEstSales(n, asin, domain, ranks)
{
  let c = n(6);
  let promise = (0, c.ajax)("https://amzscout.net/extensions/scoutpro/v1/products/" + domain + "/" + asin + "/sales", "POST", ranks);
  return from(promise);
}

function getSalesHistory(n, asin, domain, ranks)
{
  let c = n(6);
  let promise = (0, c.ajax)("https://amzscout.net/extensions/scoutpro/v1/products/" + domain + "/" + asin + "/history", "POST", ranks);
  return from(promise);
}

function getProductDimensions(n, asin, domain)
{
  let c = n(6);
  let promise = (0, c.ajax)("https://amzscout.net/extensions/scoutpro/v1/products/" + domain + "/" + asin)
  return from(promise)
}

module.exports = function(url) {
  return requestData(url).pipe(
    map(response => {
      return { url: url, response };
    }),
    flatMap(obj => parseData(obj.url, obj.response)),
    /*
    flatMap(x => {
      let n = x.n;
      let productDetail = x.productDetail;
      return getEstSales(n, productDetail.asin, productDetail.domain, productDetail.ranks)
        .pipe(
          map(salesHistory => {
            return {
              n,
              productDetail: Object.assign(productDetail, salesHistory)
            }
          })
        )
    }),
    */
    flatMap(x => {
      let n = x.n;
      let productDetail = x.productDetail;
      return getSalesHistory(n, productDetail.asin, productDetail.domain, productDetail.ranks)
        .pipe(
          map(salesHistory => {
            return {
              n,
              productDetail: Object.assign(productDetail, salesHistory)
            }
          })
        )
    }),
    flatMap(x => {
      let n = x.n;
      let productDetail = x.productDetail;
      return getProductDimensions(n, productDetail.asin, productDetail.domain)
        .pipe(
          map(salesHistory => {
            return {
              n,
              productDetail: Object.assign(productDetail, salesHistory)
            }
          })
        )
    }),
    map(x => x.productDetail)
  );
};
