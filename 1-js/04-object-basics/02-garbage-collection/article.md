# 가비지 컬렉션

자바스크립트는 눈에 보이지 않는 곳에서 메모리 관리를 수행합니다.

원시값, 객체, 함수 등 우리가 만드는 모든 것은 메모리를 차지합니다. 그렇다면 더는 쓸모 없어지게 된 것들은 어떻게 처리될까요? 지금부턴 자바스크립트 엔진이 어떻게 필요 없는 것을 찾아내 삭제하는지 알아보겠습니다.

## 가지비 컬렉션 기준

자바스크립트는 *도달 가능성(reachability)* 이라는 개념을 사용해 메모리 관리를 수행합니다.

"도달 가능한(reachable)" 값은 쉽게 말해 어떻게든 접근하거나 사용할 수 있는 값을 말합니다. 도달 가능한 값은 메모리에서 삭제되지 않습니다.

1. 아래 소개해 드릴 값들은 그 태생부터 도달 가능하기 때문에, 명백한 이유 없이 삭제되지 않습니다.

    예시:

    - 현재 함수의 지역 변수와 매개변수
    - 중첩 함수 내 값 중, 관련 외부 함수의 변수나 매개변수와 연관이 있는 값
    - 전역 변수
    - 기타...

    위와 같은 값을 *루트(root)* 라고 부릅니다.

2. 루트가 참조하는 값이나 체이닝으로 루트에서 참조할 수 있는 값은 도달 가능한 값이 됩니다.

    지역 변수에 객체가 저장되어있다고 가정해 봅시다. 이 객체의 프로퍼티가 또 다른 객체를 참조하고 있다면, 프로퍼티가 참조하는 객체는 도달 가능한 값이 됩니다. 이 객체가 참조하는 다른 모든 것들도 도달 가능하다고 여겨지죠. 자세한 예시는 아래에서 살펴보도록 하겠습니다.

자바스크립트 엔진 내에선 [가비지 컬렉터(garbage collector)](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))가 끊임없이 동작합니다. 가비지 컬렉터는 모든 객체를 모니터링하고, 객체가 도달할 수 없는 상태가 되면 이를 삭제합니다.

## 간단한 예시

간단한 예시를 하나 살펴봅시다.

```js
// user엔 객체 참조 값이 저장됩니다.
let user = {
  name: "John"
};
```

![](memory-user-john.svg)

이 그림에서 화살표는 객체 참조를 나타냅니다. 전역 변수 `"user"`는 `{name: "John"}` (줄여서 John)이라는 객체를 참조합니다. John의 `"name"` 프로퍼티는 원시값을 저장하고 있기 때문에 객체(`Object`) 안에 표현했습니다.

`user`의 값을 다른 값으로 덮어 쓰게 되면 기존 참조(화살표)는 사라집니다.

```js
user = null;
```

![](memory-user-john-lost.svg)

이제 John은 도달할 수 없는 상태가 되었습니다. John에 접근할 방법도, John을 참조하는 것도 모두 사라졌죠. 가비지 컬렉터는 이제 John에 저장된 데이터를 삭제하고, John을 메모리에서 삭제합니다.

## 참조 두 개

`user`에 저장된 참조 값을 `admin`에 복사해봅시다.

```js
// user엔 객체 참조 값이 저장됩니다.
let user = {
  name: "John"
};

*!*
let admin = user;
*/!*
```

![](memory-user-john-admin.svg)

그리고 위에서 한것 처럼 `user`의 값을 다른 값으로 덮어써 봅시다.
```js
user = null;
```

전역 변수 `admin`을 통해 여전히 객체 John에 접근할 수 있기 때문에 John은 메모리에서 삭제되지 않습니다. 이 상태에서 `admin`을 다른 값(null 등)으로 덮어쓴다면 John은 메모리에서 삭제될 수 있습니다.

## 연결된 객체

이제 가족관계와 관련된 좀 더 복잡한 예시를 살펴봅시다.

