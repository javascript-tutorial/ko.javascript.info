대문자 상수는 "하드 코딩한" 값의 별칭을 만들 때 주로 사용합니다. 실행 전에 이미 값을 알고 있고, 코드에서 직접 그 값을 쓰는 경우에 사용하죠.

위 코드에서 `birthday`가 그런 경우입니다. 따라서 `birthday`는 대문자 상수로 적합합니다.

<<<<<<< HEAD
반면, `age`는 런타임에 평가됩니다. 올해의 나이와 내년의 나이는 다르죠. 상수는 코드가 실행될 때마다 바뀌지 않아야 하는 값이란 걸 아마 느끼셨을 겁니다. 이런 관점에서 보았을 때, `age`는 `birthday`보다 덜 상수스럽습니다. 런타임에 계산되죠. 따라서 `age`는 대문자 상수에 적합하지 않습니다.
=======
In contrast, `age` is evaluated in run-time. Today we have one age, a year after we'll have another one. It is constant in a sense that it does not change through the code execution. But it is a bit "less of a constant" than `birthday`: it is calculated, so we should keep the lower case for it.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74
