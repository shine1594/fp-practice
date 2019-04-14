# Stage1 Practice
  stage1에서 작성한 여러 함수들을 활용하여 Github API를 호출하여 html파일에 동적으로 table을 rendering하는 예제 코드입니다. [parcel](<https://parceljs.org/>)을 이용하여 javascript를 build하고 간단한 로컬 서버로 테스트해볼 수 있습니다. app.js에 코드를 작성해볼 수 있으며, 스터디를 진행하며 완성한 코드는 example.js 입니다.


## 실행 방법
```shell
git checkout stage1-practice-table
npm install
npx parcel index.html
```


## 주요 파일
- **index.js**: stage1에서 작성한 함수 모음
- **index.html**: 미리 작성된 css와 app.js를 load하며, table이 그려질 ```<div id="app"><div>``` 가 작성되어 있음
- **app.js**: Github API를 호출하고 table tag를 동적으로 생성하여 ```<div id="app"><div>``` 에 붙여넣는 코드를 작성하기 위한 template 코드
- **example.js**: 스터디를 진행하며 완성한 app.js 코드
