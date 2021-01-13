const Benchmark = require('benchmark');
const {
  stringToTypedArray1,
  stringToTypedArray2,
  stringToTypedArray3,
  stringToTypedArray4
} = require('./latin1');
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

suite.on('cycle', event => {
  console.log(String(event.target));
});

suite.on('complete', () => {
  console.log('Fastest is ' + suite.filter('fastest').map('name'));
});

suite.run({ async: true });

// stringToTypedArray1 x 18,017 ops/sec ±9.45% (66 runs sampled)
// stringToTypedArray2 x 453,086 ops/sec ±2.84% (80 runs sampled)
// stringToTypedArray3 x 524,938 ops/sec ±2.14% (82 runs sampled)
// stringToTypedArray4 x 485,050 ops/sec ±4.65% (83 runs sampled)
// Fastest is stringToTypedArray3
