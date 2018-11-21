module.exports = new function ()
{
  var n = this;
  this.parseWeightUnit = function (e)
  {
    return e ? i[e.toLowerCase()] : e
  }, this.parseSizeUnit = function (e)
  {
    return e ? a[e.toLowerCase()] : e
  }, this.convertWeight = function (e, t, n)
  {
    return t == n ? e : e * o[t] / o[n]
  }, this.toPounds = function (e, t)
  {
    return n.convertWeight(e, t, "POUND")
  }, this.convertSize = function (e, t, n)
  {
    return t == n ? e : e * s[t] / s[n]
  }, this.convertSizeObject = function (e, t)
  {
    return e.unit == t ? e :
    {
      width: n.convertSize(e.width, e.unit, t),
      height: n.convertSize(e.height, e.unit, t),
      depth: n.convertSize(e.depth, e.unit, t),
      unit: t
    }
  }, this.toInches = function (e, t)
  {
    return "object" == (void 0 === e ? "undefined" : r(e)) ? n.convertSizeObject(e, "INCH") : n.convertSize(e, t, "INCH")
  }
}