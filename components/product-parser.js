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

function getProductScore(e)
{
  if (e && e.marginImpact && e.rpr && e.lqs && e.reviewsCount)
  {
    return Math.round((function marginScore(e)
    {
      return r.utils.minmax(0, 20, .8 * (e - 50))
    }(e.marginImpact) + function rprScore(e)
    {
      return r.utils.minmax(0, 20, .2 * (e - 50))
    }(e.rpr) + function lqsScore(e)
    {
      return r.utils.minmax(0, 10, 10 + -.25 * (e - 50))
    }(e.lqs) + function reviewsScore(e)
    {
      return r.utils.minmax(0, 20, 20 + -.1 * (e - 100))
    }(e.reviewsCount)) / 7)
  }
}

module.exports = function(url) {
  return requestData(url).pipe(
    map(response => {
      return { url: url, response };
    }),
    flatMap(obj => parseData(obj.url, obj.response)),
    flatMap(x => {
      let n = x.n;
      let r = n(6);
      let N = x.productDetail;
      return getSalesHistory(n, N.asin, N.domain, N.ranks)
        .pipe(
          map(e => {
            N.bsr30 = e.bsr30, N.price30 = e.price30 ? e.price30 / 100 : void 0, N.estSales = e.value, N.estRevenue = r.utils.safe(function ()
            {
              return e.value * N.price
            }), N.rpr = N.estRevenue && N.reviewsCount ? N.estRevenue / N.reviewsCount : null, N.rankHistory = e.rankHistory, N.salesHistory = e.salesHistory, N.priceHistory = e.priceHistory, N.score = getProductScore(N)
            return {
              n,
              productDetail: N
            }
          })
        )
    }),
    flatMap(x => {
      let n = x.n;
      let productDetail = x.productDetail;
      return getProductDimensions(n, productDetail.asin, productDetail.domain)
        .pipe(
          map(productDimensions => {
            return {
              n,
              productDetail: Object.assign(productDetail, productDimensions)
            }
          })
        )
    }),
    map(x => x.productDetail)
  );
};
