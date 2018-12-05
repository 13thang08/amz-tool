module.exports = function (e, t, n)
{
    "use strict";
    Object.defineProperty(t, "__esModule",
    {
        value: !0
    }), t.detailParserInstance = void 0;
    var r = function ()
        {
            function defineProperties(e, t)
            {
                for (var n = 0; n < t.length; n++)
                {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function (e, t, n)
            {
                return t && defineProperties(e.prototype, t), n && defineProperties(e, n), e
            }
        }(),
        u = function _interopRequireDefault(e)
        {
            return e && e.__esModule ? e :
            {
                default: e
            }
        }(n(64));

    function _possibleConstructorReturn(e, t)
    {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function _inherits(e, t)
    {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype,
        {
            constructor:
            {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    function _classCallCheck(e, t)
    {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var c = function ()
        {
            function AbstractDetailParser()
            {
                _classCallCheck(this, AbstractDetailParser)
            }
            return r(AbstractDetailParser, [
            {
                key: "value",
                value: function value(e)
                {
                    return e && e.length ? AbstractDetailParser.normalize(e.get(0).innerText) : null
                }
            }], [
            {
                key: "normalize",
                value: function normalize(e)
                {
                    return e ? e.trim().replace(/\([^)]+\)/gi, "").replace(/[\s\u00A0]+/g, " ") : e
                }
            },
            {
                key: "clean",
                value: function clean(e)
                {
                    e.find("#acrPopover, script, style").remove()
                }
            }]), AbstractDetailParser
        }(),
        o = function (e)
        {
            function DetailParserV1()
            {
                return _classCallCheck(this, DetailParserV1), _possibleConstructorReturn(this, (DetailParserV1.__proto__ || Object.getPrototypeOf(DetailParserV1)).apply(this, arguments))
            }
            return _inherits(DetailParserV1, c), r(DetailParserV1, [
            {
                key: "parse",
                value: function parse(e)
                {
                    return this.parseInternal(e, "#detail-bullets", ".content>ul>li", "b")
                }
            },
            {
                key: "parseInternal",
                value: function parseInternal(e, t, n, i)
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
            }]), DetailParserV1
        }(),
        a = function (e)
        {
            function DetailParserV2()
            {
                return _classCallCheck(this, DetailParserV2), _possibleConstructorReturn(this, (DetailParserV2.__proto__ || Object.getPrototypeOf(DetailParserV2)).apply(this, arguments))
            }
            return _inherits(DetailParserV2, c), r(DetailParserV2, [
            {
                key: "parse",
                value: function parse(e)
                {
                    var r = this,
                        t = e.find("#productDetails_detailBullets_sections1 tr, #productDetails_techSpec_section_1 tr");
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
            }]), DetailParserV2
        }(),
        s = function (e)
        {
            function DetailParserV3()
            {
                return _classCallCheck(this, DetailParserV3), _possibleConstructorReturn(this, (DetailParserV3.__proto__ || Object.getPrototypeOf(DetailParserV3)).apply(this, arguments))
            }
            return _inherits(DetailParserV3, c), r(DetailParserV3, [
            {
                key: "parse",
                value: function parse(e)
                {
                    var r = this,
                        t = e.find("#prodDetails tr");
                    if (t.length)
                    {
                        var i, o, a = {};
                        return t.each(function (e, t)
                        {
                            var n = (0, u.default)(t);
                            c.clean(n), i = r.value(n.find("td.label")), o = r.value(n.find("td.value")), a[i] = o
                        }), a
                    }
                }
            }]), DetailParserV3
        }(),
        l = function (e)
        {
            function DetailParserV4()
            {
                return _classCallCheck(this, DetailParserV4), _possibleConstructorReturn(this, (DetailParserV4.__proto__ || Object.getPrototypeOf(DetailParserV4)).apply(this, arguments))
            }
            return _inherits(DetailParserV4, o), r(DetailParserV4, [
            {
                key: "parse",
                value: function parse(e)
                {
                    return this.parseInternal(e, "#detailBullets", "#detailBullets_feature_div>ul>li, #dpx-amazon-sales-rank_feature_div>li, #SalesRank", "b:first, span.a-text-bold")
                }
            }]), DetailParserV4
        }(),
        f = function (e)
        {
            function DetailParserV5()
            {
                return _classCallCheck(this, DetailParserV5), _possibleConstructorReturn(this, (DetailParserV5.__proto__ || Object.getPrototypeOf(DetailParserV5)).apply(this, arguments))
            }
            return _inherits(DetailParserV5, o), r(DetailParserV5, [
            {
                key: "parse",
                value: function parse(e)
                {
                    return this.parseInternal(e, "#detail_bullets_id", "div.content>ul>li", "b")
                }
            }]), DetailParserV5
        }(),
        d = function (e)
        {
            function DetailParserV6()
            {
                return _classCallCheck(this, DetailParserV6), _possibleConstructorReturn(this, (DetailParserV6.__proto__ || Object.getPrototypeOf(DetailParserV6)).apply(this, arguments))
            }
            return _inherits(DetailParserV6, o), r(DetailParserV6, [
            {
                key: "parse",
                value: function parse(e)
                {
                    return this.parseInternal(e, "h2:contains(Product Details)", "ul>li", "b, strong")
                }
            }]), DetailParserV6
        }();
    t.detailParserInstance = new function DetailParser()
    {
        var i = [new o, new a, new s, new l, new f, new d];
        this.parse = function (e)
        {
            for (var t = void 0, n = 0; n < i.length && !t; ++n) t = i[n].parse(e);
            var r = void 0;
            return t && (r = {}, Object.keys(t).forEach(function (e)
            {
                return r[e.toLowerCase()] = t[e]
            })), r
        }
    }
}