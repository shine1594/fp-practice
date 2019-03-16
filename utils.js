const add = (a, b) => a + b;
const square = a => a * a;
const isOddNumber = a => a % 2;
const prop = key => obj => obj[key];
const propEq = (key, val) => obj => obj[key] === val;

export {
  add,
  square,
  isOddNumber,
  prop,
  propEq,
}