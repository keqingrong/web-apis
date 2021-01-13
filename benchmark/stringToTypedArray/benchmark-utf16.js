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
  stringToTypedArray1(hybrid);
});

suite.add('stringToTypedArray2', () => {
  stringToTypedArray2(hybrid);
});

suite.add('stringToTypedArray3', () => {
  stringToTypedArray3(hybrid);
});

suite.add('stringToTypedArray4', () => {
  stringToTypedArray4(hybrid);
});

suite.add('stringToTypedArray5', () => {
  stringToTypedArray5(hybrid);
});

suite.on('cycle', event => {
  console.log(String(event.target));
});

suite.on('complete', () => {
  console.log('Fastest is ' + suite.filter('fastest').map('name'));
});

suite.run({ async: true });

// stringToTypedArray1 x 11,480 ops/sec ±3.51% (75 runs sampled)
// stringToTypedArray2 x 86,903 ops/sec ±3.93% (77 runs sampled)
// stringToTypedArray3 x 102,061 ops/sec ±3.21% (75 runs sampled)
// stringToTypedArray4 x 111,829 ops/sec ±2.71% (79 runs sampled)
// stringToTypedArray5 x 122,241 ops/sec ±9.48% (69 runs sampled)
// Fastest is stringToTypedArray5
// 122241/11480=10.648170731707317
