---
layout: post
title: 알고리즘 강의 - 3 [알고리즘의 정당성과 증명]
categories: Algorithm
tags: ps Algorithm
---

## 서론
A라는 문제에 대해서 B라는 결과값을 나타내는 알고리즘 R이 가능한 모든 입력에 대해 정확하게 동작할까요? 그렇다면 그 사실을 증명할 수 있을까요?  

## 수학적 귀납법(Mathematical Induction)
수학적 귀납법은 알고리즘이 문제를 해결하는 과정 안에 있는가를 증명하는 방법입니다.  
먼저 알고리즘이 일부 입력에서 올바른 결과를 출력하는 것을 보이고, 그 다음으로 입력이 올바르다면 알고리즘이 올바른 결과를 출력하는 것을 증명합니다. 

[문제](https://www.acmicpc.net/problem/8394)  
예를 들어, 악수를 하는 방법에 대해 우리는 다음과 같은 사실을 안다고 가정한다.  
1. 모든 사람은 직사각형 탁자 하나의 한 면에 앉아있다.  
2. 각 사람들은 자신의 왼쪽이나 오른쪽에 있는 사람들과 악수를 할 수 있다(안 할 수도 있다).  
3. 각 사람들은 자신의 자리를 벗어날 수 없다.

증명을 하는 방법은 다음과 같다.
1. 단계 나누기: 증명하고 싶은 사실을 여러단계로 나눈다.  
    - 두사람은 악수를 할 수 있다. 

2. 첫 단계 증명: 첫 단계에서 증명하고 싶은 내용이 성립함을 보인다.  
    - 사람 i가 악수를 하는 것을 $d(i)$라고 하자.  
    사람이 한명이면 악수를 할 수 없기 때문에 $d(1)=1$이 된다.  
    사람이 두명이면 악수를 하거나 안하거나 2개의 경우가 있기 떄문에 $d(2)=2$이 된다.  

3. 귀납 증명: 첫 단계에서 증명하고 싶은 내용이 성립한다면, 다음단계도 성립함을 보인다.  
    - 사람이 $i(i>2)$명이면 $d(i)=d(i-1)+d(i-2)$가 성립한다.  
    - 사람이 $k(k=i)$명이면 $d(k+1)=d(k)+d(k-1)=(d(k-1)+d(k-2))+d(k-1)=d(k-1)2+d(k-2)1$가 성립한다.  

## 반복문 불변식(loop invariant)
반복문 불변식은 귀납법으로 알고리즘의 정당성을 증명하는 방법이다.  
반복문이 도는 과정이 반복될때 원하는 답으로 가는지를 보인다.  

중요한 것 3가지.
1. 반복문 진입시에 불변식이 성립함을 보인다.  
2. 반복문 내용이 불변식을 깨뜨리지 않음을 보인다.  
3. 반복문 종료시에 불변식이 성립하면 항상 정답을 구했음을 보인다.  


[문제](https://www.acmicpc.net/problem/2003)
```cpp
//결과: 부분수열의 수들의 합이 M이 되는 경우의 수를 알 수 있다.
#include <bits/stdc++.h>
using namespace std;
int main(){
    long long n,m,a[10001],s=0,e=0,cnt=0;
    cin >> n >> m;
    for(int i=1; i<=n; i++){
        cin >> a[i];
        a[i]+=a[i-1];
    }
    //반복문 불변식 1. e<=n
    //반복문 불변식 2. a[e]-a[s]<=m<=a[e]
    //불변식은 여기서 성립
    while(e<=n){
        if(a[e]-a[s]<=m){
            if(a[e]-a[s]==m)cnt++;
            e++;
        }else s++;
        //불변식은 여기서도 성립
    }cout << cnt;
}
```

1. 초기 조건: 반복문의 시작조건이 성립함
    - 불변식 1: while문이 시작할 때 s,e의 값은 0으로 초기화 된 상태이다.  
2. 유지 조건: 반복문 내부가 불변식을 깨뜨리지 않음
    - 불변식 2: a[e]-a[s]는 항상 a[e]보다 클 수 없기 때문에  
    e와 s가 같아도 불변식 2도 항상 성립한다.


## 귀류법(Proof by contradiction)
1. 증명하려는 명제가 거짓이라고 가정한다.
2. 이 가정을 사용하여 모순을 이끌어낸다(즉, 가정이 분명히 거짓이거나 불가능한 것으로 이어진다는 것을 보여준다).
3. 원래 진술이 참이어야 한다는 결론을 내린다.

## 비둘기집의 원리(Pigeonhole principle)
비둘기집의 원리는 n+1개의 물건을 n개의 상자에 넣을 때 적어도 어느 한 상자에는 두 개 이상의 물건이 들어 있다는 원리를 말한다.

## 참고자료
알고리즘 문제 해결 전략(구종만)