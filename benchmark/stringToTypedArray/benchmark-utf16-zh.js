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
  stringToTypedArray1(chinese);
});

suite.add('stringToTypedArray2', () => {
  stringToTypedArray2(chinese);
});

suite.add('stringToTypedArray3', () => {
  stringToTypedArray3(chinese);
});

suite.add('stringToTypedArray4', () => {
  stringToTypedArray4(chinese);
});

suite.add('stringToTypedArray5', () => {
  stringToTypedArray5(chinese);
});

suite.on('cycle', event => {
  console.log(String(event.target));
});

suite.on('complete', () => {
  console.log('Fastest is ' + suite.filter('fastest').map('name'));
});

suite.run({ async: true });

// stringToTypedArray1 x 26,237 ops/sec ±10.68% (79 runs sampled)
// stringToTypedArray2 x 181,789 ops/sec ±2.40% (79 runs sampled)
// stringToTypedArray3 x 190,725 ops/sec ±9.21% (76 runs sampled)
// stringToTypedArray4 x 207,235 ops/sec ±3.86% (75 runs sampled)
// stringToTypedArray5 x 358,173 ops/sec ±2.79% (80 runs sampled)
// Fastest is stringToTypedArray5
// 358173/26237=13.651446430613255
