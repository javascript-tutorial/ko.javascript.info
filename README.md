# 자바스크립트 튜토리얼

본 저장소에선 <https://javascript.info>의 내용을 영-한 번역합니다.

## 참여 방법

### 번역 참여 방법

- [Dashboard](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=0)에서 번역 진행 상황을 확인합니다.
- 번역되지 않은 글이나, 리뷰가 필요한 글을 선택합니다.
- [Dashboard](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=0)에 본인의 깃허브 아이디와 진행 상황(Translation Status)을 업데이트합니다.
- [본 저장소](https://github.com/javascript-tutorial/ko.javascript.info)를 포크하여 번역 작업을 시작하고, 번역이 끝나면 PR(Pull Request) 합니다.

:exclamation: 권한 요청
- 처음 작업을 하는 분들은 [Dashboard](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=0) 수정 권한이 필요하니, gmail 아이디를 적은 권한 요청 게시물을 [이슈](https://github.com/Violet-Bora-Lee/javascript-tutorial-ko/issues) 페이지에 등록합니다.

👂 의사소통
- 질문이나 소통은 [카카오톡 오픈채팅방](https://open.kakao.com/o/gSBnoLab)에서 가능합니다.

번역이 진행되고 있는 언어 목록과 각 언어로의 번역률은 <https://javascript.info/translate>에서 확인할 수 있습니다.

### 작업물 확인하기
PR 전 본인의 작업물이 어떻게 사이트에 반영될지 확인하고 싶다면, <https://github.com/javascript-tutorial/server>을 이용해 로컬에 서버를 세팅해 보세요. 

### 기여자
튜토리얼에 기여하신 분들의 이름은 <https://javascript.info/about#contributors>에서 확인할 수 있습니다.

## 저장소 구조

모든 챕터(chapter), 글(article), 과제(task)는 각각의 폴더 안에 구성되어 있습니다.

폴더는 `N-url`형식의 이름을 가집니다. `N`은 정렬 목적으로 부여한 숫자이고 `url`은 해당 자료의 URL 일부를 나타냅니다.

폴더는 다음 같은 파일을 담고 있습니다.

  - `대주제(section)`의 개괄적인 설명을 담은 `index.md`
  - `글`이 저장된 `article.md`
  - `과제`를 위한 `task.md` (과제의 해답이 있다면 `solution.md`으로 제공)

각 파일은 `# Title Header`로 시작하고, 간단한 텍스트 에디터로 수정 가능한 마크다운 포멧으로 작성되었습니다.

## 번역 규칙

* 경어체를 사용합니다.
* PR 전 [맞춤법 검사기](http://speller.cs.pusan.ac.kr/)를 사용해 틀린 부분을 교정합니다. **검사기를 돌리지 않았다고 판단되는 커밋은 PR 받지 않겠습니다.** 리뷰자 역시 맞춤법 검사기를 사용해, 맞춤법을 지키고 있는지 재검사합니다. 
* 주제에서 새롭게 등장하는 키워드는 한-영 병기`(예: 프로퍼티(property), 브라우저 객체 모델(Browser Object Model, BOM))`합니다.
* [합의된 번역어](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=1401860741)로 번역합니다. 공동작업에선 번역어 통일이 매우 중요합니다.
* 등록되지 않은 새로운 용어는 번역어를 등록한 후 번역합니다.
* 번역어는 출판된 도서, 국립국어원의 외래어 표기법 용례, 한글라이즈 사이트 등을 기준으로 선정합니다. 주 참고자료는 다음과 같습니다.
  * 프론트엔드 개발자를 위한 자바스크립트 프로그래밍([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788966260768&orderClick=LIK&Kc=))
  * 인사이드 자바스크립트([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968480652))
  * 러닝 자바스크립트([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968483387))
  * 초보자를 위한 JavaScript 200제([링크](http://www.yes24.com/Product/Goods/70746749?Acode=101))
  * 국립국어원 외래어 표기법 용례 찾기([링크](http://www.korean.go.kr/front/foreignSpell/foreignSpellList.do?mn_id=96))
  * 한글라이즈([링크](https://hangulize.org/))


### 번역 팁

- 번역은 단어-단어 수준으로 정확하지 않아도 됩니다. 오역이 없고 번역투가 없는 문장이면 됩니다. 다만, 번역 시 누락은 있으면 안 됩니다.
- 문장 끝 :(콜론) 등의 영어에서만 사용되는 문장부호나 스타일은 최대한 한글화합니다.
- 모호하지 않은 영어 문장이 발견되면 PR을 보내 영어 원문 수정요청을 할 수 있습니다.
- 줄 바꿈과 단락은 "원문 그대로" 유지해주세요. 영어 원문 수정사항을 병합할 때 중요합니다.
- 충돌이 있는 경우 빠르게 수정하여 병합할 수 있도록 PR하나에 챕터 하나만 번역하길 권유 드립니다.
- 번역기 사용을 지양하는 바는 아닙니다. 다만, 번역 투가 심하거나 번역되지 않은 대명사 때문에 가독성이 떨어지는 경우는 수정을 권유하고 있습니다.
---
♥
Ilya Kantor @iliakan
