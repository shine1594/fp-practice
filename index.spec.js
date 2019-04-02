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
  takeWhile,
  take,
  takeAll,
  L,
  range,
  find,
  flat,
  deepFlat,
  flatMap,
} from './index.js';
import {
  isOddNumber,
  square,
  add,
  prop,
  propEq,
  equals,
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
  it('iterable 객체를 순회한다', () => {
    const res = map(square, iter);
    expect(res).to.eql([1, 4, 9, 16, 25]);
  });

  it('L.map을 이용하여 구현한다 (takeAll함수 이후에 작성하세요)', () => {
    /*
     * L.map을 이용하여 map을 구현하였으면
     * 아래의 expect함수에 true를 전달하여 테스트 케이스를 통과하세요!
     */
    expect(true).to.eql(true);
  });
});

describe('filter 함수는', () => {
  it('iterable 객체를 순회한다', () => {
    const res = filter(isOddNumber, iter);
    expect(res).to.eql([1, 3, 5]);
  });

  it('L.filter를 이용하여 구현한다 (takeAll함수 이후에 작성하세요)', () => {
    /*
     * L.filter를 이용하여 filter를 구현하였으면
     * 아래의 expect함수에 true를 전달하여 테스트 케이스를 통과하세요!
     */
    expect(true).to.eql(true);
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
      map(square),
      filter(isOddNumber),
      reduce(add)
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
      filter(propEq('category', 'phone')),
      map(prop('price')),
      map(a => a * 0.8),
      reduce(add)
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

  it('두 번째 인자로 커링할 인자의 개수를 지정할 수 있다', () => {
    const add5 = curry(
      (a, b, c, d, e = 100) => a + b + c + d + e, 3);

    expect(add5(1)(2)(3)(4)).to.eql(110);
    expect(add5(1)(2)(3)(4, 5)).to.eql(15);
    expect(add5(1, 2, 3, 4, 5)).to.eql(15);
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

const iter3 = [1, 2, 3, 4, 3, 2, 1];

describe('takeWhile 함수는', () => {
  const always = a => _ => a;
  it('보조함수로 element를 평가한 결과가 Falsy한 값일 때까지 순회하며 elment를 배열에 담아 반환한다', () => {
    expect(takeWhile(a => a !== 4, iter3)).to.eql([1, 2, 3]);
  });
  it('최대 iterable의 length까지 순회한다', () => {
    expect(takeWhile(always(true), iter3)).to.eql([1, 2, 3, 4, 3, 2, 1]);
  });
  it('커링이 적용되어 인자를 모두 받을 때까지 평가를 지연한다', () => {
    expect(takeWhile(a => a !== 4)(iter3)).to.eql([1, 2, 3]);
    expect(takeWhile(always(true))(iter3)).to.eql([1, 2, 3, 4, 3, 2, 1]);
  });
});

describe('take 함수는', () => {
  it('iterable을 순회하며 첫 번째 인자로 전달한 정수값 만큼 element를 배열에 담아 반환한다', () => {
    expect(take(3, iter)).to.eql([1, 2, 3]);
  });
  it('최대 iterable의 length까지 순회한다', () => {
    expect(take(Infinity, iter)).to.eql([1, 2, 3, 4, 5]);
  });
  it('커링이 적용되어 인자를 모두 받을 때까지 평가를 지연한다', () => {
    expect(take(3)(iter)).to.eql([1, 2, 3]);
    expect(take(Infinity)(iter)).to.eql([1, 2, 3, 4, 5]);
  });
});

describe('takeAll 함수는', () => {
  it('iterable을 끝까지 순회하여 모든 element를 배열에 담아 반환한다', () => {
    expect(takeAll(iter)).to.eql([1, 2, 3, 4, 5]);
    expect(takeAll(iter3)).to.eql([1, 2, 3, 4, 3, 2, 1]);
  });
});

describe('L.range 함수는', () => {
  it('0부터 입력받은 정수까지 범위의 숫자를 만들어내는 generator객체를 반환한다', () => {
    expect(take(3, L.range(3))).to.eql([0, 1, 2]);
    expect(takeAll(L.range(5))).to.eql([0, 1, 2, 3, 4]);
  });
});

describe('range 함수는', () => {
  it('0부터 입력받은 정수까지 범위의 숫자로 채워진 배열을 반환한다', () => {
    expect(range(3)).to.eql([0, 1, 2]);
    expect(range(5)).to.eql([0, 1, 2, 3, 4]);
  });
});

describe('find 함수는', () => {
  it('iterable을 순회하며 보조함수가 참으로 평가되는 첫 번째 element를 반환한다', () => {
    expect(find(equals(4), iter)).to.eql(4);
    expect(find(a => a % 2 === 0, iter)).to.eql(2);
  });
  it('보조함수의 결과가 참으로 평가되는 element가 없으면 undefined를 반환한다', () => {
    expect(find(a => a > 5, iter)).to.eql(undefined);
  });
  it('커링이 적용되어 인자를 모두 받을 때까지 평가를 지연한다', () => {
    expect(find(equals(4))(iter)).to.eql(4);
  });
});

const iter2 = {
  *[Symbol.iterator]() {
    yield 1;
    yield new Map([['a', 2], ['b', 3]]);
    yield new Set([4, 5]);
    yield [6, 7, [8, 9]];
    yield 10;
  }
};

describe('L.flat 함수는', () => {
  it('iterable인 element를 펼쳐서 순회할 수 있는 generator객체를 반환한다', () => {
    expect([...L.flat(iter2)]).to.eql(
      [1, ['a', 2], ['b', 3], 4, 5, 6, 7, [8, 9], 10]
    );
  });

  it('string은 flat할 대상이 아닌 하나의 값으로 처리한다', () => {
    expect([...L.flat([1, 'abc', 3])]).to.eql([1, 'abc', 3]);
  });
});

describe('flat 함수는', () => {
  it('L.flat을 모두 즉시 평가한 결과를 배열에 담아 반환한다', () => {
    expect(flat(iter2)).to.eql(
      [1, ['a', 2], ['b', 3], 4, 5, 6, 7, [8, 9], 10]);
  });
  it('string은 flat할 대상이 아닌 하나의 값으로 처리한다', () => {
    expect(flat([1, 'abc', 3])).to.eql([1, 'abc', 3]);
  });
});

describe('L.deepFlat 함수는', () => {
  it('중첩된 iterable을 모두 펼쳐서 순회하는 generator객체를 반환한다', () => {
    expect([...L.deepFlat(iter2)]).to.eql(
      [1, 'a', 2, 'b', 3, 4, 5, 6, 7, 8, 9, 10]
    );
  });

  it('string은 flat할 대상이 아닌 하나의 값으로 처리한다', () => {
    expect([...L.deepFlat([1, [2, ['abc'], 3], 4])]).to.eql([1, 2, 'abc', 3, 4]);
  });
});

describe('deepFlat 함수는', () => {
  it('L.deepFlat을 모두 즉시 평가한 결과를 배열에 담아 반환한다', () => {
    expect(deepFlat(iter2)).to.eql(
      [1, 'a', 2, 'b', 3, 4, 5, 6, 7, 8, 9, 10]
    );
    expect(deepFlat([1, [2,[3, [4, [5], 6], 7], 8], 9])).to.eql(
      [1, 2, 3, 4, 5, 6, 7, 8, 9]
    );
  });

  it('string은 flat할 대상이 아닌 하나의 값으로 처리한다', () => {
    expect(deepFlat([1, [2, ['abc'], 3], 4])).to.eql([1, 2, 'abc', 3, 4]);
  });
});

describe('L.flatMap 함수는', () => {
  it('보조함수와 flat함수를 합성한 함수로 element를 평가하며 순회하는 generator객체를 반환한다', () => {
    expect([...L.flatMap(a => [a, a + 1, a + 2], iter)]).to.eql(
      [1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7]
    );

    expect(take(8, L.flatMap(L.range, iter))).to.eql(
      [0, 0, 1, 0, 1, 2, 0, 1]
    );
  });
});

describe('flatMap 함수는', () => {
  it('L.flatMap을 모두 즉시 평가한 결과를 배열에 담아 반환한다', () => {
    expect(flatMap(a => [a, a + 1, a + 2], iter)).to.eql(
      [1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7]
    );
    expect(take(8, flatMap(L.range, iter))).to.eql(
      [0, 0, 1, 0, 1, 2, 0, 1]
    );
  });
});