```js
function marry(man, woman) {
  woman.husband = man;
  man.wife = woman;

  return {
    father: man,
    mother: woman
  }
}

let family = marry({
  name: "John"
}, {
  name: "Ann"
});
```

함수 `marry`는 매개변수로 받은 두 객체를 서로 참조하게 하면서 "결혼"시켜주고, 부부 관계가 된 두 객체를 포함하는 새로운 객체를 반환합니다.

메모리 구조는 아래와 같이 나타낼 수 있겠죠.

![](family.svg)

지금은 모든 객체가 도달 가능한 상태입니다.

이제 참조 두 개를 지워보겠습니다.

```js
delete family.father;
delete family.mother.husband;
```

![](family-delete-refs.svg)

참조를 하나만 지웠다면, 모든 객체가 여전히 도달 가능한 상태였을 겁니다.

하지만 참조 두 개를 지우면 John으로 들어오는 참조(화살표)는 모두 사라져 John은 도달 가능한 상태에서 벗어납니다.

![](family-no-father.svg)

외부로 나가는 참조는 도달 가능한 상태에 영향을 주지 않습니다. 외부에서 들어오는 참조만이 도달 가능한 상태에 영향을 줍니다. John은 이제 도달 가능한 상태가 아니기 때문에 메모리에서 제거됩니다. John에 저장된 데이터(프로퍼티) 역시 메모리에서 사라지죠. 

가비지 컬렉션 후 메모리 구조는 아래와 같습니다.

![](family-no-father-2.svg)

## 도달할 수 없는 섬

객체들이 연결되어 섬 같은 구조를 만드는데, 이 섬에 도달할 방법이 없는 경우, 섬을 구성하는 객체 모두는 메모리에서 삭제됩니다.

근원 객체 `family`가 아무것도 참조하지 않도록 해 봅시다.

```js
family = null;
```

이제 메모리 내부 상태는 다음과 같아집니다.

![](family-no-family.svg)

도달할 수 없는 섬 예제는 도달 가능성이라는 개념이 얼마나 중요한지 보여줍니다.

John과 Ann은 여전히 서로를 참조하고 있고, 두 객체 모두 외부에서 들어오는 참조를 갖고 있지만, 이것만으로는 충분하지 않다는걸 보여주죠.

 `"family"` 객체와 루트의 연결이 해제되면 이 객체에 대한 참조가 사라집니다. 섬 전체는 도달할 수 없는 상태가 되어 섬을 구성하는 객체 모두는 메모리에서 제거되죠.

## 내부 알고리즘

"mark-and-sweep"이라 불리는 가비지 컬렉션 기본 알고리즘에 대해 알아봅시다.

"가비지 컬렉션"은 대개 다음 단계를 거쳐 수행됩니다.

- 가비지 컬렉터는 루트(root) 정보를 수집하고 이를 "mark(기억)" 합니다.
- 루트가 참조하고 있는 모든 객체를 방문하고 "mark" 합니다.
- 마크된 모든 객체에 방문하고 *그 객체들이* 참조하는 객체도 mark 합니다. 한번 방문한 객체는 다 기억해 놓기 때문에 
같은 객체를 다시 방문하는 일은 없습니다.
- ...And so on until every reachable (from the roots) references are visited.
- 마크되지 않은 모든 객체를 메모리에서 삭제합니다.

다음과 같은 객체 구조가 있다고 해봅시다.

![](garbage-collection-1.svg)

오른편에 "도달할 수 없는 섬"이 보이네요. 이제 가비지 컬렉터의 "mark-and-sweep" 알고리즘이 이것을 어떻게 처리하는지 살펴봅시다.

첫 번째 단계에선 루트를 mark 합니다.

![](garbage-collection-2.svg)

이후 루트가 참조하고 있는 것들을 mark 합니다.

![](garbage-collection-3.svg)

가능할 때까지 mark 한 객체가 참조하는 객체를 계속해서 mark 합니다.

![](garbage-collection-4.svg)

