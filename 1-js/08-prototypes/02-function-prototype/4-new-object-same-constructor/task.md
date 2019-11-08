importance: 5 
2 2    
 
3 3    --- 
4 4    
 
5    -# Create an object with the same constructor 
 5   +# 동일한 생성자 함수로 객체 만들기 
6 6    
 
7    -Imagine, we have an arbitrary object `obj`, created by a constructor function -- we don't know which one, but we'd like to create a new object using it. 
 7   +생성자 함수가 하나 있고, 이 생성자 함수를 사용해 만든 임의의 객체 `obj`가 있다고 가정해봅시다. 지금은 이 생성자 함수를 사용해 새로운 객체를 만들어야하는 상황입니다.   
8 8    
 
9    -Can we do it like that? 
 9   +정체를 모르는 생성자 함수를 사용해 새로운 객체를 만드는게 가능할까요? 
10 10    
 
11 11    ```js 
12 12    let obj2 = new obj.constructor(); 
13 13    ``` 
14 14    
 
15    -Give an example of a constructor function for `obj` which lets such code work right. And an example that makes it work wrong. 
 15   +위와 같은 코드를 사용해 객체를 만들 수 있게 해주는 생성자 함수를 작성해보세요. 여기에 더하여 위와 같은 코드가 동작하지 않도록 하는 예시도 하나 만들어보세요. 
