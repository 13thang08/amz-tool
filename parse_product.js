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

var G = ["#productDescription img", "#aplus3p_feature_div", "#aplus"],
r = ["#fitRecommendationsSection|attr:data-asin", "#twisterNonJsData input[name=ASIN]|val"],
J = ["#twisterJsInitializer_feature_div script"],
// $ = ["#brand", "span.author a.contributorNameID", "span.author a:first", "#bylineInfo_feature_div a:first", ".buying a:first", "#brandBylineWrapper a"],
X = ["#variation_color_name ul li", "#variation_color_name .a-dropdown-container select option"],
K = ["#variation_size_name option.dropdownAvailable"],
Z = ["#acrCustomerReviewText", "#revF a.a-link-emphasis"],
Y = ["#productTitle", "#btAsinTitle", "#aiv-content-title", "#title_feature_div", "#ebooksProductTitle"],
Q = ["#priceblock_ourprice", "#priceblock_saleprice", "#tmmSwatches .a-color-price", "#mediaTabs_tabSet .mediaTab_subtitle", "span.a-color-price.a-text-bold:last", "#actualPriceValue", "#priceblock_ourprice", "#priceblock_dealprice", "#priceblock_saleprice", "#priceBlock .priceLarge", "#buyNewSection .a-color-price.offer-price", "#olp_feature_div .a-color-price", "#price-quantity-container .a-color-price", ".kindle-price .a-color-price:first", "#tmmSwatches .swatchElement .a-size-base:first"],
ee = ["#mbc .a-size-small .a-color-price", "#unqualified .a-color-price", "#olp_feature_div .a-color-price", "#olp_feature_div .a-spacing-top-small a"],
te = ["#olp_feature_div a", "#mbc .a-size-small a"],
ne = ["#main-image", "#landingImage", ".dp-img-bracket img", "#imgBlkFront", "#ebooks-img-canvas img", "#fine-art-imgTagWrapperId img"],
re = ["#wayfinding-breadcrumbs_feature_div li:first", "#nav-subnav a.nav-b"],
l = "\nvar ProductDescriptionIframeResize = {};",
f = 'var iframeContent = "',
ie = ["#zeitgeistBadge_feature_div .badge-wrapper"]

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

function getMoney(e, t)
{
    return getNumber(e, t, q.MONEY)
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

function trimString(e)
{
    return "string" != typeof e ? e : e.replace(/\s+/g, " ").trim()
}

function getProperties(e)
{
    return e("script[type=a-state]").toArray().map(function (e)
    {
        return JSON.parse(e.innerHTML)
    })
}

function getPrice(e)
{
    // TODO: need fix price
    let Q = ["#priceblock_ourprice", "#priceblock_saleprice", "#tmmSwatches .a-color-price", "#mediaTabs_tabSet .mediaTab_subtitle", "span.a-color-price.a-text-bold:last", "#actualPriceValue", "#priceblock_ourprice", "#priceblock_dealprice", "#priceblock_saleprice", "#priceBlock .priceLarge", "#buyNewSection .a-color-price.offer-price", "#olp_feature_div .a-color-price", "#price-quantity-container .a-color-price", ".kindle-price .a-color-price:first", "#tmmSwatches .swatchElement .a-size-base:first"];
    let price = getMoney(e, Q)
    return price
}

function getDescription(e)
{
    var t, n = e("#productDescription");
    if (n.length)
    {
        var r = n.find(".content");
        t = (r.length ? r : n).text().replace(/\s+/g, " ").trim()
    }
    return t
}

function getListingQualityCriteria(e, t, n, r, i, o)
{
    var a = {};
    a.nameLength = t ? t.length : 0, a.brandLength = n ? n.length : 0;
    var s = e("#feature-bullets li:not(#replacementPartsFitmentBullet)");
    a.bulletsCount = s.length, a.rating = i || 0, a.reviews = o || 0, a.seller = r;
    var u = getDescription(e) || function getScriptedDescription(e)
    {
        var r, i, t;
        if (e("script").each(function (e, t)
            {
                var n = t.innerHTML;
                return n.startsWith(l) && (i = n.indexOf(f), r = n), null == i
            }), r)
        {
            i += f.length;
            var n = r.indexOf('"', i),
                o = r.substring(i, n),
                a = (0, U.default)(decodeURIComponent(o));
            t = getDescription(a)
        }
        return t
    }(e);
    a.descrLength = u ? u.length : 0;
    var c = e("#altImages li:not(.template)");
    return a.imagesCount = c.length, a
}

function getListingQualityScore(e)
{
    var t = 0;
    t += e.nameLength < 200 ? 10 : e.nameLength / 20, t += e.brandLength <= 100 ? 10 : e.brandLength / 10, t += 5 <= e.bulletsCount ? 15 : 0, t += 4 <= e.rating ? 20 * e.rating - 80 : 0, t += Math.min(e.reviews, 15), "FBA" == e.seller && (t += 10);
    return t += 1e3 <= e.descrLength ? 10 : e.descrLength / 100, t += 5 < e.imagesCount ? 10 : 10 * e.imagesCount / 5, Math.floor(t)
}

function parseInternal(e, t, n, i)
{
    var o = this,
        r = e.find(t);
    if (r.length)
    {
        var a, s = {};
        return r.find(n).each(function (e, t)
        {
            var n = (0, u.default)(t);
            c.clean(n);
            var r = n.find(i).first();
            r.length ? (a = r.text().trim().replace(":", ""), r.remove(), s[a] = o.value(n)) : a && (s[a] += o.value(n))
        }), s
    }
}

function parseV1(e) {
    // return parseInternal(e, "#detail-bullets", ".content>ul>li", "b")
    return parseInternal(e, "#detailBullets", "#detailBullets_feature_div>ul>li, #dpx-amazon-sales-rank_feature_div>li, #SalesRank", "b:first, span.a-text-bold")
}

function ParserV2() {
    this.value = function value(e)
    {
        return e && e.length ? this.normalize(e.get(0).innerText) : null
    }

    this.normalize = function normalize(e)
    {
        return e ? e.trim().replace(/\([^)]+\)/gi, "").replace(/[\s\u00A0]+/g, " ") : e
    }

    this.parse = function parse(e)
    {
        var r = this,
            t = e("#productDetails_detailBullets_sections1 tr, #productDetails_techSpec_section_1 tr");
        if (t.length)
        {
            var i, o, a = {};
            return t.each(function (e, t)
            {
                var n = (0, u.default)(t);
                c.clean(n), i = r.value(n.find("th")), o = r.value(n.find("td")), a[i] = o
            }), a
        }
    }
}

const asin = W.utils.getASIN(url);

const nameIds = ["#productTitle", "#btAsinTitle", "#aiv-content-title", "#title_feature_div", "#ebooksProductTitle"];
const name = findFirst($, nameIds).text().trim();
const brand = getBrand($);

const reviewsCount = getReviews($);

const rating = getRating($);

const seller = getSeller($);

const sellerCount = getSellersCount($);

const price = getPrice($);

const listingQualityCriteria = getListingQualityCriteria($, name, brand, seller, rating, reviewsCount);
const lqs = getListingQualityScore(listingQualityCriteria);

const result = {
    asin,
    name,
    brand,
    reviewsCount,
    rating,
    seller,
    sellerCount,
    price,
    lqs
}

// console.log(result);
let parserV2 = new ParserV2();
let tmp = parserV2.parse($)
console.log(tmp);