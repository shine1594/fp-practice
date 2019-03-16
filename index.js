const _ = Symbol("parameter");
const ___ = Symbol("rest parameters");

const map = function(f, iter) {
  const res = [];
  for (const item of iter) {
    res.push(f(item));
  }
  return res;
};

const filter = function(f, iter) {
  const res = [];
  for (const item of iter) {
    if (f(item)) res.push(item);
  }
  return res;
};

const reduce = function _reduce(f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    return _reduce(f, iter.next().value, iter);
  }
  for (const item of iter) {
    acc = f(acc, item);
  }
  return acc;
};

const _set = (key, val, obj = {}) => ((obj[key] = val), obj);
const _push = (val, arr = []) => (arr.push(val), arr);

const _makeBy = f => (getKey, coll) =>
  reduce((acc, curr) => f(acc, curr, getKey(curr)), {}, coll);

const groupBy = _makeBy((acc, curr, key) =>
  _set(key, _push(curr, acc[key]), acc)
);

const countBy = _makeBy((acc, curr, key) =>
  _set(key, (acc[key] || 0) + 1, acc)
);

const indexBy = _makeBy((acc, curr, key) => _set(key, curr, acc));

const pipe = (f1, ...fns) => (...args) => reduce((acc, f) => f(acc), f1(...args), fns);

const go = (a, ...fns) => pipe(...fns)(a);

const curry = function (f, len = f.length - 1) {
  return (function recur(prevArgs) {
    return function(...currArgs) {
      const args = [...prevArgs, ...currArgs];
      if (args.length > len) return f(...args);
      return recur(args);
    };
  })([]);
};

const reverseIter = function* (iter) {
  const arr = [...iter];
  for (let i = arr.length - 1; i >= 0; i--) {
    yield arr[i];
  }
};

const partial = (f, ...args1) => (...args2) => {
	const left = [], right = [];
	const args1Iter = args1[Symbol.iterator]();
  const args2Iter = args2[Symbol.iterator]();

	for (const arg of args1Iter) {
		if (arg === ___) break;
    left.push(arg === _ ? args2Iter.next().value : arg);
  }

	const args2ReverseIter = reverseIter(args2Iter);
	for (const arg of reverseIter(args1Iter)) {
		right.unshift(arg === _ ? args2ReverseIter.next().value : arg);
  }

	const restArgs = reverseIter(args2ReverseIter);
	return f(...left, ...restArgs, ...right);
};

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
}