이 과정을 거치면서 방문할 수 없었던 객체를 메모리에서 삭제합니다.

![](garbage-collection-5.svg)

We can also imagine the process as spilling a huge bucket of paint from the roots, that flows through all references and marks all reachable objects. The unmarked ones are then removed.

That's the concept of how garbage collection works. JavaScript engines apply many optimizations to make it run faster and not affect the execution.

최적화 예시:

- **Generational collection(세대별 수집)** -- 객체를 "새로운 객체", "오래된 객체" 두 집합으로 나눕니다. 상당수의 객체는 생성 이후 제 역할을 빠르게 수행해 금방 쓸모가 없어지는데, 이런 객체를 "새로운 객체"로 구분합니다. 가비지 컬렉터는 이런 객체를 메모리에서 공격적으로 제거합니다. 일정 시간 이상 동안 살아남은 객체는 "오래된 객체"로 분류하고, 가비지 컬렉터가 덜 검사하도록 합니다.
- **Incremental collection(점진적 수집)** -- 방문 해야 할 객체가 많은 상황에서 모든 객체를 한 번에 방문하고 mark 하게 되면 시간이 많이 소모됩니다. 실행 속도도 눈에 띄게 느려지죠. 자바스크립트 엔진은 이런 현상을 개선하기 위해 가비지 컬렉션을 여러 부분으로 분리한 다음, 각 부분을 별도로 수행합니다. 작업을 분리하고, 변경 사항을 추적하려면 추가 작업이 필요하지만, 긴 지연을 짧은 지연 여러개로 분산시킬 수 있다는 장점이 있습니다.
- **Idle-time collection(유휴 시간 수집)** -- 가비지 컬렉터는 실행에 주는 영향을 최소화하기 위해 CPU가 유휴 상태일 때에만 가비지 컬렉션을 실행합니다.

There exist other optimizations and flavours of garbage collection algorithms. As much as I'd like to describe them here, I have to hold off, because different engines implement different tweaks and techniques. And, what's even more important, things change as engines develop, so studying deeper "in advance", without a real need is probably not worth that. Unless, of course, it is a matter of pure interest, then there will be some links for you below.

## 요약

지금까지 알아본 내용을 요약해 봅시다.

- 가비지 컬렉션은 엔진이 자동으로 수행하므로 개발자는 이를 억지로 실행하거나 막을 수 없습니다.
- 객체는 도달 가능한 상태일 때 메모리에 남습니다.
- 참조된다고 해서 도달 가능한 것은 아닙니다. 서로 연결된 객체들도 도달 불가능할 수 있습니다.

모던 자바스크립트 엔진은 좀 더 발전한 가비지 컬렉션 알고리즘을 사용합니다.

어떤 알고리즘을 사용하는지 궁금하다면 도서, "The Garbage Collection Handbook: The Art of Automatic Memory Management" (R. Jones et al) 를 참고하시기 바랍니다.

저 수준(low-level) 프로그래밍에 익숙하다면, [A tour of V8: Garbage Collection](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection)을 읽어보세요. V8 가비지 컬렉터에 대한 자세한 내용을 확인해 볼 수 있습니다.

[V8 공식 블로그](https://v8.dev/)에도 메모리 관리 방법 변화에 대한 내용을 기재합니다. 가비지 컬렉션을 깊이 파고들려면 V8 내부구조를 공부하거나 V8 엔지니어로 일했던 [Vyacheslav Egorov](http://mrale.ph)의 블로그를 읽는 것도 좋습니다. 여러 엔진 중 "V8" 엔진을 언급하는 이유는 인터넷에서 관련 글을 쉽게 찾을 수 있기 때문입니다. V8과 타 엔진들은 동작 방법이 비슷한데, 가비지 컬렉션 동작 방식에는 많은 차이가 있습니다.

저 수준 최적화가 필요한 상황이라면, 엔진에 대한 조예가 깊어야 합니다. 먼저 자바스크립트에 익숙해진 후에 엔진에 대해 학습하는 것을 추천해 드립니다.