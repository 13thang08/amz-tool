// MARK: import libraries
const { Observable, Subject, ReplaySubject, from, of, range } = require('rxjs');
const { map, filter, switchMap } = require('rxjs/operators');
const Symbol = require('es6-symbol');

const axios = require('axios');

const Crawler = require('crawler');
const jsdom = require('jsdom');
const {JSDOM} = jsdom
const cheerio = require('cheerio');
const jquery = require('jquery');

const converter = require('./converter');
const utils = require('./utils');
const q = require('./const');

const requestData = uri => {
  const crawler = new Crawler({
    jQuery: jsdom
  });
  return Observable.create(observer => {
    crawler.queue({
      uri: uri,
      callback: function(error, res, done) {
        if(error){
          observer.error(error);
        }else{
          // const $ = cheerio.load(res.body);

          // $.prototype.find = function (e)
          // {
          //   var t, n, r = this.length,
          //     i = this;
          //   if ("string" != typeof e) return this.pushStack(b(e).filter(function ()
          //   {
          //     for (t = 0; t < r; t++)
          //       if (b.contains(i[t], this)) return !0
          //   }));
          //   for (n = this.pushStack([]), t = 0; t < r; t++) b.find(e, i[t], n);
          //   return 1 < r ? b.uniqueSort(n) : n
          // }   
          observer.next(res.body);
          // observer.next(cheerio.load(res.body));
          observer.complete();
        }
        done();
      }
    })
  })
}

function getDimension(e)
{
  return getDetailsValue(e, q.DETAILS.DIMENSION)
}

function getDetailsValue(t, e)
{
  return t && e ? Array.isArray(e) ? e.map(function (e)
  {
    return t[e.toLowerCase()]
  }).reduce(function (e, t)
  {
    return e || t
  }) : t[e.toLowerCase()] : null
}

function toLbs(e, t)
{
  return converter.toPounds(e, t)
}

