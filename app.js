import {go, map, reduce} from './index';
import {add, log} from './utils';

go([1,2,3], list => map(a => a * 2, list), list => reduce(add, list), log);