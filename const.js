module.exports = {
  BEST_SELLERS: ["Posizione nella classifica Bestseller di Amazon"],
  DETAILS:
  {
    DIMENSION: "Dimensioni prodotto",
    SHIPPING_WEIGHT: "Peso di spedizione",
    ITEM_WEIGHT: ["Peso articolo", "Peso"],
    DATE_FIRST_AVAILABLE: "disponibile su amazon.it a partire dal",
    NO: "n.",
    IN: "in"
  },
  SELLER:
  {
    AMZ: /Venduto e spedito da Amazon/i,
    FBA: /spedito da Amazon/i
  },
  MONEY: /[\d.]+,[\d]{2}/,
  WORD: /\w+/,
  toNumber: function toNumber(e)
  {
    return Number(e.replace(/\./g, "").replace(",", "."))
  },
  parseDate: function parseDate(e)
  {
    var t = {
      gennaio: "January",
      febbraio: "February",
      marzo: "March",
      aprile: "April",
      maggio: "May",
      giugno: "June",
      luglio: "July",
      agosto: "August",
      settembre: "September",
      ottobre: "October",
      novembre: "November",
      dicembre: "December"
    };
    for (var n in t) e = e.replace(n, t[n]);
    return Date.parse(e)
  }
}