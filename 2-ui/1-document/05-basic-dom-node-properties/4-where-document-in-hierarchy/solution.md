
`document` 노드가 어떤 클래스에 속해있는지는 아래와 같은 스크립트를 통해 확인할 수 있습니다.

```js run
alert(document); // [object HTMLDocument]
```

아래 스크립트로도 확인할 수 있습니다.

```js run
alert(document.constructor.name); // HTMLDocument
```

살펴본 바와 같이 `document`는 `HTMLDocument` 클래스의 인스턴스입니다.

그렇다면 `HTMLDocument` 클래스는 DOM 계층 구조에서 어디에 있을까요?

명세서를 확인하면 알 수 있긴 하지만, 직접 만든 코드를 사용하면 위치를 더 빨리 알아낼 수 있습니다.

`__proto__`를 사용해 프로토타입 체인을 거슬러 올라가 봅시다.

아시다시피 클래스의 메서드는 생성자의 `prototype`에 구현되어있습니다. `document`의 메서드는 `HTMLDocument.prototype`에 구현되어 있죠.  

여기에 더하여 `prototype` 안에는 생성자 함수의 참조 역시 저장되어 있습니다. 이를 확인해 봅시다.

```js run
alert(HTMLDocument.prototype.constructor === HTMLDocument); // true
```

클래스 이름을 얻으려면 `constructor.name`를 사용하면 됩니다. `Node` 클래스를 만날 때까지 `document`의 프로토타입 체인 전체를 거슬러 올라가 보겠습니다.  

```js run
alert(HTMLDocument.prototype.constructor.name); // HTMLDocument
alert(HTMLDocument.prototype.__proto__.constructor.name); // Document
alert(HTMLDocument.prototype.__proto__.__proto__.constructor.name); // Node
```

위와 같은 코드를 사용해 계층 구조를 파악할 수 있습니다.

이 외에도 개발자 도구에서 `console.dir(document)`를 사용해 객체를 검사하고, `__proto__`에 저장된 정보를 통해 이름을 알아낼 수도 있습니다. 브라우저 콘솔 내부에서 자동으로 `constructor`의 이름을 추출하기 때문입니다.  
