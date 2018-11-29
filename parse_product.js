const cheerio = require('cheerio');
const fs = require('fs');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const jquery = require('jquery');

const W = require('./utils');
const q = require('./const');

const html = fs.readFileSync('input.html', 'utf8');

const url = "https://www.amazon.com/Organizer-Mossio-Multifunctional-Compact-Clothing/dp/B01E923T5W/ref=sr_1_24";
const dom = new JSDOM(html);
const $ = jquery(dom.window);
// const $ = cheerio.load(html);

function findFirst($, ids, regex) {
    for (let i = 0; i < ids.length; i++) {
        let elements = $(ids[i]);
        if (elements.length > 0) {
            if (regex) {
                for (let j = 0; j < elements.length; j++) {
                    let subElement = elements.eq(j);
                    let subElementText = subElement.text();
                    if (subElementText && regex.test(subElementText)) {
                        return subElement
                    }
                }
            } else {
                return elements.eq(0);
            }
        }
    }
}

function getBrand($) {
    const brandIds = ["#brand", "span.author a.contributorNameID", "span.author a:first", "#bylineInfo_feature_div a:first", ".buying a:first", "#brandBylineWrapper a"];
    let element = findFirst($, brandIds);
    let href = (element.is('a') ? element: element.find('a')).attr('href');

    let text = element.text().trim();
    return text ? text : W.utils.safe(() => {
        return decodeURIComponent(href.match(/^\/([^/]+)\//)[1]);
    });
}

function getReviews($) {
    let reviewIds = ["#acrCustomerReviewText", "#revF a.a-link-emphasis"];
    return getNumber($, reviewIds, /[\d.,]+/, 0, function (e)
    {
        return W.utils.toNumber(e)
    }) || 0
}

function getNumber(e, t)
{
    var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : /[\d,.]+/,
        r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 0,
        i = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : function (e)
        {
            return q.toNumber(e)
        },
        o = function getText(e, t, n)
        {
            return findFirst(e, t, n).text().trim()
        }(e, t, n);
    return extractMoney(o, n, r, i)
}

function extractMoney(e)
{
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : /[\d,.]+/,
        n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
        r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : function (e)
        {
            return q.toNumber(e)
        },
        i = e && e.match(t);
    return i && i.length > n ? r(i[n]) : null
}

function getRating($)
{
    var t = $("#acrPopover").attr("title");
    return t ? W.utils.toNumber(t.match(/\d[.,]\d/)[0]) : null
}

function getSeller(e)
{
    var t, n = e("#merchant-info, #pantry-availability-brief").text(),
        r = q.SELLER.AMZ.test(n),
        i = q.SELLER.FBA.test(n);
    t = r ? "AMZ" : i ? "FBA" : "MCH";
    return t
}

function getSellersCount(e)
{
    let te = ["#olp_feature_div a", "#mbc .a-size-small a"];
    var t = findFirst(e, te).text().match(/\d+/);
    return Number(t && t.length ? t.reduce(function (e, t)
    {
        return e + t
    }) : 1)
}

const asin = W.utils.getASIN(url);

const nameIds = ["#productTitle", "#btAsinTitle", "#aiv-content-title", "#title_feature_div", "#ebooksProductTitle"];
const name = findFirst($, nameIds).text().trim();
const brand = getBrand($);

const reviewsCount = getReviews($);

const rating = getRating($);

const seller = getSeller($);

const sellerCount = getSellersCount($);

const result = {
    asin,
    name,
    brand,
    reviewsCount,
    rating,
    seller,
    sellerCount
}

console.log(result);