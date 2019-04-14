# 함수형 프로그래밍과 ES6+ 강의 연습문제

유인동님의 ["함수형 프로그래밍과 ES6+"](<https://programmers.co.kr/learn/courses/7637>) 강의에 등장하는 함수들을 직접 구현해 보며 익히기 위해 만든 Repository입니다. 강의의 각 Part가 Repository의 Stage에 해당하며, 각 stage 브랜치에 미리 테스트 케이스가 작성되어 있습니다. stage1 ~ 3까지 차례대로 테스트 케이스를 만족해나가며 함수를 작성하시면 됩니다. 혹시 **잘못된 테스트 케이스나 질문을 issue로 등록해 주시면 많은 도움이 됩니다.** 감사합니다.



## 실행 방법

### **먼저 이 repository를 fork하세요~**

```shell
git checkout <branch>
npm install
npm test
```



## Branch

- ### [stage1](<https://github.com/shine1594/fp-practice/tree/stage1>)

  강의의 Part1에 등장하는 함수들과 reduce를 응용한 함수(groupBy, countBy, indexBy), partial함수를 구현해 보면서 고차함수를 만들고 활용하는 방법을 익힐 수 있습니다.

- ### [stage1-example](<https://github.com/shine1594/fp-practice/tree/stage1-example>)

  스터디를 진행하면서 완성한 *stage1* 브랜치의 예제 코드입니다.


- ### [stage1-practice-table](<https://github.com/shine1594/fp-practice/tree/stage1-practice-table>)

  stage1에서 작성한 여러 함수들을 활용하여 Github API를 호출하여 html파일에 동적으로 table을 rendering하는 예제 코드입니다. [parcel](<https://parceljs.org/>)을 이용하여 javascript를 build하고 간단한 로컬 서버로 테스트해볼 수 있습니다. app.js에 코드를 작성해볼 수 있으며, 스터디를 진행하며 완성한 코드는 example.js 입니다.

  

    #### 주요 파일

    - **index.js**: stage1에서 작성한 함수 모음
    - **index.html**: 미리 작성된 css와 app.js를 load하며, table이 그려질 ```<div id="app"><div>``` 가 작성되어 있음
    - **app.js**: Github API를 호출하고 table tag를 동적으로 생성하여 ```<div id="app"><div>``` 에 붙여넣는 코드를 작성하기 위한 template 코드
    - **example.js**: 스터디를 진행하며 완성한 app.js 코드

  

    #### 실행 방법

  ```shell
  npm install
  npx parcel index.html
  ```

    


- ### [stage2](<https://github.com/shine1594/fp-practice/tree/stage2>)

  강의의 Part2에 등장하는 함수들을 구현해 보며 Iterator-Iterable protocol, Generator, 지연평가에 대해 익힐 수 있습니다.


- ### ~~[stage2-example](<https://github.com/shine1594/fp-practice/tree/stage2-example>)~~

  reduce를 lazy하게 구현해 본 실험적인 브랜치라 무시하셔도 됩니다 :)


- ### [stage2-example2](<https://github.com/shine1594/fp-practice/tree/stage2-example2>)

  스터디를 진행하면서 완성한 *stage2* 브랜치의 예제 코드입니다.


- ### [stage3](<https://github.com/shine1594/fp-practice/tree/stage3>)

  강의의 Part3에 등장하는 함수들을 구현해 보며 Promise를 활용하여 기본적인 비동기 처리하는 방법과, 나아가 지연적으로 동작하는 함수들과 조합하여 비동기 처리의 성능을 개선하는 방법, 그리고 동시적으로 비동기를 다루는 방법을 익힐 수 있습니다.


- ### [stage3-example](<https://github.com/shine1594/fp-practice/tree/stage3-example>)

  스터디를 진행하면서 완성한 *stage3* 브랜치의 예제 코드입니다.

