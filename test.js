const Symbol = require('es6-symbol');

var arr = ["1", "2"];

var f = arr[Symbol.iterator]()
console.log(f.next());