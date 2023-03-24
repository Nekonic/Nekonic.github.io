---
layout: post
title: main function error in c
categories: error
tags: error
---

오늘 해커톤에 같이 나가는 동아리 부원이 나에게 질문을 했다.
엘리스 아카데미에서 코드를 실행하면 정상적으로 작동을 하는데,
Visual Studio에서는 실행이 안된다는 것이였다.

실행이 안된 이유는 int main을 쓰지 않았기 때문이다.
왜 main을 쓰면 Visual Studio에서 오류가 생길까?

## main 함수

main 함수는 C에서 미리 정의된 키워드이자 함수다. 프로그램의 실행시작 및 종료를 담당하는 모든 C프로그램의 첫 번째 함수다.

## int main 함수와 main 함수의 차이점

int main 함수와 main 함수의 가장 큰 차이점은 리턴값에 있다. int main 함수는 int 형을 반환하는 반면, main 함수는 void main, 즉 리턴값이 없는 함수다.

## 오류가 일어나는 원인

그래서 오류가 일어나는 원인이 뭘까?  
운영체제는 반환값을 호출프로그램(shell등)에 전달한다. 일부 컴파일러(academy.elice등)는 main을 허용하지만, Visual studio를 사용한다면 main 함수 앞의 형식지정자가 없기 때문에 오류가 난다. 이를 해결하려면 main 함수 앞에 int를 붙이면 쉽게 해결된다.

## 결론

C89/C90에서는 int반환 유형이 암묵적으로 이루어져서 void main 함수를 써도 되지만, C99이상의 컴파일러를 지원하는 환경에서는 ANSI C. 즉 표준 C를 어기는 것으로 사용하지 않아야 한다. 그리고 앞으로도 표준 C를 지키기 위해서 사용을 자제하자.