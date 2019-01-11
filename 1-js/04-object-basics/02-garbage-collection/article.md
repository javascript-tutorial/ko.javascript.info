# 가비지 컬렉션(Garbage Collection)

자바스크립트에서 메모지 관리는 자동적으로 이루어지며 우리에게는 보이지 않습니다. 우리가 만드는 원시 값이 할당된 변수, 객체, 함수... 이 모든 것은 메모리를 차지합니다.

만약 어떤 것이 더 이상 필요하지 않을 땐 무슨 일이 일어날까요? 자바스크립트 엔진은 그것을 어떻게 찾아내서 삭제하는 걸까요?

## 도달 가능성(Reachability)

자바스크립트에서 메모리 관리의 주요 개념은 *도달 가능성(Reachability)*입니다.

쉽게 말해, "도달 가능한" 값들은 접근할 수 있으며 어떻게든 사용가능한 값들을 말합니다. 이 값들은 메모리에 저장되는 게 보장됩니다.

1. There's a base set of inherently reachable values, that cannot be deleted for obvious reasons.

    For instance:

    - 현재 함수의 지역 변수와 매개 변수
    - current chain of nested calls에 있는 다른 함수들의 변수와 매개 변수
    - 전역 변수
    - (there are some other, internal ones as well)

    These values are called *roots*.

2. Any other value is considered reachable if it's reachable from a root by a reference or by a chain of references.

    For instance, if there's an object in a local variable, and that object has a property referencing another object, that object is considered reachable. And those that it references are also reachable. Detailed examples to follow.

There's a background process in the JavaScript engine that is called [garbage collector](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)). It monitors all objects and removes those that have become unreachable.

## 간단한 예제

간단한 예제를 하나 살펴봅시다.:

```js
// user는 객체에 대한 참조를 갖고 있습니다.
let user = {
  name: "John"
};
```

![](memory-user-john.png)

이 그림에서 화살표는 객체 참조를 나타냅니다. 전역 변수(`<global>`) `"user"` 는 `{name: "John"}` (줄여서 John이라고 부르겠습니다) 이라는 객체를 참조합니다. John의 `"name"` 프로퍼티는 원시 값을 저장하고 있기 때문에 객체(`Object`) 안에 적혀 있습니다.

만약 `user` 값이 다른 값으로 덮어쓰여지면 참조를 잃게 됩니다.:

```js
user = null;
```

![](memory-user-john-lost.png)

이제 John은 도달할 수 없게됩니다. John에 접근할 수 있는 방법은 없으며, John에 대한 참조도 존재하지 않습니다. 가비지 컬렉터는 이 데이터를 버리고 메모리를 해제할 것입니다.

## Two references

이제 우리가 `user`의 참조를 `admin`에 복사했다고 가정해봅시다.:

```js
// user는 객체에 대한 참조를 갖고 있습니다.
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

`marry` 함수는 두 객체에게 서로에 대한 참조를 주면서 두 객체를 "결혼"시키며 이 두 객체를 포함한 새로운 객체를 반환합니다.

결과적으로 메모리 구조는 이렇게 됩니다.:

![](family.png)

이제 모든 객체는 접근 가능합니다.

두 참조를 지워봅시다.:

```js
delete family.father;
delete family.mother.husband;
```

![](family-delete-refs.png)

It's not enough to delete only one of these two references, because all objects would still be reachable.

But if we delete both, then we can see that John has no incoming reference any more:

![](family-no-father.png)

Outgoing references do not matter. Only incoming ones can make an object reachable. So, John is now unreachable and will be removed from the memory with all its data that also became unaccessible.

After garbage collection:

![](family-no-father-2.png)

## 도달할 수 없는 섬

It is possible that the whole island of interlinked objects becomes unreachable and is removed from the memory.

The source object is the same as above. Then:

```js
family = null;
```

The in-memory picture becomes:

![](family-no-family.png)

This example demonstrates how important the concept of reachability is.

It's obvious that John and Ann are still linked, both have incoming references. But that's not enough.

The former `"family"` object has been unlinked from the root, there's no reference to it any more, so the whole island becomes unreachable and will be removed.

## Internal algorithms

The basic garbage collection algorithm is called "mark-and-sweep".

The following "garbage collection" steps are regularly performed:

- The garbage collector takes roots and "marks" (remembers) them.
- Then it visits and "marks" all references from them.
- Then it visits marked objects and marks *their* references. All visited objects are remembered, so as not to visit the same object twice in the future.
- ...And so on until there are unvisited references (reachable from the roots).
- All objects except marked ones are removed.

For instance, let our object structure look like this:

![](garbage-collection-1.png)

We can clearly see an "unreachable island" to the right side. Now let's see how "mark-and-sweep" garbage collector deals with it.

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

- Garbage collection is performed automatically. We cannot force or prevent it.
- Objects are retained in memory while they are reachable.
- Being referenced is not the same as being reachable (from a root): a pack of interlinked objects can become unreachable as a whole.

Modern engines implement advanced algorithms of garbage collection.

A general book "The Garbage Collection Handbook: The Art of Automatic Memory Management" (R. Jones et al) covers some of them.

If you are familiar with low-level programming, the more detailed information about V8 garbage collector is in the article [A tour of V8: Garbage Collection](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection).

[V8 blog](http://v8project.blogspot.com/) also publishes articles about changes in memory management from time to time. Naturally, to learn the garbage collection, you'd better prepare by learning about V8 internals in general and read the blog of [Vyacheslav Egorov](http://mrale.ph) who worked as one of V8 engineers. I'm saying: "V8", because it is best covered with articles in the internet. For other engines, many approaches are similar, but garbage collection differs in many aspects.

In-depth knowledge of engines is good when you need low-level optimizations. It would be wise to plan that as the next step after you're familiar with the language.  
