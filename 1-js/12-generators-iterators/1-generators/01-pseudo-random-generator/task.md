
# 의사 난수 생성기

임의의 데이터가 필요한 영역이 많습니다.

<<<<<<< HEAD
그중 하나는 테스팅입니다. 텍스트, 숫자 등 임의의 데이터가 필요할 수 있습니다.
=======
One of them is testing. We may need random data: text, numbers, etc. to test things out well.
>>>>>>> 524d59884650be539544c34f71d821432b7280fd

자바스크립트에서는 `Math.random ()`을 사용할 수 있습니다. 그러나 문제가 발생하면 정확히 동일한 데이터를 사용하여 테스트를 반복할 수 있기를 원합니다.

<<<<<<< HEAD
이를 위해 이른바 "고정값 의사 난수 생성기"가 사용됩니다. 첫 번째 값인 "고정값"을 얻은 다음, 공식을 이용해 다음 값을 생성합니다. 동일한 고정값이 동일한 결과를 생성하므로 전체 흐름을 쉽게 재현할 수 있습니다. 이를 반복하기 위해 고정값을 기억하기만 하면 됩니다.
=======
For that, so called "seeded pseudo-random generators" are used. They take a "seed", the first value, and then generate the next ones using a formula so that the same seed yields the same sequence, and hence the whole flow is easily reproducible. We only need to remember the seed to repeat it.
>>>>>>> 524d59884650be539544c34f71d821432b7280fd

다소 균일하게 분포된 값을 생성하는 공식의 예:

```
next = previous * 16807 % 2147483647
```

고정값으로 `1`을 사용하면 다음과 같습니다.
1. `16807`
2. `282475249`
3. `1622650073`
4. ...and so on...

과제는 이 공식을 이용하여 생성기를 만들고 `고정값`을 통해 생성기 함수인 `의사 난수(고정값)`를 만드는 것입니다.

예시:

```js
let generator = pseudoRandom(1);

alert(generator.next().value); // 16807
alert(generator.next().value); // 282475249
alert(generator.next().value); // 1622650073
```
