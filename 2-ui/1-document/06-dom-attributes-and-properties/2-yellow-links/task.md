importance: 3

---

# 외부 링크를 주황색으로 만들기

`style` 프로퍼티를 변경해 모든 외부 링크를 주황색으로 만들어 보세요.

외부 링크가 되기 위한 조건은 아래와 같습니다.
- `href`에 `://`가 포함되어 있어야 합니다.
- 하지만 `http://internal.com`으로 시작하지 않아야 합니다.

예시:

```html run
<a name="list">the list</a>
<ul>
  <li><a href="http://google.com">http://google.com</a></li>
  <li><a href="/tutorial">/tutorial.html</a></li>
  <li><a href="local/path">local/path</a></li>
  <li><a href="ftp://ftp.com/my.zip">ftp://ftp.com/my.zip</a></li>
  <li><a href="http://nodejs.org">http://nodejs.org</a></li>
  <li><a href="http://internal.com/test">http://internal.com/test</a></li>
</ul>

<script>
  // setting style for a single link
  let link = document.querySelector('a');
  link.style.color = 'orange';
</script>
```

결과:

[iframe border=1 height=180 src="solution"]
