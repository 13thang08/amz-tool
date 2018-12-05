module.exports = function (n, initialModule)
{
	var r = {};

	function __webpack_require__(e)
	{
		if (r[e]) return r[e].exports;
		var t = r[e] = {
			i: e,
			l: !1,
			exports:
			{}
		};
		return n[e].call(t.exports, t, t.exports, __webpack_require__), t.l = !0, t.exports
	}
	__webpack_require__.m = n, __webpack_require__.c = r, __webpack_require__.i = function (e)
	{
		return e
	}, __webpack_require__.d = function (e, t, n)
	{
		__webpack_require__.o(e, t) || Object.defineProperty(e, t,
		{
			configurable: !1,
			enumerable: !0,
			get: n
		})
	}, __webpack_require__.n = function (e)
	{
		var t = e && e.__esModule ? function getDefault()
		{
			return e.default
		} : function getModuleExports()
		{
			return e
		};
		return __webpack_require__.d(t, "a", t), t
	}, __webpack_require__.o = function (e, t)
	{
		return Object.prototype.hasOwnProperty.call(e, t)
	}, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = initialModule)
}