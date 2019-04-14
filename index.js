const _ = Symbol("parameter");
const ___ = Symbol("rest parameters");
const nop = Symbol("nop");

const curry = (f, len = f.length - 1) =>
  function _recur(...args1) {
    if (args1.length > len) return f(...args1);
    return (...args2) => _recur(...args1, ...args2);
  };

const curry1 = f =>
  (a, ...args) => args.length ? f(a, ...args) : (...args) => f(a, ...args);

const reduce = curry1(function (f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const item of iter) {
    acc = f(acc, item);
  }
  return acc;
});

const reverseIter = function* (iter) {
  const arr = [...iter];
  for (let i = arr.length - 1; i >= 0; i--) yield arr[i];
};

const partial = function(f, ...args1) {
  return function (...args2) {
    const left = [], right = [];
    const args1Iter = args1[Symbol.iterator]();
    const args2Iter = args2[Symbol.iterator]();
    for (const arg of args1Iter) {
      if (arg === ___) break;
      left.push(arg === _ ? args2Iter.next().value : arg);
    }
    const args2RverseIter = reverseIter(args2Iter);
    for (const arg of reverseIter(args1Iter)) {
      right.unshift(arg === _ ? args2RverseIter.next().value : arg);
    }
    return f(...left, ...reverseIter(args2RverseIter), ...right);
  }
};

const pipe = (f1, ...fns) =>
  (...args) => reduce((acc, f) => f(acc), f1(...args), fns);

const go = (a, ...fns) => pipe(...fns)(a);

const identity = a => a;
const always = a => () => a;
const not = a => !a;
const complement = f => pipe(f, not);
const both = curry1((f1, f2) => (...args) => f1(...args) && f2(...args));
const add = curry1((a, b) => a + b);
const addAll = (...args) => reduce(add, args);
const square = a => a * a;
const isOddNumber = a => a % 2;
const prop = curry1((key, obj) => obj[key]);
const equals = curry1((a, b) => a === b);
const propEq = curry(
  (key, val, obj) => go(obj, prop(key), equals(val)));

const typeOf = a => typeof a;
const isTypeOf = curry1((type, val) => go(
  val,
  typeOf,
  equals(type)
));
const isString = isTypeOf('string');
const isNotString = complement(isString);
const isIterable = both(
  identity,
  pipe(
    prop(Symbol.iterator),
    isTypeOf('function')
  )
);

const delay = (time, f, ...args) => new Promise(function (resolve) {
  setTimeout(_ => pipe(f, resolve)(...args), time);
});

const _baseBy = f => curry1((keyF, iter) =>
  reduce((acc, item) => f(acc, item, keyF(item)), {}, iter));

const groupBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: (acc[key] || []).concat(item)
}));

const countBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: (acc[key] || 0) + 1
}));

const indexBy = _baseBy((acc, item, key) => Object.assign(acc, {
  [key]: item
}));

const takeWhile = curry1(function(f, iter) {
  const res = [];
  let i = 0;
  for (const item of iter) {
    if (!f(item, i++)) break;
    res.push(item);
  }
  return res;
});

const take = curry1(
  (len, iter) => takeWhile((_, i) => i < len, iter));

const takeAll = take(Infinity);

const L = {};

L.map = curry1(function *(f, iter) {
  for (const item of iter) {
    yield f(item);
  }
});

L.filter = curry1(function *(f, iter) {
  for (const item of iter) {
    if (f(item)) yield item;
  }
});

const map = curry1(pipe(L.map, takeAll));

const filter = curry1(pipe(L.filter, takeAll));

L.range = function *(len) {
  let i = -1;
  while(++i < len) yield i;
};

const range = pipe(L.range, takeAll);

const find = curry1(pipe(L.filter, take(1), ([a]) => a));

const isFlatable = both(
  isIterable,
  isNotString
);

const last = function _last(iter) {
  if (iter.length === undefined) return _last([...iter]);
  else return iter[iter.length - 1];
};

const baseFlat = curry1(function _baseFlat(depth, iter) {
  const iterStack = [iter[Symbol.iterator]()];
  return {
    next: function _recur() {
      const iter = last(iterStack);
      if (!iter) return { done: true }
      const cur = iter.next();
      if (cur.done) {
        iterStack.pop();
        return _recur();
      } else if (isFlatable(cur.value) && iterStack.length <= depth) {
        iterStack.push(cur.value[Symbol.iterator]());
        return _recur();
      } else {
        return cur;
      }
    },
    [Symbol.iterator]: function () { return this; }
  }
});

L.flat = baseFlat(1);

const flat = pipe(L.flat, takeAll);

L.deepFlat = baseFlat(Infinity);

const deepFlat = pipe(L.deepFlat, takeAll);

L.flatMap = curry1(pipe(L.map, L.flat));

const flatMap = curry1(pipe(L.flatMap, takeAll));

const C = {};

const noop = () => {};

C.reduce = noop;
C.take = noop;
C.takeAll = noop;
C.map = noop;
C.filter = noop;

export {
  delay,
  isOddNumber,
  square,
  add,
  addAll,
  prop,
  propEq,
  equals,
  always,
  reduce,
  map,
  filter,
  groupBy,
  countBy,
  indexBy,
  pipe,
  go,
  curry,
  curry1,
  partial,
  _,
  ___,
  takeWhile,
  take,
  takeAll,
  L,
  range,
  find,
  flat,
  deepFlat,
  flatMap,
  C,
}