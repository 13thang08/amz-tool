module.exports = new function ()
{
  var a, i = this;
  this.debounce = function (r, i, o)
  {
    var a;
    return function ()
    {
      var e = this,
        t = arguments,
        n = o && !a;
      clearTimeout(a), a = setTimeout(function later()
      {
        a = null, o || r.apply(e, t)
      }, i), n && r.apply(e, t)
    }
  }, this.throttle = function (n, r, i)
  {
    var o, a, s, u, c = 0;
    i || (i = {});
    var l = function later()
      {
        c = !1 === i.leading ? 0 : (new Date).getTime(), o = null, u = n.apply(a, s), o || (a = s = null)
      },
      e = function throttled()
      {
        var e = (new Date).getTime();
        c || !1 !== i.leading || (c = e);
        var t = r - (e - c);
        return a = this, s = arguments, t <= 0 || r < t ? (o && (clearTimeout(o), o = null), c = e, u = n.apply(a, s), o || (a = s = null)) : o || !1 === i.trailing || (o = setTimeout(l, t)), u
      };
    return e.cancel = function ()
    {
      clearTimeout(o), c = 0, o = a = s = null
    }, e
  }, this.serialize = function (e)
  {
    if (e)
    {
      if ("string" == typeof e) return encodeURIComponent(e);
      if ("object" != (void 0 === e ? "undefined" : r(e))) throw "Unsupported object type";
      var t = "";
      for (var n in e) e.hasOwnProperty(n) && null != e[n] && (t && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
      return t
    }
    return ""
  }, this.isNotEmptyArray = function (e)
  {
    return Array.isArray(e) && !!e.length
  }, this.map = function (e, t)
  {
    if (!e || !e.length) return {};
    var n = {};
    return e.forEach(function (e)
    {
      return n["string" == typeof t ? e[t] : t(e)] = e
    }), n
  }, this.formatDate = function (e)
  {
    var t = e ? new Date(e) : new Date,
      n = t.getDate();
    return t.getMonth() + 1 + "/" + n + "/" + t.getFullYear()
  }, this.deleteParams = function (e)
  {
    var t = e.indexOf("?");
    return 0 < t && (e = e.substring(0, t)), e
  }, this.left = function (e, t)
  {
    if (!e || !t) return e;
    var n = e.indexOf(t);
    return 0 <= n ? e.substring(0, n) : e
  }, this.containsOne = function (e)
  {
    for (var t = arguments.length, n = Array(1 < t ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
    if (!e || !n || 0 == n.length) return !1;
    var i = !0,
      o = !1,
      a = void 0;
    try
    {
      for (var s, u = n[Symbol.iterator](); !(i = (s = u.next()).done); i = !0)
      {
        var c = s.value;
        if (0 <= e.indexOf(c)) return !0
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
    return !1
  }, this.containsAll = function (e)
  {
    for (var t = arguments.length, n = Array(1 < t ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
    if (!e || !n || 0 == n.length) return !1;
    var i = !0,
      o = !1,
      a = void 0;
    try
    {
      for (var s, u = n[Symbol.iterator](); !(i = (s = u.next()).done); i = !0)
      {
        var c = s.value;
        if (e.indexOf(c) < 0) return !1
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
    return !0
  }, this.getParameter = function (e, t)
  {
    var n = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(t);
    return n ? n[1] : null
  }, this.hasParam = function (e, t)
  {
    for (var n in t)
      if (this.getParameter(t[n], e)) return !0;
    return !1
  }, this.array = function (e)
  {
    for (var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : function (e)
      {
        return e
      }, n = [], r = 0; r < e; ++r) n.push(t(r));
    return n
  }, this.objectToArray = function (t, n)
  {
    return t && n ? Object.getOwnPropertyNames(t).map(function (e)
    {
      return n(e, t[e])
    }) : []
  }, this.objectToString = function (e, t, n)
  {
    return i.objectToArray(e, t).join(n)
  }, this.arrayToObject = function (e, r, i)
  {
    if (!r || !e || !e.length) return {};
    i || (i = function valueMapper(e)
    {
      return e
    });
    var o = {};
    return e.forEach(function (e)
    {
      var t = r(e),
        n = i(e);
      o[t] = n
    }), o
  }, this.repeat = function (n, r, i)
  {
    var o = !(3 < arguments.length && void 0 !== arguments[3]) || arguments[3],
      a = this;
    return i <= 0 ? Promise.reject() : new Promise(function (e, t)
    {
      function schedule()
      {
        setTimeout(function ()
        {
          return a.repeat(n, r, i - 1).then(e, t)
        }, r)
      }
      if (o) try
      {
        n().then(e, schedule)
      }
      catch (e)
      {
        t(e)
      }
      else schedule()
    })
  }, this.md5 = function (e)
  {
    return o(e)
  }, this.updateParameter = function (e, t, n)
  {
    var r = new RegExp("([?&])" + t + "=.*?(&|$)", "i"),
      i = -1 !== e.indexOf("?") ? "&" : "?";
    return e.match(r) ? e.replace(r, "$1" + t + "=" + n + "$2") : e + i + t + "=" + n
  }, this.escapeHTML = function (e)
  {
    return e ? e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ""
  }, this.safe = function (e, t)
  {
    var n;
    try
    {
      n = e()
    }
    catch (e)
    {
      n = t
    }
    return n
  }, this.number = function (e)
  {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
    return isNaN(e) ? t : Number(e)
  }, this.toNumber = function (e)
  {
    if (!e) return Number.NaN;
    for (var t, n, r = 0; r < e.length; ++r)
    {
      var i = e[e.length - r - 1];
      if (isNaN(parseInt(i)))
      {
        if (3 <= r)
        {
          n = i;
          break
        }
        t = i
      }
    }
    return n && (e = e.replace(new RegExp("\\" + n, "g"), "")), t && (e = e.replace(t, ".")), Number(e)
  }, this.last = function (e)
  {
    return e && e.length ? e[e.length - 1] : null
  }, this.unique = function (e, t)
  {
    if (!e || !e.length || !t) return e;
    for (var n = new Map, r = 0; r < e.length; ++r)
    {
      var i = e[r];
      if (i)
      {
        var o = t ? i[t] : i;
        n.has(o) || n.set(o, i)
      }
    }
    return Array.from(n.values())
  }, this.parseUrlParams = function (e)
  {
    if (!e) return null;
    var n = {},
      t = e.indexOf("?");
    return (0 <= t ? e.substring(t + 1) : e).split("&").forEach(function (e)
    {
      var t = e.split("=");
      n[t[0]] = decodeURIComponent(t[1])
    }), n
  }, this.sum = function (t)
  {
    return t ? "number" == typeof t ? t : Object.getOwnPropertyNames(t).map(function (e)
    {
      return t[e]
    }).filter(function (e)
    {
      return !isNaN(e)
    }).map(function (e)
    {
      return Number(e)
    }).reduce(function (e, t)
    {
      return e + t
    }, null) : null
  }, this.clone = function clone(e)
  {
    if (null == e || "object" != (void 0 === e ? "undefined" : r(e))) return e;
    var t = e.constructor();
    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
    return t
  }, this.minmax = function (e, t, n)
  {
    return this.min(this.max(e, n), t)
  }, this.min = function ()
  {
    var e = arguments;
    return this.safe(function ()
    {
      return Array.prototype.slice.call(e).filter(function (e)
      {
        return null != e
      }).reduce(function (e, t)
      {
        return e < t ? e : t
      })
    })
  }, this.max = function ()
  {
    var e = arguments;
    return this.safe(function ()
    {
      return Array.prototype.slice.call(e).filter(function (e)
      {
        return null != e
      }).reduce(function (e, t)
      {
        return t < e ? e : t
      })
    })
  }, this.toCamelCase = function (e)
  {
    for (var t = 0, n = "", r = 0; r < e.length; ++r)
    {
      var i = e[r];
      switch (t)
      {
      case 0:
        this.isLatinLetter(i) || this.isDigit(i) ? n += i : t = 1;
        break;
      case 1:
        (this.isLatinLetter(i) || this.isDigit(i)) && (n += i.toUpperCase(), t = 0)
      }
    }
    return n
  }, this.rand = function (e, t)
  {
    return Math.round(Math.random() * (t - e) + e)
  }, this.randomElement = function (e)
  {
    return e && 0 < e.length ? e[i.rand(0, e.length - 1)] : null
  }, this.randomElements = function (e, t)
  {
    var n = null == e ? 0 : e.length;
    if (!n || t < 1) return [];
    t = n < t ? n : t;
    for (var r = -1, i = e.slice(); ++r < t;)
    {
      var o = r + Math.floor(Math.random() * (n - r)),
        a = i[o];
      i[o] = i[r], i[r] = a
    }
    return i.slice(0, t)
  }, this.replace = function (t, n)
  {
    return Object.getOwnPropertyNames(n).forEach(function (e)
    {
      return t = t.replace(e, n[e])
    }), t
  }, this.cookies = function (e, t)
  {
    var n = (e || "").split(";").map(function (e)
    {
      return e.trim()
    });
    return i.arrayToObject(t ? n.filter(t) : n, function (e)
    {
      return e.substring(0, e.indexOf("="))
    }, function (e)
    {
      return e.substring(e.indexOf("=") + 1)
    })
  }, this.cookie = function (e)
  {
    return i.cookies(document.cookie)[e]
  }, this.setCookie = function (e, t, n)
  {
    var r = (n = n ||
    {}).expires;
    if ("number" == typeof r && r)
    {
      var i = new Date;
      i.setTime(i.getTime() + 1e3 * r), r = n.expires = i
    }
    r && r.toUTCString && (n.expires = r.toUTCString()), console.log(n.expires);
    var o = e + "=" + (t = encodeURIComponent(t));
    for (var a in n)
    {
      o += "; " + a;
      var s = n[a];
      !0 !== s && (o += "=" + s)
    }
    document.cookie = o
  }, this.randomCode = function (e)
  {
    var t = this,
      n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return this.array(e).map(function (e)
    {
      return n[t.rand(0, n.length - 1)]
    }).join("")
  }, this.uuid = (a = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), function (e, t)
  {
    var n, r = a,
      i = [];
    if (t = t || r.length, e)
      for (var o = 0; o < e; o++) i[o] = r[0 | Math.random() * t];
    else
      for (i[8] = i[13] = i[18] = i[23] = "-", i[14] = "4", o = 0; o < 36; o++) i[o] || (n = 0 | 16 * Math.random(), i[o] = r[19 == o ? 3 & n | 8 : n]);
    return i.join("")
  }), this.isLatinLetter = function (e)
  {
    return "a" <= e && e <= "z" || "A" <= e && e <= "Z"
  }, this.isDigit = function (e)
  {
    return "0" <= e && e <= "9"
  }, this.filter = function (t)
  {
    var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : i.nonEmpty;
    return Array.isArray(t) ? t.filter(n) : i.arrayToObject(Object.getOwnPropertyNames(t).filter(function (e)
    {
      return n(t[e], e)
    }), function (e)
    {
      return e
    }, function (e)
    {
      return t[e]
    })
  }, this.empty = function (e)
  {
    return null == e || void 0 !== e.length && 0 === e.length || "object" === (void 0 === e ? "undefined" : r(e)) && 0 === Object.getOwnPropertyNames(e).length
  }, this.nonEmpty = function (e)
  {
    return !i.empty(e)
  }, this.money = function (e)
  {
    return isNaN(e) ? void 0 : Math.ceil(100 * e - .001) / 100
  }, this.isAmazonCategoryUrl = function (e)
  {
    return /https?:\/\/(www|smile)\.amazon\.[\w.]+\/([\w\d\-%]+\/)?b[/?]/.test(e)
  }, this.isAmazonAuthorUrl = function (e)
  {
    return i.isAmazonUrl(e) && /\/e\/((:?B[A-Z\d]{9})|(:?\d{9}[A-Z\d]))($|\/|\?)/.test(e)
  }, this.isAmazonDealsUrl = function (e)
  {
    return /https?:\/\/(www|smile)\.amazon\.[\w.]+\/sales-deals-[\w\d\-%]+($|\/|\?)/i.test(e)
  }, this.isAmazonGoldBoxUrl = function (e)
  {
    return /https?:\/\/(www|smile)\.amazon\.[\w.]+\/gp\/goldbox($|\/|\?)/i.test(e)
  }, this.isAmazonSearchUrl = function (e)
  {
    return i.isAmazonUrl(e) && (/\/s[\/?]/.test(e) || /\/search\//.test(e))
  }, this.replaceAmazonImages = function (e)
  {
    return e.replace(/src=("https:\/\/(m.)?(images|media)[\w\d\-.]+amazon.[\w.]+\/images\/[\w\d+\-%&.,_/]+")/gi, "_src=$1")
  }, this.isAmazonAbsoluteUrl = function (e)
  {
    return /https?:\/\/(www|smile)\.amazon\.[\w.]+/.test(e)
  }, this.getAmazonHost = function (e)
  {
    return e.match(/https?:\/\/(www|smile)\.amazon\.[\w.]+/)[0]
  }, this.isAmazonUrl = function (e)
  {
    return /^https?:\/\/(www|smile)\.amazon\.[\w.]{2,6}\//.test(e.trim())
  }, this.isAmazonShopURL = function (e)
  {
    return e && i.isAmazonUrl(e) && /\/l\/\d{8,16}(\/|\?|$)/.test(e)
  }, this.isMostWishedURL = function (e)
  {
    return e && i.isAmazonUrl(e) && /\/most-wished-for\/|\/most-gifted\//.test(e)
  }, this.isAmazonProductUrl = function (e)
  {
    return i.isAmazonUrl(e) && !/\/stores\/node\//.test(e) && !i.isAmazonShopURL(e) && !i.isMostWishedURL(e) && /(\/((B[A-Z\d]{9})|(\d{9}[A-Z\d]))($|\/|\?))|(\/dp\/((B[A-Z\d]{9})|(\d{9}[A-Z\d])))/.test(e)
  }, this.getASIN = function (e)
  {
    return i.safe(function ()
    {
      return e.match(/\/((:?B[A-Z\d]{9})|(:?\d{9}[A-Z\d]))($|\/|\?)/)[1]
    })
  }, this.isAmazonBestSellersUrl = function (e)
  {
    return i.isAmazonUrl(e) && /\/(best\-sellers|bestsellers)/i.test(e)
  }, this.getProductUrl = function (e)
  {
    return "https://www.amazon." + e.domain.toLowerCase().replace("_", ".") + "/dp/" + e.asin
  }, this.getOfferListingUrl = function (e)
  {
    return "https://www.amazon." + e.domain.toLowerCase().replace("_", ".") + "/gp/offer-listing/" + e.asin
  }, this.isAsin = function (e)
  {
    return /^(B[A-Z\d]{9})|(\d{9}[A-Z\d])/.test(e)
  }, this.getAmazonDomainEnum = function (e)
  {
    return e.match(/amazon\.([\w.]+)/)[1].replace(".", "_").toUpperCase()
  }, this.getAmazonHostByEnum = function (e)
  {
    return "https://www.amazon." + e.toLowerCase().replace("_", ".")
  }, this.getAmazonTLD = function (e)
  {
    return e.match(/(?:www|smile).amazon(?:\.\w+)?\.(\w+)/)[1]
  }, this.parse = function (e)
  {
    return (new DOMParser).parseFromString(e, "text/html")
  }, this.eval = function (e, t)
  {
    return new Function("(function() {" + e + "}).call(this)").call(t)
  }, this.watch = function (t, n, r)
  {
    var e = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 200;
    return setInterval(function run()
    {
      var e = t();
      r !== e && (r = e, n())
    }, e)
  }, this.level = function (n, r)
  {
    return i.safe(function ()
    {
      return n.map(function (e, t)
      {
        return r <= e || t == n.length - 1 ? t + 1 : -1
      }).filter(function (e)
      {
        return 0 < e
      })[0]
    })
  }, this.hashCode = function (e)
  {
    if (!e) return 0;
    for (var t = 0, n = 0; t < e.length; t++) n = Math.imul(31, n) + e.charCodeAt(t) | 0;
    return n
  }, this.throwDice = function (e)
  {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 2;
    if (!e) return !1;
    if ("string" == typeof e) e = i.hashCode(e);
    else if ("number" != typeof e) throw "Unsupported object type";
    return e % t == 0
  }, this.preloadImage = function (r)
  {
    return r ? new Promise(function (e, t)
    {
      var n = new Image;
      n.onload = e, n.onerror = t, n.src = r
    }) : Promise.reject()
  }, this.getUILanguage = function ()
  {
    var e = chrome.i18n.getUILanguage();
    return e && 2 <= e.length ? e.substr(0, 2) : navigator.language
  }, this.daysBetween = function (e, t)
  {
    if (!e || !t) return -1;
    var n = e < t ? t - e : e - t;
    return Math.floor(n / 864e5)
  }, this.msToTimeObject = function (e)
  {
    var t = function pad(e)
      {
        return ("0" + e).slice(-2)
      },
      n = e % 1e3,
      r = (e = (e - n) / 1e3) % 60,
      i = (e = (e - r) / 60) % 60,
      o = (e - i) / 60;
    return !(e < 0 || i < 0 || o < 0 || n < 0) &&
    {
      h1: t(o)[0],
      h2: t(o)[1],
      m1: t(i)[0],
      m2: t(i)[1],
      s1: t(r)[0],
      s2: t(r)[1]
    }
  }
}