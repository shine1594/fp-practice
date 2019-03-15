const map = function(f, iter) {
  const res = [];
  for (const item of iter) {
    res.push(f(item));
  }
  return res;
};

export {
  map
}