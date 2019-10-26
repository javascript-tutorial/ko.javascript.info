새로 만든 문자열의 길이는 `maxlength`가 되어야 하므로, 생략 부호 `"…"`가 차지할 길이를 생각하여 함수를 만들어야 합니다.

생략 부호는 유니코드에 등록된 독립된 글자임에 유의하여 답안을 작성해야 합니다. 점 세 개가 아님에 유의하시기 바랍니다.

```js run demo
function truncate(str, maxlength) {
  return (str.length > maxlength) ?
    str.slice(0, maxlength - 1) + '…' : str;
}
```
