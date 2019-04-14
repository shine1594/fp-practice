const _ = Symbol("parameter");
const ___ = Symbol("rest parameters");
const nop = Symbol("nop");
const L = {};

function curry(f, len = f.length - 1) {
  return function _recur(...args1) {
    if (args1.length > len) return f(...args1);
    return (...args2) => _recur(...args1, ...args2);
  };
}

const curry1 = f =>
  (a, ...args) => args.length ? f(a, ...args) : (...args2) => f(a, ...args2); 

L.reduce = curry1(function* (f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  let tmp = null;
  for (const item of iter) {
    tmp = f(acc, item);
    if (tmp !== nop) yield acc = tmp;
  }
});

const takeWhile = curry(function(f, iter) {
  const res = [];
  let i = 0;
  for (const item of iter) {
    if (!f(item, i++)) break;
    else res.push(item);
  }
  return res;
});

const take = curry1((len, iter) => takeWhile((_, i) => len > i, iter));

const takeAll = take(Infinity);

const first = iter => iter[Symbol.iterator]().next().value;

const last = function _last(iter) {
  if (iter.length !== undefined) return iter[iter.length - 1];
  else return _last([...iter]);
};

const reduce = curry1((...args) => last(L.reduce(...args)));

function pipe(f1, ...fns) {
  return (...args) => reduce((acc, f) => f(acc), f1(...args), fns);
}

const go = (a, ...fns) => pipe(...fns)(a);
// const go = (...args) => reduce((acc, f) => f(acc), args);

L.map = curry1(function* (f, iter) {
  const reduceIter = L.reduce(
    (acc, item) => (acc.push(f(item)), acc),
    [],
    iter);
  
  for (const acc of reduceIter) {
    yield last(acc);
  }
});

L.filter = curry1(function* (f, iter) {
  const reduceIter = L.reduce(
    (acc, item) => f(item) ? (acc.push(item), acc) : nop,
    [],
    iter);
  
  for (const acc of reduceIter) {
    yield last(acc);
  }
});

const map = curry1(pipe(L.map, takeAll));

const filter = curry1(pipe(L.filter, takeAll));

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

L.range = function *(len) {
  let i = -1;
  while(++i < len) yield i;
};

const range = pipe(L.range, takeAll);

const find = curry1(pipe(L.filter, first));

const isIterable = iter =>
  iter && typeof iter[Symbol.iterator] === 'function';
const isString = a => typeof a === 'string';
const complement = f => (...args) => !f(...args);
const isNotString = complement(isString);
const both = (f1, f2) => (...args) => f1(...args) && f2(...args);
const isFlatable = both(
  isNotString,
  isIterable
);

const baseFlat = curry1(function (depth, iter) {
  const iterStack = [iter[Symbol.iterator]()];
  return {
    next: function recur() {
      const iter = last(iterStack);
      if (!iter) return { done: true };
      const cur = iter.next();
      if (cur.done) {
        iterStack.pop();
        return recur();
      } else if (isFlatable(cur.value) && iterStack.length <= depth) {
        iterStack.push(cur.value[Symbol.iterator]());
        return recur();
      } else {
        return cur;
      }
    },
    [Symbol.iterator]() { return this; }
  };
});

L.flat = baseFlat(1);

// L.flat = function *(iter) {
//   for (const item of iter) {
//     if (isFlatable(item)) {
//       yield *item;
//     } else {
//       yield item;
//     }
//   }
// };

const flat = pipe(
  L.flat,
  takeAll
);

L.deepFlat = baseFlat(Infinity);
// L.deepflat = function* _deepFlat(iter) {
//   for (const item of iter) {
//     yield isFlatable(item) ? _deepFlat(item) : item;
//   }
// };

const deepFlat = pipe(
  L.deepFlat,
  takeAll
);

L.flatMap = curry1(
  pipe(
    L.map,
    L.flat));

const flatMap = curry1(
  pipe(
    L.map,
    flat));

export {
  reduce,
  map,
  filter,
  groupBy,
  countBy,
  indexBy,
  pipe,
  go,
  curry,
  partial,
  _,
  ___,
  take,
  takeWhile,
  takeAll,
  L,
  range,
  find,
  flat,
  deepFlat,
  flatMap
}