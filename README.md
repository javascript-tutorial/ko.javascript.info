# The JavaScript Tutorial

본 저장소는 [Modern JavaScript Tutorial](https://javascript.info)의 내용을 영-한 번역하기 위한 오픈소스 프로젝트입니다.

## 번역 진행 사항

(In alphabetical order):

| Language | Github | Translation leads | Translated (%) | Published |
|----------|--------|-------------------|-----------------|-----------|
| Chinese | https://github.com/xitu/javascript-tutorial-zh | @leviding | ![](http://translate-hook.javascript.info/stats/zh.svg?1) | - |
| Japanese | https://github.com/KenjiI/javascript-tutorial-ja | @KenjiI | ![](http://translate-hook.javascript.info/stats/ja.svg?1) | - |
| Russian | https://github.com/iliakan/javascript-tutorial-ru | @iliakan | * | https://learn.javascript.ru |
| Turkish | https://github.com/sahinyanlik/javascript-tutorial-tr | @sahinyanlik | ![](http://translate-hook.javascript.info/stats/tr.svg?1) | - |


만약 자신만의 번역 저장소(repository)를 만들고 싶다면 원본 저장소를 클론 한 다음, 이름을 `javascript-tutorial-...`로 바꿔주세요. 한국어의 경우 `...`에는 ko가 들어가면 됩니다. 그 후 이곳에 [이슈](https://github.com/iliakan/javascript-tutoria-en/issues/new)를 등록하여 당신의 언어가 번역 진행 사항에 등록되도록 알리면 됩니다.

## 저장소 구조

모든 장(chapter), 주제(article), 과제(task)는 각각의 폴더 안에 구성되어 있습니다.

폴더는 `N-url`형식의 이름을 가집니다. `N`은 정렬 목적으로 부여한 숫자이고 `url`은 자료의 제목을 나타내는 URL을 나타냅니다.

자료의 종류는 폴더 내의 파일을 기준으로 분류합니다.The type of the material is defined by the file inside the folder:

  - `index.md` 이/가 있는 폴더는 `장`입니다.
  - `article.md` 이/가 있는 폴더는 `주제`입니다.
  - `task.md` 이/가 있는 폴더는 `과제`입니다. (해당 과제의 해답은 같은 폴더 내에 `solution.md`으로 제공됩니다)

각 파일은 `# Main header`로 시작합니다.
