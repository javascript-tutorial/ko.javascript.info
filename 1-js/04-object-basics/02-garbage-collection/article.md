# 가비지 컬렉션(Garbage Collection)

자바스크립트에서 메모지 관리는 자동적으로 이루어지며 우리에게는 보이지 않습니다. 우리가 만드는 원시 값이 할당된 변수, 객체, 함수... 이 모든 것은 메모리를 차지합니다.

만약 어떤 것이 더 이상 필요하지 않을 땐 무슨 일이 일어날까요? 자바스크립트 엔진은 그것을 어떻게 찾아내서 삭제하는 걸까요?

## 도달 가능성(Reachability)

자바스크립트에서 메모리 관리의 주요 개념은 *도달 가능성(Reachability)*입니다.

쉽게 말해, "도달 가능한" 값들은 접근할 수 있으며 어떻게든 사용가능한 값들을 말합니다. 이 값들은 메모리에 저장되는 게 보장됩니다.

1. 본질적으로 도달가능한 값들의 기본 집합이 있습니다. 이 값들은 명백한 이유들로도 제거될 수 없습니다.

    예를 들어:

    - 현재 함수의 지역 변수와 매개 변수
    - 현재 중첩된 호출 체인에 있는 다른 함수들의 변수와 매개 변수
    - 전역 변수
    - (there are some other, internal ones as well)

    이 값들은 *roots*라고 불립니다.

2. root로부터 참조값이나 참조값의 연쇄에 의해 도달 가능하다면 그 값은 도달 가능합니다.

    예를 들어, 만약 지역 변수인 객체가 있고 이 객체는 다른 객체를 참조하는 프로퍼티를 갖고 있다면, 그 객체는 도달 가능하다고 여겨집니다. 그리고 그 객체가 참조하는 값들 역시 도달 가능합니다. 아래에서 자세한 예시를 봅시다.

자바스크립트 엔진에는 [가비지 컬렉터(garbage collector)](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))라고 불리는 백그라운드 프로세스가 있습니다. 가비지 컬렉터는 모든 객체들을 감시하며 도달 가능하지 않아진 객체를 제거합니다.

## 간단한 예제

간단한 예제를 하나 살펴봅시다.:

```js
// user는 객체에 대한 참조값을 갖고 있습니다.
let user = {
  name: "John"
};
```

![](memory-user-john.png)

이 그림에서 화살표는 객체 참조를 나타냅니다. 전역 변수(`<global>`) `"user"` 는 `{name: "John"}` (줄여서 John이라고 부르겠습니다) 이라는 객체를 참조합니다. John의 `"name"` 프로퍼티는 기본값을 저장하고 있기 때문에 객체(`Object`) 안에 적혀져 있습니다.

만약 `user` 값이 다른 값으로 덮어쓰여지면 참조값을 잃게 됩니다.:

```js
user = null;
```

![](memory-user-john-lost.png)

이제 John은 도달할 수 없게됩니다. John에 접근할 수 있는 방법은 없으며, John에 대한 참조값도 존재하지 않습니다. 가비지 컬렉터는 이 데이터를 삭제하고 메모리를 해제할 것입니다.

## 두 개의 참조값

이제 우리가 `user`의 참조값을 `admin`에 복사했다고 가정해봅시다.:

```js
// user는 객체에 대한 참조값을 갖고 있습니다.
let user = {
  name: "John"
};

*!*
let admin = user;
*/!*
```

![](memory-user-john-admin.png)

이제 우리가 이 코드를 실행한다면:
```js
user = null;
```

...전역 변수 `admin`을 통해 여전히 객체에 접근할 수 있습니다. 따라서 객체는 메모리 안에 존재합니다. 만약 `admin`도 다른 값으로 덮어쓴다면, 객체는 제거될 수 있습니다.

## 서로 연결된 객체

이제 더 복잡한 예제, family를 살펴봅시다.:

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

`marry` 함수는 두 객체에게 서로에 대한 참조값을 부여하며 두 객체를 "결혼"시킵니다. 이 함수는 두 객체를 포함한 새로운 객체를 반환합니다.

결과적으로 메모리 구조는 이렇게 됩니다.:

![](family.png)

이제 모든 객체는 접근 가능합니다.

두 참조값을 지워봅시다.:

```js
delete family.father;
delete family.mother.husband;
```

![](family-delete-refs.png)

모든 객체는 아직 접근 가능하기 때문에 두 참조값 중 하나를 지우는 것만으로는 충분하지 않습니다.

그러나 두 참조값을 모두 지우면, John은 더 이상 외부에서 들어오는 참조를 갖지 않게 됩니다.:

![](family-no-father.png)

