import { curry } from './index';

const fetchRepos = account =>
  fetch(`https://api.github.com/users/${account}/repos`)
    .then(res => res.json());

const columns = [
  "name",
  "url",
  "private",
  "forks_count",
  "updated_at",
  "default_branch"
];

const renderTable = curry(function(el, columns, data) {
  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>url</th>
          <th>private</th>
          <th>forks_count</th>
          <th>updated_at</th>
          <th>default_branch</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>blog</td>
          <td>https://api.github.com/repos/shine1594/blog</td>
          <td>false</td>
          <td>0</td>
          <td>2019-03-10T16:19:45Z</td>
          <td>master</td>
        </tr>
      </tbody>
    </table>`;
});

document.addEventListener('DOMContentLoaded', function() {
  var $app = document.querySelector('#app');
  fetchRepos('shine1594')
    .then(d =>( console.log(d), d))
    .then(renderTable($app, columns));
});