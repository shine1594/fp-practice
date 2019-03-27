import { curry, go, map, reduce, pipe } from './index';

const fetchRepos = account =>
  fetch(`https://api.github.com/users/${account}/repos`)
    .then(res => res.json());

const pick = curry((keys, obj) =>
  reduce((acc, key) => (acc[key] = obj[key], acc), {}, keys));

const join = curry((sep, iter) =>
  reduce((acc, item) => `${acc}${sep}${item}`, iter));
const joinByEmpty = join("");

const makeTag = curry((name, val) => `<${name}>${val}</${name}>`);
const makeTr = makeTag("tr");
const makeTh = makeTag("th");
const makeTd = makeTag("td");
const makeThead = makeTag("thead");
const makeTbody = makeTag("tbody");
const makeTable = (thead, tbody) => makeTag("table", thead + tbody);
const makeRow = pipe(Object.values, map(makeTd), joinByEmpty, makeTr);

const renderTable = curry((el, keys, json) => {
  const thead = go(
    keys,
    map(makeTh),
    joinByEmpty,
    makeTr,
    makeThead
  );
  const tbody = go(
    json,
    map(pick(keys)),
    map(makeRow),
    joinByEmpty,
    makeTbody
  );
  el.innerHTML = makeTable(thead, tbody);
});

document.addEventListener("DOMContentLoaded", function() {
  const $app = document.querySelector("#app");
  const columns = [
    "name",
    "url",
    "private",
    "forks_count",
    "updated_at",
    "default_branch"
  ];
  fetchRepos('shine1594')
    .then(renderTable($app, columns));
});