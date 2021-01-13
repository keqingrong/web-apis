const Benchmark = require('benchmark');
const {
  stringToTypedArray1,
  stringToTypedArray2,
  stringToTypedArray3,
  stringToTypedArray4,
  stringToTypedArray5
} = require('./utf16');
const { english, chinese, hybrid } = require('./constants');

const suite = new Benchmark.Suite();

suite.add('stringToTypedArray1', () => {
  stringToTypedArray1(english);
});

suite.add('stringToTypedArray2', () => {
  stringToTypedArray2(english);
});

suite.add('stringToTypedArray3', () => {
  stringToTypedArray3(english);
});

suite.add('stringToTypedArray4', () => {
  stringToTypedArray4(english);
});

suite.add('stringToTypedArray5', () => {
  stringToTypedArray5(english);
});

suite.on('cycle', event => {
  console.log(String(event.target));
});

suite.on('complete', () => {
  console.log('Fastest is ' + suite.filter('fastest').map('name'));
});

suite.run({ async: true });

// stringToTypedArray1 x 18,887 ops/sec ±5.01% (79 runs sampled)
// stringToTypedArray2 x 361,336 ops/sec ±3.32% (79 runs sampled)
// stringToTypedArray3 x 329,680 ops/sec ±3.09% (76 runs sampled)
// stringToTypedArray4 x 341,951 ops/sec ±7.99% (69 runs sampled)
// stringToTypedArray5 x 354,132 ops/sec ±3.31% (73 runs sampled)
// Fastest is stringToTypedArray2,stringToTypedArray5,stringToTypedArray4
// 354132/18887=18.75003970985334