외부로 나가는 참조는 문제 되지 않습니다. 외부에서 들어오는 참조만 객체를 도달 가능한 상태로 만듭니다. 그러므로, John은 이제 도달 가능하지 않으며 접근 불가능하게 된 John의 데이터와 함께 메모리로부터 삭제될 것입니다.

가비지 컬렉션 후의 상태입니다.:

![](family-no-father-2.png)

## 도달할 수 없는 섬

서로 연결된 객체들의 섬 전역이 도달 불가능해져 메모리로부터 삭제될 수도 있습니다.

다음 예제에서 사용되는 객체는 위 예제와 같습니다.:

```js
family = null;
```

위 코드를 실행하면 메모리 내부는 다음 상태가 됩니다.:

![](family-no-family.png)

이 예제는 도달 가능성의 개념이 얼마나 중요한지 보여줍니다.

John과 Ann은 여전히 연결되어 있으며 둘 다 외부에서 들어오는 참조를 갖고 있다는 것이 명백합니다. 하지만 이걸로 충분하지 않습니다.

앞서 `"family"` 객체가 root로부터 연결이 해제되었으므로, 이 객체에 대한 참조값은 더 이상 존재하지 않으며 섬 전체가 도달할 수 없게 되어 제거될 것입니다.

## 내부 알고리즘

가비지 컬렉션의 기본적인 알고리즘은 "mark-and-sweep"이라고 불립니다.

일반적으로 "가비지 컬렉션"은 다음 단계를 거쳐 수행됩니다.:

- 가비지 컬렉터는 roots에 접근하여 그들을 "마크"(기억) 합니다.
- 그런 다음 roots로부터의 모든 참조값에 방문하고 "마크" 합니다.
- Then it visits marked objects and marks *their* references. All visited objects are remembered, so as not to visit the same object twice in the future.
- ...And so on until there are unvisited references (reachable from the roots).
- All objects except marked ones are removed.

예를 들어, let our object structure look like this:

![](garbage-collection-1.png)

We can clearly see an "도달할 수 없는 섬" to the right side. Now let's see how "mark-and-sweep" garbage collector deals with it.

The first step marks the roots:

![](garbage-collection-2.png)

Then their references are marked:

![](garbage-collection-3.png)

...And their references, while possible:

![](garbage-collection-4.png)

Now the objects that could not be visited in the process are considered unreachable and will be removed:

![](garbage-collection-5.png)

That's the concept of how garbage collection works.

JavaScript engines apply many optimizations to make it run faster and not affect the execution.

Some of the optimizations:

- **Generational collection** -- objects are split into two sets: "new ones" and "old ones". Many  objects appear, do their job and die fast, they can be cleaned up aggressively. Those that survive for long enough, become "old" and are examined less often.
- **Incremental collection** -- if there are many objects, and we try to walk and mark the whole object set at once, it may take some time and introduce visible delays in the execution. So the engine tries to split the garbage collection into pieces. Then the pieces are executed one by one, separately. That requires some extra bookkeeping between them to track changes, but we have many tiny delays instead of a big one.
- **Idle-time collection** -- the garbage collector tries to run only while the CPU is idle, to reduce the possible effect on the execution.

There are other optimizations and flavours of garbage collection algorithms. As much as I'd like to describe them here, I have to hold off, because different engines implement different tweaks and techniques. And, what's even more important, things change as engines develop, so going deeper "in advance", without a real need is probably not worth that. Unless, of course, it is a matter of pure interest, then there will be some links for you below.

## 요약

The main things to know:

- 가비지 컬렉션은 자동으로 수행됩니다. 우리가 실행시키거나 막을 수 없습니다.
- 객체들은 도달가능한 상태일 때 메모리에 유지되어 있습니다.
- Being referenced is not the same as being reachable (from a root): a pack of interlinked objects can become unreachable as a whole.

모던 엔진은 더욱 발전된 가비지 컬렉션 알고리즘을 구현합니다.

A general book "The Garbage Collection Handbook: The Art of Automatic Memory Management" (R. Jones et al) 는 관련된 내용을 다룹니다.

만약 여러분이 로우 레벨 프로그래밍에 익숙하시다면, V8 가비지 컬렉터에 대한 더욱 자세한 내용은 이 글 [A tour of V8: Garbage Collection](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection) 에서 확인하실 수 있습니다.

[V8 blog](http://v8project.blogspot.com/) 는  also publishes articles about changes in memory management from time to time. Naturally, to learn the garbage collection, you'd better prepare by learning about V8 internals in general and read the blog of [Vyacheslav Egorov](http://mrale.ph) who worked as one of V8 engineers. I'm saying: "V8", because it is best covered with articles in the internet. For other engines, many approaches are similar, but garbage collection differs in many aspects.

In-depth knowledge of engines is good when you need low-level optimizations. It would be wise to plan that as the next step after you're familiar with the language.  