function getListingQualityCriteria(e, t, n, r, i, o)
{
  var a = {};
  a.nameLength = t ? t.length : 0, a.brandLength = n ? n.length : 0;
  var s = e.find("#feature-bullets li:not(#replacementPartsFitmentBullet)");
  a.bulletsCount = s.length, a.rating = i || 0, a.reviews = o || 0, a.seller = r;
  var u = getDescription(e) || function getScriptedDescription(e)
  {
    var r, i, t;
    if (e.find("script").each(function (e, t)
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
  var c = e.find("#altImages li:not(.template)");
  return a.imagesCount = c.length, a
}

function getDescription(e)
{
  var t, n = e.find("#productDescription");
  if (n.length)
  {
    var r = n.find(".content");
    t = (r.length ? r : n).text().replace(/\s+/g, " ").trim()
  }
  return t
}

function getParentAsin(e, t)
{
  return function findFirstString(e, t)
  {
    var n = null,
      r = !0,
      i = !1,
      o = void 0;
    try
    {
      for (var a, s = t[Symbol.iterator](); !(r = (a = s.next()).done); r = !0)
      {
        var u = a.value,
          c = u.indexOf("|"),
          l = null;
        0 < c && (l = u.substring(c + 1), u = u.substring(0, c));
        var f = e.find(u);
        if (f && f.length && l)
        {
          var d = l.split(":");
          switch (d[0])
          {
          case "val":
            n = f.val();
            break;
          case "attr":
            n = f.attr(d[1]);
            break;
          case "text":
            n = f.text();
            break;
          case "html":
            n = f.html();
            break;
          default:
            console.log("Unknown filter used: " + l)
          }
        }
        if (n)
        {
          n = n.trim();
          break
        }
      }
    }
    catch (e)
    {
      i = !0, o = e
    }
    finally
    {
      try
      {
        !r && s.return && s.return()
      }
      finally
      {
        if (i) throw o
      }
    }
    return n
  }(e, r) || getDetailsValue(t, "ASIN")
}

function parseRank(e)
{
  return (q.parseRank || function defaultParser(e)
  {
    var t = new RegExp("([\\d,.]+).?(?:" + q.DETAILS.IN + ".)?(.+)"),
      n = e.match(t, "i");
    if (!n || n.length < 3) return null;
    var r = n[1],
      i = n[2].split(">").map(function (e)
      {
        return e.trim()
      }).reduce(function (e, t)
      {
        return e + "|" + t
      });
    return i && r ?
    {
      rank: (o = r, o ? q.toNumber(o) : Number.NaN),
      category: i
    } : null;
    var o
  })(e)
}

function getRankInCategories(e, t)
{
  var n = [];
  try
  {
    var r = function getBestSellerDetails(e)
      {
        return e && getDetailsValue(e, q.BEST_SELLERS) || ""
      }(t),
      i = q.DETAILS.BSR ? r.match(q.DETAILS.BSR) : r.split(q.DETAILS.NO),
      o = i.map(function (e)
      {
        return e.trim()
      }).filter(function (e)
      {
        return e && e.length
      });
    n = n.concat(o.map(parseRank).filter(function (e)
    {
      return null != e
    }))
  }
  catch (e)
  {}
  return n = utils.unique(n, "category")
}

function findFirst(e, t, n)
{
  var r, i = !0,
    o = !1,
    a = void 0;
  try
  {
    for (var s, u = t[Symbol.iterator](); !(i = (s = u.next()).done); i = !0)
    {
      var c = s.value;
      if ((r = e.find(c)) && r.length && (!n || n.test(r.text()))) break
    }
  }
  catch (e)
  {
    o = !0, a = e
  }
  finally
  {
    try
    {
      !i && u.return && u.return()
    }
    finally
    {
      if (o) throw a
    }
  }
  extendJQuery(r);
  return r
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

var G = ["#productDescription img", "#aplus3p_feature_div", "#aplus"],
r = ["#fitRecommendationsSection|attr:data-asin", "#twisterNonJsData input[name=ASIN]|val"],
J = ["#twisterJsInitializer_feature_div script"],
S = ["#brand", "span.author a.contributorNameID", "span.author a:first", "#bylineInfo_feature_div a:first", ".buying a:first", "#brandBylineWrapper a"],
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

function parse(e, t)
{
  var n = utils.getAmazonHost(e),
    r = t,
    i = utils.getASIN(e),
    o = function getTitle(e)
    {
      return trimString(findFirst(e, Y).text())
    }(r);
  if (!o) return Promise.reject(e);
  var a = function getBrand(e)
    {
      var t = findFirst(e, $),
        n = (t.is("a") ? t : t.find("a")).attr("href"),
        r = trimString(t.text()) || utils.safe(function ()
        {
          return decodeURIComponent(n.match(/^\/([^/]+)\//)[1])
        });
      return r ?
      {
        name: r,
        url: n
      } : null
    }(r),
    s = a && a.name,
    u = a && a.url,
    c = function getReviews(e)
    {
      return getNumber(e, Z, /[\d.,]+/, 0, function (e)
      {
        return utils.toNumber(e)
      }) || 0
    }(r),
    l = function getRating(e)
    {
      var t = e.find("#acrPopover").attr("title");
      return t ? utils.toNumber(t.match(/\d[.,]\d/)[0]) : null
    }(r),
    f = function getSeller(e)
    {
      var t, n = e.find("#merchant-info, #pantry-availability-brief").text(),
        r = q.SELLER.AMZ.test(n),
        i = q.SELLER.FBA.test(n);
      t = r ? "AMZ" : i ? "FBA" : "MCH";
      return t
    }(r),
    d = function getProperties(e)
    {
      return e.find("script[type=a-state]").toArray().map(function (e)
      {
        return JSON.parse(e.innerHTML)
      }).reduce(function (e, t)
      {
        return U.default.extend(e, t)
      },
      {})
    }(r),
    p = V.detailParserInstance.parse(r),
    h = utils.safe(function ()
    {
      return d.allOfferListingIDs[0]
    }),
    g = getParentAsin(r, p);
  i == g && (g = null);
  var m, v, y = function getChildProducts(e)
    {
      var t = findFirst(e, J).html(),
        n = void 0;
      if (t)
      {
        var r = t.indexOf("asinToDimensionIndexMap");
        if (0 < r)
        {
          var i = t.indexOf("{", r),
            o = t.indexOf("}", r + 1),
            a = t.substring(i, o + 1);
          n = Object.getOwnPropertyNames(JSON.parse(a))
        }
      }
      return n
    }(r),
    b = function getDateFirstAvailable(e)
    {
      var t = getDetailsValue(e, q.DETAILS.DATE_FIRST_AVAILABLE),
        n = t && q.parseDate(t);
      return n && n < Date.now() ? n : null
    }(p),
    w = getRankInCategories(r, p);
  w.length && (m = w[0].rank, v = w[0].category.split("|").pop()), v || (v = function getCategory(e)
  {
    var t = findFirst(e, re).text().trim();
    return t.length < 3 ? null : t
  }(r));
  var k = function getSellersCount(e)
    {
      var t = findFirst(e, te).text().match(/\d+/);
      return Number(t && t.length ? t.reduce(function (e, t)
      {
        return e + t
      }) : 1)
    }(r),
    S = function getPrice(e, t)
    {
      return getMoney(e, Q) || utils.safe(function ()
      {
        return t.itemDetails[t.allOfferListingIDs[0]].price
      }) || utils.safe(function ()
      {
        return extractMoney(t.buyboxPrice)
      })
    }(r, d),
    x = function getMinPrice(e)
    {
      return getMoney(e, ee)
    }(r),
    _ = function getDomainEnum(e)
    {
      return e.match(/amazon\.([\w.]+)/)[1].replace(".", "_").toUpperCase()
    }(n);
  S = S || x;
  var A = function getProductImage(e)
    {
      var t = findFirst(e, ne),
        n = t.attr("src") || t.attr("_src") || t.attr("__src");
      return n ? n.trim() : n
    }(r),
    E = function getProductImageUrl(e)
    {
      var t, n = findFirst(e, ne),
        r = n.attr("data-old-hires");
      if (!r && (r = n.attr("data-a-dynamic-image")))
      {
        var i = r.match(/https?:\/\/[\w\-.]+\/images\/I\/[\w\d\-,._%]+\.jpg/);
        i && (r = i[0])
      }
      r && (t = r.replace(/_\w+\d+_/, "_SL160_"));
      return t
    }(r);
  A && A.length < 200 && E && (A = E.replace("_SL160_", "_SL300_"));
  var T = function getPreviewImages(e)
    {
      return e.find("#altImages li:not(.template) img").toArray().map(function (e)
      {
        var t = (0, U.default)(e);
        return t.attr("src") || t.attr("_src") || t.attr("__src")
      }).filter(function (e)
      {
        return -1 !== e.indexOf("/I")
      }).map(function (e)
      {
        return e.replace(/_.*_/, "_SL300_")
      })
    }(r),
    C = function getProductFeatureBullets(e)
    {
      var t = e.find("#feature-bullets li:not(#replacementPartsFitmentBullet)");
      return t ? t.toArray().map(function (e)
      {
        return e.innerText.trim()
      }) : []
    }(r),
    P = getListingQualityCriteria(r, o, s, f, l, c),
    D = function getListingQualityScore(e)
    {
      var t = 0;
      t += e.nameLength < 200 ? 10 : e.nameLength / 20, t += e.brandLength <= 100 ? 10 : e.brandLength / 10, t += 5 <= e.bulletsCount ? 15 : 0, t += 4 <= e.rating ? 20 * e.rating - 80 : 0, t += Math.min(e.reviews, 15), "FBA" == e.seller && (t += 10);
      return t += 1e3 <= e.descrLength ? 10 : e.descrLength / 100, t += 5 < e.imagesCount ? 10 : 10 * e.imagesCount / 5, Math.floor(t)
    }(P),
    I = function getSize(e)
    {
      if (!e) return null;
      var t = getDimension(e);
      if (!t) return null;
      var n = t.match(new RegExp("([\\d.,]+) x ([\\d.,]+)(?: x ([\\d.,]+))? ([a-zÀ-ÿĀ-ɏ　-ヿ一-鿿]+)", "i"));
      if (!n || n.length < 5) return null;
      var r = null;
      try
      {
        var i = q.toNumber(n[1]),
          o = q.toNumber(n[2]),
          a = q.toNumber(n[3]),
          s = converter.parseSizeUnit(n[4]);
        r = {
          width: i,
          height: o,
          depth: a,
          unit: s
        }
      }
      catch (e)
      {}
      return r
    }(p),
    N = function getItemWeight(e)
    {
      if (!e) return null;
      var t, n, r, i = getDetailsValue(e, q.DETAILS.ITEM_WEIGHT);
      i && (r = i.match(new RegExp("^([\\d.,]+) ([a-zÀ-ÿĀ-ɏ　-ヿ一-鿿]+)$", "i"))) && (t = q.toNumber(r[1]), n = converter.parseWeightUnit(r[2]));
      if (!t || !n)
      {
        if (!(i = getDimension(e))) return null;
        if (!(r = i.match(new RegExp("([\\d.,]+ x [\\d.,]+(?: x [\\d.,]+) \\w+)[^\\d]+([\\d,.]+) ([a-zÀ-ÿĀ-ɏ　-ヿ一-鿿]+)", "i")))) return null;
        t = q.toNumber(r[2]), n = converter.parseWeightUnit(r[3])
      }
      return t && n ? toLbs(t, n) : t
    }(p),
    O = function getShippingWeight(e)
    {
      if (!e) return null;
      var t = getDetailsValue(e, q.DETAILS.SHIPPING_WEIGHT);
      if (!t) return null;
      var n = t.match(new RegExp("^([\\d.,]+) ([a-zÀ-ÿĀ-ɏ　-ヿ一-鿿]+)$", "i"));
      if (!n) return null;
      var r = q.toNumber(n[1]),
        i = converter.parseWeightUnit(n[2]);
      return r && i ? toLbs(r, i) : r
    }(p),
    L = function getColors(e)
    {
      return findFirst(e, X).length || 1
    }(r),
    j = function getSizes(e)
    {
      return findFirst(e, K).length || 1
    }(r),
    M = y ? y.length : L * j,
    z = function getBestSellerInfo(e)
    {
      var t = findFirst(e, ie),
        n = t.get(0) ? t.find(".cat-link").text() : "",
        r = t.find(".badge-link").attr("href") || "";
      return {
        category: n.trim(),
        link: r.trim()
      }
    }(r),
    R = !!z.category,
    F = z.category,
    B = z.link,
    H = function isEBC(e)
    {
      return !!findFirst(e, G).length
    }(r);
  return y && (y = y.slice(0, 50)), console.log("Product " + i + " has been parsed"), Promise.resolve(
  {
    asin: i,
    parentAsin: g,
    childProducts: y,
    listingId: h,
    name: o,
    category: v,
    brand: s,
    brandUrl: u,
    image: E,
    imageData: A,
    price: S,
    minPrice: x,
    sellersCount: k,
    rank: m,
    ranks: w,
    rating: l,
    reviewsCount: c,
    weight: N,
    shippingWeight: O,
    size: I,
    dateFirstAvailable: b,
    seller: f,
    lqs: D,
    listingQuality: P,
    domain: _,
    colors: L,
    sizes: j,
    variants: M,
    validated: null,
    isBS: R,
    bsCategory: F,
    bsLink: B,
    ebc: H,
    featureBullets: C,
    previewImages: T
  })
}

function extendJQuery(jquery) {
  jquery.fn.extend(
    {
      find: function (e)
      {
        var t, n, r = this.length,
          i = this;
        if ("string" != typeof e) return this.pushStack(b(e).filter(function ()
        {
          for (t = 0; t < r; t++)
            if (b.contains(i[t], this)) return !0
        }));
        for (n = this.pushStack([]), t = 0; t < r; t++) b.find(e, i[t], n);
        return 1 < r ? b.uniqueSort(n) : n
      },
      filter: function (e)
      {
        return this.pushStack(winnow(this, e || [], !1))
      },
      not: function (e)
      {
        return this.pushStack(winnow(this, e || [], !0))
      },
      is: function (e)
      {
        return !!winnow(this, "string" == typeof e && _.test(e) ? b(e) : e || [], !1).length
      },
      thang: function() {
        return "TEST";
      }
    });
  jquery.fn.extend(
    {
      detach: function (e)
      {
        return remove(this, e, !0)
      },
      remove: function (e)
      {
        return remove(this, e)
      },
      text: function (e)
      {
        return L(this, function (e)
        {
          return void 0 === e ? b.text(this) : this.empty().each(function ()
          {
            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
          })
        }, null, e, arguments.length)
      },
      append: function ()
      {
        return domManip(this, arguments, function (e)
        {
          1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || manipulationTarget(this, e).appendChild(e)
        })
      },
      prepend: function ()
      {
        return domManip(this, arguments, function (e)
        {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType)
          {
            var t = manipulationTarget(this, e);
            t.insertBefore(e, t.firstChild)
          }
        })
      },
      before: function ()
      {
        return domManip(this, arguments, function (e)
        {
          this.parentNode && this.parentNode.insertBefore(e, this)
        })
      },
      after: function ()
      {
        return domManip(this, arguments, function (e)
        {
          this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
        })
      },
      empty: function ()
      {
        for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (b.cleanData(getAll(e, !1)), e.textContent = "");
        return this
      },
      clone: function (e, t)
      {
        return e = null != e && e, t = null == t ? e : t, this.map(function ()
        {
          return b.clone(this, e, t)
        })
      },
      html: function (e)
      {
        return L(this, function (e)
        {
          var t = this[0] ||
            {},
            n = 0,
            r = this.length;
          if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
          if ("string" == typeof e && !ie.test(e) && !X[(J.exec(e) || ["", ""])[1].toLowerCase()])
          {
            e = b.htmlPrefilter(e);
            try
            {
              for (; n < r; n++) 1 === (t = this[n] ||
              {}).nodeType && (b.cleanData(getAll(t, !1)), t.innerHTML = e);
              t = 0
            }
            catch (e)
            {}
          }
          t && this.empty().append(e)
        }, null, e, arguments.length)
      },
      replaceWith: function ()
      {
        var n = [];
        return domManip(this, arguments, function (e)
        {
          var t = this.parentNode;
          b.inArray(this, n) < 0 && (b.cleanData(getAll(this)), t && t.replaceChild(e, this))
        }, n)
      }
    });
}

// extendJQuery();

requestData('https://www.amazon.com/Christopher-Knight-Home-Aalto-Computer/dp/B01GVKBE84/ref=sr_1_fkmr0_3')
  .subscribe({next: html => {
    const dom = new JSDOM(html);
    const $ = jquery(dom.window);
    extendJQuery($);
    /*
    extendJQuery($);
    $.fn.extend(
      {
        find: function (e)
        {
          var t, n, r = this.length,
            i = this;
          if ("string" != typeof e) return this.pushStack(b(e).filter(function ()
          {
            for (t = 0; t < r; t++)
              if (b.contains(i[t], this)) return !0
          }));
          for (n = this.pushStack([]), t = 0; t < r; t++) b.find(e, i[t], n);
          return 1 < r ? b.uniqueSort(n) : n
        },
        filter: function (e)
        {
          return this.pushStack(winnow(this, e || [], !1))
        },
        not: function (e)
        {
          return this.pushStack(winnow(this, e || [], !0))
        },
        is: function (e)
        {
          return !!winnow(this, "string" == typeof e && _.test(e) ? b(e) : e || [], !1).length
        }
      });
    $.fn.extend(
      {
        detach: function (e)
        {
          return remove(this, e, !0)
        },
        remove: function (e)
        {
          return remove(this, e)
        },
        text: function (e)
        {
          return L(this, function (e)
          {
            return void 0 === e ? $.text(this) : this.empty().each(function ()
            {
              1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
            })
          }, null, e, arguments.length)
        },
        append: function ()
        {
          return domManip(this, arguments, function (e)
          {
            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || manipulationTarget(this, e).appendChild(e)
          })
        },
        prepend: function ()
        {
          return domManip(this, arguments, function (e)
          {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType)
            {
              var t = manipulationTarget(this, e);
              t.insertBefore(e, t.firstChild)
            }
          })
        },
        before: function ()
        {
          return domManip(this, arguments, function (e)
          {
            this.parentNode && this.parentNode.insertBefore(e, this)
          })
        },
        after: function ()
        {
          return domManip(this, arguments, function (e)
          {
            this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
          })
        },
        empty: function ()
        {
          for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (b.cleanData(getAll(e, !1)), e.textContent = "");
          return this
        },
        clone: function (e, t)
        {
          return e = null != e && e, t = null == t ? e : t, this.map(function ()
          {
            return b.clone(this, e, t)
          })
        },
        html: function (e)
        {
          return L(this, function (e)
          {
            var t = this[0] ||
              {},
              n = 0,
              r = this.length;
            if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
            if ("string" == typeof e && !ie.test(e) && !X[(J.exec(e) || ["", ""])[1].toLowerCase()])
            {
              e = b.htmlPrefilter(e);
              try
              {
                for (; n < r; n++) 1 === (t = this[n] ||
                {}).nodeType && (b.cleanData(getAll(t, !1)), t.innerHTML = e);
                t = 0
              }
              catch (e)
              {}
            }
            t && this.empty().append(e)
          }, null, e, arguments.length)
        },
        replaceWith: function ()
        {
          var n = [];
          return domManip(this, arguments, function (e)
          {
            var t = this.parentNode;
            b.inArray(this, n) < 0 && (b.cleanData(getAll(this)), t && t.replaceChild(e, this))
          }, n)
        }
      });
      */
    var t = parse("https://www.amazon.com/Christopher-Knight-Home-Aalto-Computer/dp/B01GVKBE84/ref=sr_1_fkmr0_3", $);
    console.log(t);
  }})
