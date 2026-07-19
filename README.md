# 모던 자바스크립트 튜토리얼

본 저장소에선 <https://javascript.info>의 내용을 영-한 번역하여 한국어가 모국어인 개발자가 양질의 웹 개발 학습자료를 접할 수 있도록 하는데 목표를 두고 있습니다. 자세한 소개는 [링크](https://medium.com/@violetboralee/%EB%AA%A8%EB%8D%98-javascript-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-4338630fef35)를 참고해주세요.

### 의사소통
- [모던웹개발연구소 디스코드](https://discord.gg/ZJ6gDAS4tk)의 '모던JAVASCRIPT튜토리얼' 카테고리 내 채널로 오시면 다양한 채널이 개설되어 있습니다. `학습-qna`, `메인테이너-qna` 채널 등 목적에 맞는 채널에 오셔서 소통해 주세요.


### 진행 상황
번역이 진행되고 있는 언어 목록과 언어별 번역률은 <https://javascript.info/translate>에서 확인할 수 있습니다.

## 참여하기
본 저장소에 기여하고 싶다면 [CONTRIBUTING.md](https://github.com/javascript-tutorial/ko.javascript.info/blob/master/CONTRIBUTING.md)를 참고해 주세요.

### 번역 스킬 사용(권장)

앞으로 번역은 **[tech-translation-ko 스킬](https://github.com/Violet-Bora-Lee/tech-translation-ko)** 을 사용해 진행합니다. 이 저장소의 번역 관행(번역 커밋 전수 분석에서 추출한 문장 패턴, 용어집, 서식 규칙, 검수 체크리스트)을 스킬 하나로 옮겨 두었습니다. Claude Code 같은 AI 코딩 에이전트에 스킬을 설치하면 번역 → 구조·용어 린트(`check_translation.py`) → 셀프 리뷰 → 맞춤법 검사 순서의 워크플로우가 적용됩니다. 사람이 직접 번역할 때도 스킬 저장소의 `references/` 문서를 가이드로 활용할 수 있습니다.

### 프로젝트 정책

스킬 사용 여부와 관계없이 지켜야 하는 PR 수용 기준입니다.

* 경어체를 사용합니다.
* PR 전 [바른한글 맞춤법 검사기](https://nara-speller.co.kr/speller/)(구 부산대 검사기)를 사용해 틀린 부분을 교정합니다. **검사기를 돌리지 않았다고 판단되는 커밋은 PR 받지 않겠습니다.** 리뷰자 역시 맞춤법 검사기를 사용해, 번역자가 맞춤법을 지켜 번역했는지 확인합니다. 검사기는 대학 연구실에서 무료로 운영하므로 자동화 파이프라인엔 넣지 않고 문서당 1회 수동으로 실행합니다.
* 줄 바꿈과 단락은 '원문 그대로'를 유지합니다. 영어 원문 수정사항을 병합할 때 중요합니다. **번역 후 줄 수가 원문의 줄 수와 다른 경우는 PR 받지 않겠습니다.**
* 공백(스페이스), 큰따옴표("), 작은따옴표('), 대시(-), 백틱(\`)을 비롯한 모든 특수문자는 수정하시면 안 됩니다. **자연어만 수정(알파벳을 한글로 수정)해주세요!** [로컬 서버 세팅 방법](https://github.com/javascript-tutorial/ko.javascript.info/wiki/%EB%A1%9C%EC%BB%AC-%EC%84%9C%EB%B2%84-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0)을 참고하셔서 내가 작성한 코드(번역물)가 어떻게 반영될지 확인 후 PR 보내주세요.
* 소스 코드 내 공백 등은 원문 병합 시 충돌을 예방하기 위해 되도록 수정하지 않습니다. 자연어(주석)만 번역하도록 합니다.
* 등록되지 않은 새로운 용어는 [용어집](https://docs.google.com/spreadsheets/u/1/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=1401860741)에 용어를 등록한 후 번역합니다. 공동작업에선 번역어 통일이 매우 중요합니다.

위 기준 중 줄 수·특수문자·용어집 위반은 스킬의 린터가 자동으로 검사합니다.

잘못된 번역, 오타 및 기타 개선사항은 [이슈](https://github.com/javascript-tutorial/ko.javascript.info/issues)로 등록 부탁드립니다.

### (deprecated) 수기 번역 권고사항

아래 권고사항은 tech-translation-ko 스킬에 통합되어 더는 개별 항목으로 관리하지 않습니다. 스킬을 사용하면 번역 과정에 자동으로 적용되고, 각 항목의 최신 내용은 스킬 저장소의 `references/` 문서에서 확인할 수 있습니다.

<details>
<summary>스킬로 대체된 항목 펼쳐보기</summary>

* ~~[번역 모범 사례](https://github.com/javascript-tutorial/ko.javascript.info/wiki/%EB%B2%88%EC%97%AD-%EB%AA%A8%EB%B2%94-%EC%82%AC%EB%A1%80)와 [KIGO 번역 스타일가이드](https://drive.google.com/file/d/1p6g48TK6GwHDq-88lqTTYgptjpYNRT5d/view?usp=drive_link), [자주 하는 실수](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=579221672)를 읽어보시고 작업에 참여해주세요.~~ → 스킬 `references/principles.md`, `formatting.md`, `kigo-conventions.md`에 통합
* ~~주제에서 새롭게 등장하는 키워드는 한-영 병기`(예: 프로퍼티(property), 브라우저 객체 모델(Browser Object Model, BOM))`합니다.~~ → 스킬 `references/terminology.md`(병기는 본문 첫 등장에서 한 번, 과잉 병기 금지 규칙 포함)
* ~~[합의된 번역어](https://docs.google.com/spreadsheets/d/1fYaEI8vz26N3R2VaxrlNnk9fMQ8zIy4RpvjRp4jZd0Q/edit#gid=1401860741)로 번역합니다.~~ → 스킬 용어집(`glossary.tsv`, 768개 표제어)과 `glossary_lookup.py` 조회 도구로 통합
* ~~에러 내용은 번역하지 않습니다.~~ → 스킬 `references/formatting.md`(플랫폼이 생성하는 에러 출력은 유지, 예제가 정의하는 에러 문자열은 번역하는 경계 규칙 포함)
* ~~번역어는 출판된 도서, 국립국어원의 외래어 표기법 용례, 한글라이즈 사이트 등을 기준으로 선정합니다.~~ → 스킬 `references/terminology.md`(마이크로소프트 Language Portal, 국립국어원 용례, 참고 도서 목록 포함)
* ~~원문에는 없으나 독자의 이해를 돕기 위해 번역자가 추가하는 내용은 `(.....부가설명..... - 옮긴이)` 형태로 부가설명을 추가하도록 합니다.~~ → 스킬 `references/sentence-patterns.md`(옮긴이 주 형식과 사용 기준)
* ~~'적∙의를 보이는 것∙들'에 대한 내용은 될 수 있으면 사용하지 않습니다.([링크](https://m.blog.naver.com/ojhnews/220840570533))~~ → 스킬 `references/principles.md`(번역투 회피 규칙)와 린터 경고로 통합

</details>

## 기여자
튜토리얼 원문에 기여하신 분들은 <https://javascript.info/about#contributors>에서 확인할 수 있습니다. 한국어 번역에 기여해주신 분들은 <https://ko.javascript.info/about#contributors>에서 확인할 수 있습니다.

---
by the Modern JavaScript Tutorial Project Owner, Ilya Kantor(@iliakan)

모던 JavaScript 튜토리얼 한국어 프로젝트 오너, 이보라(@Violet-Bora-Lee)
