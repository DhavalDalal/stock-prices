const rx = require('rxjs');
const { map, filter, flatMap, concatMap, switchMap, reduce, merge } = require('rxjs/operators');

// console.debug(`Market Data...`);
const STOCKS = [{
	ticker: 'AAPL',
	name: 'Apple Inc.',
	low: 50.35,
	high: 60.45,
	tickMillis: {
		low: 2000,
		high: 3000
	}
}, {
	ticker: 'GOOG',
	name: 'Google Inc.',
	low: 90.67,
	high: 120.34,
	tickMillis: {
		low: 1000,
		high: 2000
	}
}, {
	ticker: 'MSFT',
	name: 'Microsoft Inc.',
	low: 20.56,
	high: 34.23,
	tickMillis: {
		low: 3000,
		high: 4000
	}
}, {
	ticker: 'ORCL',
	name: 'Oracle Inc.',
	low: 65.10,
	high: 80.19,
	tickMillis: {
		low: 4000,
		high: 8000
	}
}, 
{
	ticker: 'YHOO',
	name: 'Yahoo Inc.',
	low: 20.10,
	high: 35.19,
	tickMillis: {
		low: 8000,
		high: 10000
	}
}
];

const randomNumberBetween = function(min, max, decimalPlaces = 0) {
	// return Math.floor(Math.random() * (max - min + 1) + min);
	// return decimal value
	let decimalValue = (Math.random() * (max - min)) + min;
	if (decimalPlaces === 0)
		return Number.parseInt(decimalValue.toFixed(decimalPlaces));
	else
		return Number.parseFloat(decimalValue.toFixed(decimalPlaces));
}

module.exports = {
	getAllTickerPrices: function() {
		console.log(`getAllTickerPrices()`);
		return STOCKS.map(stock => {
			stock.price = randomNumberBetween(stock.low, stock.high, 2);
			return stock;
		});
	},
	getTickerPriceFor: function(ticker) {
		console.log(`getTickerPriceFor(${ticker})`);
		const found = this.getAllTickerPrices().filter(stock => stock.ticker === ticker)[0];
		if (found)
			return found;
		else
			throw new Error(`Ticker ${ticker} Not found!`);
	},
	streamTickerPriceFor: function(ticker) {
		console.log(`streamTickerPriceFor(${ticker})`);
		try {
			const stock = this.getTickerPriceFor(ticker);
      return rx.timer(randomNumberBetween(stock.tickMillis.low, stock.tickMillis.high), randomNumberBetween(stock.tickMillis.low, stock.tickMillis.high))
        .pipe(map(() => {
          stock.price = randomNumberBetween(stock.low, stock.high, 2);
          return stock;
      })); 
		} catch (e) {
			return rx.throwError(e);
		}
	},
	streamAllTickerPrices: function() {
		console.log(`streamAllTickerPrices()`);
		return STOCKS.map(stock => this.streamTickerPriceFor(stock.ticker)).reduce((o1, o2) => o1.pipe(merge(o2)));
	}
}
