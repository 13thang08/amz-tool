// the webpack bootstrap
let a = (function (n)
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
	}, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0)
})
/************************************************************************/
([
    // index.js - our application logic
    /* 0 */
    function (module, exports, __webpack_require__) {
        var multiply = __webpack_require__(1);
        var sum = __webpack_require__(2);
        var totalMultiply = multiply(5, 3);
        var totalSum = sum(5, 3);
        console.log('Product of 5 and 3 = ' + totalMultiply);
        console.log('Sum of 5 and 3 = ' + totalSum);
    },
    // multiply.js
    /* 1 */
    function (module, exports, __webpack_require__) {
        var sum = __webpack_require__(2);
        var multiply = function (a, b) {
            var total = 0;
            for (var i = 0; i < b; i++) {
                total = sum(a, total);
            }
            return total;
        };
        module.exports = multiply;
    },
    // sum.js
    /* 2 */
    function (module, exports) {
        var sum = function (a, b) {
            return a + b;
        };
        module.exports = sum;
    }
]);

console.log(a);