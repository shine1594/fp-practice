import { curry } from './index';

const add = curry((a, b) => a + b);
const square = a => a * a;
const isOddNumber = a => a % 2;
const prop = curry((key, obj) => obj[key]);
const equals = curry((a, b) => a === b);
const propEq = curry((key, val, obj) => obj[key] === val);

export {
  add,
  square,
  isOddNumber,
  prop,
  propEq,
  equals,
}