# 자바스크립트 튜토리얼

본 저장소는 <https://javascript.info>의 내용을 영-한 번역하고 있습니다.

## 참여 방법

- [Dashboard](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=0)에서 번역 진행 상황을 확인합니다.
- 번역되지 않은 글(article)이나, 리뷰가 필요한 글을 선택합니다.
- [Dashboard](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=0)의 해당 글에 본인의 깃허브 아이디와 진행상황(Translation Status)을 업데이트합니다.
- [한국어 리드 저장소](https://github.com/javascript-tutorial/ko.javascript.info)를 포크하여 번역 작업을 시작하고, 번역이 끝나면 Pull Request 합니다. 

:exclamation: 권한 요청
- 처음 작업을 하는 분들은 [Dashboard](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=0) 수정 권한이 필요하니, gmail 아이디를 적은 권한 요청 게시물을 [이슈](https://github.com/Violet-Bora-Lee/javascript-tutorial-ko/issues) 페이지에 등록합니다.

👂 의사소통
- 질문이나 소통을 위해선 [카카오톡 오픈채팅방](https://open.kakao.com/o/gSBnoLab)을 이용해주세요.

번역 기여자의 이름과 기여도는 번역이 완료되면 "About project"에 올라갑니다.

P.S. 번역이 진행되고 있는 언어는 <https://github.com/javascript-tutorial/translate>에서 확인할 수 있습니다.

## 저장소 구조

모든 챕터(chapter), 글(article), 과제(task)는 각각의 폴더 안에 구성되어 있습니다.

폴더는 `N-url`형식의 이름을 가집니다. `N`은 정렬 목적으로 부여한 숫자이고 `url`은 해당 자료의 URL 일부를 나타냅니다.

폴더는 다음 같은 파일을 담고 있습니다.

  - `대주제(section)`의 개괄적인 설명을 담은 `index.md`
  - `글(article)`이 저장된 `article.md`
  - `과제(task)`를 위한 `task.md` (과제의 해답이 있다면 `solution.md`으로 제공)

각 파일은 `# Title Header`로 시작하고, 간단한 텍스트 에디터로 수정 가능한 마크다운 포멧으로 작성되었습니다.

## 번역 규칙

* 경어체를 사용합니다.
* 주제에서 새롭게 등장하는 키워드는 한-영 병기`(예: 프로퍼티(property), 브라우저 객체 모델(Browser Object Model, BOM))`합니다.
* [합의된 번역어](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=1401860741)로 번역합니다. 공동작업에선 번역어 통일이 매우 중요합니다.
* 등록되지 않은 새로운 용어는 번역어를 등록한후 번역합니다.
* 번역어는 출판된 도서, 국립국어원의 외래어 표기법 용례, 한글라이즈 사이트 등을 기준으로 선정합니다. 주 참고자료는 다음과 같습니다.
  * 프론트엔드 개발자를 위한 자바스크립트 프로그래밍([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788966260768&orderClick=LIK&Kc=))
  * 인사이드 자바스크립트([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968480652))
  * 러닝 자바스크립트([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968483387))
  * 초보자를 위한 JavaScript 200제([링크](http://www.yes24.com/Product/Goods/70746749?Acode=101))
  * 국립국어원 외래어 표기법 용례 찾기([링크](http://www.korean.go.kr/front/foreignSpell/foreignSpellList.do?mn_id=96))
  * 한글라이즈([링크](https://hangulize.org/))


### 번역 팁

- 번역은 단어-단어수준으로 정확하지 않아도 됩니다. 오역이 없고 번역투가 없는 문장이면 됩니다. 다만, 번역시 누락은 있으면 안됩니다.
- 모호하지 않은 영어 문장이 발견되면 PR을 보내 영어 원문 수정요청을 할 수 있습니다.
- 줄 바꿈과 단락은 "원문 그대로" 유지해주세요. 영어 원문 수정사항을 병합 할 때 중요합니다. 

### 코드 내 텍스트 번역

- 주석은 번역합니다.
- 사용자 메시지와 예제 문자열도 번역합니다.
- 변수, 클래스명, 식별자(identifier)은 번역하지 않습니다.
- 번역 후 코드가 정상적으로 동작하는지 꼭 확인해주세요 :)

예시:

```js
// Example
const text = "Hello, world";
document.querySelector('.hello').innerHTML = text;
```

✅ 옳바른 번역

```js
// 예시
const text = '안녕하세요.';
document.querySelector('.hello').innerHTML = text;
```

❌ 옳바르지 않은 번역

```js
// 예시
const text = '안녕하세요.';
// ".hello"는 클래스이므로 번역하지 않습니다
document.querySelector('.안녕').innerHTML = text;
```

### 외부 링크

원문의 `https://en.wikipedia.org/wiki/JavaScript` 같은 위키피디아 링크는 한글화가 잘 되어있는 경우, 한글 위키피디아 링크로 교체할 수 있습니다.

예:

```md
[JavaScript](https://en.wikipedia.org/wiki/JavaScript) is a programming language.
```

✅ OK (en -> ko):

```md
[자바스크립트](https://ko.wikipedia.org/wiki/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8)는 프로그래밍 언어입니다.
```

MDN 링크는, 부분 번역이 진행된 링크라도 해당 언어의 링크로 교체할 수 있습니다. 번역이 전혀 진행되지 않은 링크는 링크를 교체하지 않습니다.


## 로컬에서 실행하기

본 튜토리얼을 로컬 환경에서 실행하면 번역물이 어떻게 사용자에게 보일지 바로 확인 가능합니다.

서버는 <https://github.com/javascript-tutorial/server>를 사용하여 세팅할 수 있습니다. 
