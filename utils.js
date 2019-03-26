const log = console.log;
const add = (a, b) => a + b;
const square = a => a * a;
const isOddNumber = a => a % 2;
const prop = key => obj => obj[key];
const propEq = (key, val) => obj => obj[key] === val;

export {
  log,
  add,
  square,
  isOddNumber,
  prop,
  propEq,
}