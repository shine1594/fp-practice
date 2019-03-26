import { expect } from 'chai';
import {
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
} from './index.js';
import {
  isOddNumber,
  square,
  add,
  prop,
  propEq,
} from './utils';

const iter = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  }
};

const products = [
  { id: 1, name: "아이폰8", category: 'phone', price: 800  },
  { id: 2, name: "아이폰XS", category: 'phone', price: 1300  },
  { id: 3, name: "맥북프로15", category: 'computer', price: 3000  },
  { id: 4, name: "아이맥5K", category: 'computer', price: 2500  }
];

describe('reduce 함수는', () => {
  it('iterable 객체를 순회한다', () => {
    expect(reduce(add, 10, iter)).to.eql(25);
  });

  it('초기값이 없는 경우, 첫 번째 element를 초기값으로 한다', () => {
    expect(reduce(add, iter)).to.eql(15);
  });

  it('첫 번째 인자까지 커링한다', () => {
    expect(reduce(add)(10, iter)).to.eql(25);
    expect(reduce(add)(iter)).to.eql(15);
  });
});

describe('map 함수는', () => {
  it('iterable 객체를 순회한다 (reduce함수를 이용하여 구현해 보세요!)', () => {
    expect(map(square, iter)).to.eql([1, 4, 9, 16, 25]);
  });

  it('첫 번째 인자까지 커링한다', () => {
    expect(map(square)(iter)).to.eql([1, 4, 9, 16, 25]);
  });
});

describe('filter 함수는', () => {
  it('iterable 객체를 순회한다 (reduce함수를 이용하여 구현해 보세요!)', () => {
    const res = filter(isOddNumber, iter);
    expect(res).to.eql([1, 3, 5]);
  });
});

describe('groupBy 함수는', () => {
  it('iterable 객체를 순회한다 (reduce함수를 이용하여 구현해 보세요!)', () => {
    const res = groupBy(prop('category'), products);
    expect(res).to.eql({
      phone: [
        { id: 1, name: "아이폰8", category: 'phone', price: 800 },
        { id: 2, name: "아이폰XS", category: 'phone', price: 1300 }
      ],
      computer: [
        { id: 3, name: "맥북프로15", category: 'computer', price: 3000 },
        { id: 4, name: "아이맥5K", category: 'computer', price: 2500 }
      ]
    });
  });
});

describe('countBy 함수는', () => {
  it('iterable 객체를 순회한다 (reduce함수를 이용하여 구현해 보세요!)', () => {
    const res = countBy(prop('category'), products);
    expect(res).to.eql({
      phone: 2,
      computer: 2
    });
  });
});

describe('indexBy 함수는', () => {
  it('iterable 객체를 순회한다 (reduce함수를 이용하여 구현해 보세요!)', () => {
    const res = indexBy(prop('id'), products);
    expect(res).to.eql({
      '1': { id: 1, name: "아이폰8", category: 'phone', price: 800 },
      '2': { id: 2, name: "아이폰XS", category: 'phone', price: 1300 },
      '3': { id: 3, name: "맥북프로15", category: 'computer', price: 3000 },
      '4': { id: 4, name: "아이맥5K", category: 'computer', price: 2500 }
    });
  });
});

describe('pipe 함수는', () => {
  it('여러 함수를 인자로 받아서 합성한 함수를 반환한다 (reduce함수를 이용하여 구현해 보세요!)', () => {
    const func = pipe(
      iter => map(square, iter),
      iter => filter(isOddNumber, iter),
      iter => reduce(add, iter)
    );
    expect(func(iter)).to.eql(35);
  });

  it('첫 번째 함수에 여러 개의 인자를 전달할 수 있다', () => {
    const addAll = (...args) => reduce(add, args);
    const func = pipe(
      addAll,
      square,
      Math.sqrt,
      a => a + 1
    );
    expect(func(...iter)).to.eql(16);
  });
});

describe('go 함수는', () => {
  it('초기값과 여러 함수를 인자로 받아서 합성한 함수에 초기값을 인자로 전달하여 즉시 실행한다', () => {
    const res = go(
      products,
      list => filter(propEq('category', 'phone'), list),
      list => map(prop('price'), list),
      list => map(a => a * 0.8, list),
      list => reduce(add, list)
    );
    expect(res).to.eql(1680);
  });
});

describe('curry 함수는', () => {
  it('어떤 함수의 인자가 모두 채워질 때까지 평가를 미루는 함수를 반환한다', () => {
    const add3 = curry((a, b, c) => a + b + c);
    expect(add3(1)(2)(3)).to.eql(6);
    expect(add3(1, 2)(3)).to.eql(6);
    expect(add3(1)(2, 3)).to.eql(6);
    expect(add3(1, 2, 3)).to.eql(6);
  });

  it('두 번째 인자로 커링 횟수를 지정할 수 있다', () => {
    const map_c = curry(map);
    const filter_c = curry(filter);
    const reduce_c = curry(reduce, 1); //한번만 커링
    
    const res = go(
      products,
      filter_c(propEq('category', 'phone')),
      map_c(prop('price')),
      map_c(a => a * 0.8),
      reduce_c(add)
    );
    expect(res).to.eql(1680);
  });
});

describe('partial 함수는', () => {
  const add3 = (a, b, c) => a + b + c;

  it('어떤 함수의 인자를 미리 적용하여 한 번 지연 평가한다', () => {
    expect(partial(add3)(1, 2, 3)).to.eql(6);
    expect(partial(add3, 1, 2)(3)).to.eql(6);
    expect(partial(add3, 1)(2, 3)).to.eql(6);
    expect(partial(add3, 1, 2, 3)()).to.eql(6);
  });

  it('_심볼을 이용하여 원하는 위치의 인자를 미리 적용할 수 있다', () => {
    expect(partial(add3, _, 2, 3)(1)).to.eql(6);
    expect(partial(add3, _, 2, _)(1, 3)).to.eql(6);
  });

  it('___심볼을 이용하여 나머지 인자를 지원한다', () => {
    const addAll = (...args) => reduce(add, args);
    expect(partial(addAll, 1, ___, 5)(2, 3, 4)).to.eql(15);
    expect(partial(addAll, 1, ___, 5, _, 7, _, 9)(2, 3, 4 ,6, 8)).to.eql(45);
  });
});