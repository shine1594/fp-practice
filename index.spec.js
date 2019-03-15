import { expect } from 'chai';
import { map } from './index.js';

describe('map', () => {
  it('인자가 Array인 경우', () => {
    expect(map(a => a * a, [1, 2, 3])).to.eql([1, 4, 9]);
  });

  it('인자가 iterable인 경우', () => {
    const iter = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      }
    };
    expect(map(a => a * a, iter)).to.eql([1, 4, 9]);
  });
});