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

const go1 = (a, f) =>
  a instanceof Promise ? a.then(f) : f(a);

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

const tap = curry1((f, v) => (f(v), v));
const log = console.log;
const hi = tap(log);

const reduce = curry1(function _reduce(f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }

  if (acc instanceof Promise) {
    return acc
      .then(acc => _reduce(f, acc, iter))
      .catch(e => e === nop ? _reduce(f, iter) : Promise.reject(e));
  }
  
  let cur = null;
  return function _recur(acc) {
    while (!(cur = iter.next()).done) {
      if (cur.value instanceof Promise) {
        return cur.value
          .then(v => (acc = f(acc, v), _recur(acc)))
          .catch(e => e === nop ? _recur(acc) : Promise.reject(e));
      }
      acc = f(acc, cur.value);
      if (acc instanceof Promise) return acc.then(_recur);
    }
    return acc;
  } (acc);
});

const pipe = (f1, ...fns) =>
  (...args) => reduce((acc, f) => f(acc), f1(...args), fns);

const go = (...args) => reduce((acc, f) => f(acc), args);

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

const L = {};

L.takeWhile = curry1(function(f, iter) {
  let i = 0, cur = null, ok = true;
  iter = iter[Symbol.iterator]();
  return {
    next: function _recur() {
      if (!ok) return { value: undefined, done: true };
      while (!(cur = iter.next()).done) {
        const item = cur.value;
        ok = go1(item, v => f(v, i++));
        if (ok instanceof Promise) {
          return {
            value: ok.then(_ok => (ok = _ok) ? go1(item, identity) : Promise.reject(nop)),
            done: false
          }
        }
        else if (ok) return cur;
        else break;
      }
      return { value: undefined, done: true };
    },
    [Symbol.iterator]() { return this; }
  }
});

L.take = curry1(function *(len, iter) { yield* L.takeWhile((_, i) => i < len, iter); });

const takeWhile = curry1(function(f, iter) {
  iter = L.takeWhile(f, iter);
  let cur = null;
  return function _recur(res) {
    while (!(cur = iter.next()).done) {
      const item = cur.value;
      if (item instanceof Promise) {
        return item
          .then(v => (res.push(v), _recur(res)))
          .catch(e => e === nop ? _recur(res) : Promise.reject(e));
      }
      else res.push(item);
    }
    return res;
  }([]);
});

const take = curry1((len, iter) => takeWhile((_, i) => i < len, iter));

const takeAll = take(Infinity);

L.map = curry1(function *(f, iter) {
  for (const item of iter) {
    yield go1(item, f);
  }
});

L.filter = curry1(function *(f, iter) {
  for (const item of iter) {
    if (item instanceof Promise) {
      yield go1(item, v => f(v) ? v : Promise.reject(nop));
    }
    else if(f(item)) yield item;
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
      if (!iter) return { done: true };
      const cur = iter.next();
      if (cur.done) {
        iterStack.pop();
        return _recur();
      } else if (isFlatable(cur.value) && iterStack.length <= depth) {
        iterStack.push(cur.value[Symbol.iterator]());
        return _recur();
      } else if(cur.value instanceof Promise) {
        return {
          value: go1(cur.value, v => {
            if (!isFlatable(v) || iterStack.length > depth) return v;
            const iter = v[Symbol.iterator](), cur = iter.next();
            return cur.done ? Promise.reject(nop) : (iterStack.push(iter), cur.value);
          }),
          done: false
        };
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
const catchNoop = iter => {
  (iter = [...iter]).forEach(p => p instanceof Promise && p.catch(noop));
  return iter;
};

C.reduce = curry1(function(f, acc, iter) {
  const iter2 = catchNoop(iter || acc);
  return iter
      ? reduce(f, acc, iter2)
      : reduce(f, iter2);
});

C.take = curry1((len, iter) => take(len, catchNoop(iter)));
C.takeAll = C.take(Infinity);
C.map = curry1(pipe(L.map, C.takeAll));
C.filter = curry1(pipe(L.filter, C.takeAll));

export {
  delay,
  nop,
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