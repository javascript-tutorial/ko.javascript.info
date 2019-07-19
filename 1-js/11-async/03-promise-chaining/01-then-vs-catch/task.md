# 프라미스: then vs. catch

아래 두 코드 조각을 보세요. 두 코드는 동일하게 동작할까요? 모든 상황을 고려하여 두 코드 조각이 동일하게 동작할지 아닐지를 판단해 보세요.

```js
promise.then(f1).catch(f2);
```

비교하기

```js
promise.then(f1, f2);
```
