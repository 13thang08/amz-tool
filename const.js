module.exports = {
  BEST_SELLERS: ["Best Sellers Rank", "Amazon Best Sellers Rank", "Amazon Bestsellers Rank"],
  DETAILS:
  {
    DIMENSION: "Product Dimensions",
    SHIPPING_WEIGHT: "Shipping Weight",
    ITEM_WEIGHT: "Item Weight",
    DATE_FIRST_AVAILABLE: "date first available",
    NO: "#",
    IN: "in"
  },
  SELLER:
  {
    AMZ: /sold by amazon/i,
    FBA: /fulfilled by amazon/i
  },
  MONEY: /[\d,]+\.[\d]{2}/,
  WORD: /\w+/,
  toNumber: function toNumber(e)
  {
    return Number(e.replace(/,/g, ""))
  },
  parseDate: function parseDate(e)
  {
    return Date.parse(e)
  }
}