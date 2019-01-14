# 자바스크립트 튜토리얼

본 저장소는 [Modern JavaScript Tutorial](https://javascript.info)의 내용을 영-한 번역하기 위한 오픈소스 프로젝트입니다.

## 번역 진행 사항

(알파벳 순서):

| Language | Github | Translation leads | Translated (%) | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last&nbsp;Commit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Published |
|----------|--------|-------------------|----------------|-------------|-----------|
| Azerbaijani | [orkhan-huseyn/javascript-tutorial-az](https://github.com/orkhan-huseyn/javascript-tutorial-az) | @orkhan-huseyn | ![](http://translate-hook.javascript.info/stats/az.svg) | ![](https://img.shields.io/github/last-commit/orkhan-huseyn/javascript-tutorial-az.svg?maxAge=1800) |  |
| Chinese | [xitu/javascript-tutorial-zh](https://github.com/xitu/javascript-tutorial-zh) | @leviding | ![](http://translate-hook.javascript.info/stats/zh.svg) | ![](https://img.shields.io/github/last-commit/xitu/javascript-tutorial-zh.svg?maxAge=1800) | [zh.javascript.info](https://zh.javascript.info) |
| French | [HachemiH/javascript-tutorial-fr](https://github.com/HachemiH/javascript-tutorial-fr) | @HachemiH | ![](http://translate-hook.javascript.info/stats/fr.svg) | ![](https://img.shields.io/github/last-commit/HachemiH/javascript-tutorial-fr.svg?maxAge=3600) | |
| Japanese | [KenjiI/javascript-tutorial-ja](https://github.com/KenjiI/javascript-tutorial-ja) | @KenjiI | ![](http://translate-hook.javascript.info/stats/ja.svg) | ![](https://img.shields.io/github/last-commit/KenjiI/javascript-tutorial-ja.svg?maxAge=3600) | [ja.javascript.info](https://ja.javascript.info) |
| Korean | [Violet-Bora-Lee/javascript-tutorial-ko](https://github.com/Violet-Bora-Lee/javascript-tutorial-ko) | @Violet-Bora-Lee | ![](http://translate-hook.javascript.info/stats/ko.svg) | ![](https://img.shields.io/github/last-commit/Violet-Bora-Lee/javascript-tutorial-ko.svg?maxAge=3600) |  |
| Polish | [krzmaciek/javascript-tutorial-pl](https://github.com/krzmaciek/javascript-tutorial-pl) | @krzmaciek | ![](http://translate-hook.javascript.info/stats/pl.svg) | ![](https://img.shields.io/github/last-commit/krzmaciek/javascript-tutorial-pl.svg?maxAge=3600) |  |
| Romanian | [lighthousand/javascript-tutorial-ro](https://github.com/lighthousand/javascript-tutorial-ro) | @lighthousand | ![](http://translate-hook.javascript.info/stats/ro.svg) | ![](https://img.shields.io/github/last-commit/lighthousand/javascript-tutorial-ro.svg?maxAge=3600) |  |
| Russian | [iliakan/javascript-tutorial-ru](https://github.com/iliakan/javascript-tutorial-ru) | @iliakan | * . | ![](https://img.shields.io/github/last-commit/iliakan/javascript-tutorial-ru.svg?maxAge=3600) | [learn.javascript.ru](https://learn.javascript.ru) |
| Turkish | [sahinyanlik/javascript-tutorial-tr](https://github.com/sahinyanlik/javascript-tutorial-tr) | @sahinyanlik | ![](http://translate-hook.javascript.info/stats/tr.svg) | ![](https://img.shields.io/github/last-commit/sahinyanlik/javascript-tutorial-tr.svg?maxAge=3600) | |


만약 자신만의 번역 저장소(repository)를 만들고 싶다면 원본 저장소를 클론 한 다음, 이름을 `javascript-tutorial-...`로 바꿔주세요. 한국어의 경우 `...`에는 ko가 들어가면 됩니다. 그 후 이곳에 [이슈](https://github.com/iliakan/javascript-tutorial-en/issues)를 등록하여 당신의 언어가 번역 진행 사항에 등록되도록 알리면 됩니다.
마크다운을 지원하는 모든 에디터에서 문서를 수정할 수 있습니다. 로컬에서 서버를 띄워 번역물이 어떻게 웹페이지로 전환되는지 보고 싶다면 다음 링크를 확인해주세요. <https://github.com/iliakan/javascript-tutorial-server>

## 한국어 번역
한국어 번역은 최초 [@Yeonjj님의 저장소](https://github.com/Yeonjj/javascript-tutorial-ko)와 당 저장소가 병행하여 작업을 진행하였었습니다. 현재는 당 저장소가 한국어 번역 리파지터리로 등록되었습니다. 번역어를 제외한 다른 컨벤션들은 Yeonjj님의 저장소를 기준으로 삼고 만들었으니, 많은 분들이 이 저장소와 Yeonjj님의 저장소에서 한국어 번역에 참여해주셨으면 좋겠습니다. 당 리파지터리는 Yeonjj님 리파지터리의 번역 결과물들을 주기적으로 병합하고 있습니다.

번역 진행현황은 이 [Dashboard](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit?usp=sharing)에서 확인할 수 있습니다. 새롭게 작업을 시작하는 분들은 [이곳](https://github.com/Violet-Bora-Lee/javascript-tutorial-ko/issues)에서 이슈를 등록해주시면 번역어 시트와 Dashboard 시트의 편집 권한을 드리겠습니다. 질문이나 소통을 위해선 [카카오톡 오픈챗방](https://open.kakao.com/o/gSBnoLab)을 이용해주세요.

## 저장소 구조

모든 장(chapter), 주제(article), 과제(task)는 각각의 폴더 안에 구성되어 있습니다.

폴더는 `N-url`형식의 이름을 가집니다. `N`은 정렬 목적으로 부여한 숫자이고 `url`은 자료의 제목을 나타내는 URL을 나타냅니다.

자료의 종류는 폴더 내의 파일을 기준으로 분류합니다:

  - `index.md` 이/가 있는 폴더는 `장`입니다.
  - `article.md` 이/가 있는 폴더는 `주제`입니다.
  - `task.md` 이/가 있는 폴더는 `과제`입니다. (해당 과제의 해답은 같은 폴더 내에 `solution.md`으로 제공됩니다)

각 파일은 `# Main header`로 시작합니다.

## 번역어(번역 컨벤션)
* 경어체를 사용합니다.
* 번역어는 출판된 도서, 국립국어원의 외래어 표기법 용례, 한글라이즈 사이트를 기준으로 하겠습니다. 주 참고자료는 다음과 같습니다.
  * 프론트엔드 개발자를 위한 자바스크립트 프로그래밍([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788966260768&orderClick=LIK&Kc=))
  * 인사이드 자바스크립트([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968480652))
  * 러닝 자바스크립트([링크](https://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788968483387))
  * 국립국어원 외래어 표기법 용례 찾기([링크](http://www.korean.go.kr/front/foreignSpell/foreignSpellList.do?mn_id=96))
  * 한글라이즈([링크](https://hangulize.org/))
* 주제에서 새롭게 등장하는 키워드는 한-영 병기`(예: 프로퍼티(property))`를 하였습니다.
* 번역어는 다음 시트에서 확인할 수 있습니다([링크](https://docs.google.com/spreadsheets/d/1mxlxTwqdQwxkxrqMWqHgGT6lCKgj8HqCZ3UioQLAvL0/edit?usp=sharing)). 해당 시트를 확인하시어 번역어 통일에 힘써주시기 바랍니다. 새롭게 작업을 시작하는 분들은 [이곳](https://github.com/Violet-Bora-Lee/javascript-tutorial-ko/issues)에서 이슈를 등록해주시면 번역어 시트의 편집 권한을 드리겠습니다. 
