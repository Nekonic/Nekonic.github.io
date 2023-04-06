---
layout: post
title: 겨울 숲의 초대
categories: ps Programming_Contest
tags: ps boj Programming_Contest greedy ad_hoc
---
## 소감
대회에서 우승하기에는 아직 멀었다.  
그래도 하나라도 풀어서 좋았다.

## 문제
### [A 눈 치우기](https://www.acmicpc.net/problem/26215)
지난 밤 겨울 숲에는 눈이 많이 내렸다. 당신은 숲의 주민들을 위해 눈이 오지 않는 동안 모든 집 앞의 눈을 치우고자 한다.

당신은 1분에 한 번씩 두 집을 선택해서 두 집 앞의 눈을 각각 1만큼 치우거나, 한 집을 선택해서 그 집 앞의 눈을 1만큼 치울 수 있다.

모든 집 앞의 눈을 전부 치울 때까지 걸리는 최소 시간은 얼마일까?

#### 접근방식 1 (greedy)
단순하게 생각했다.
두 집앞의 눈을 각각 1만큼 치우는 게 가장 효율적인 방법이여서 내림차순 정렬을 하면서 배열의 0번과 1번을 각각 -1을 0이 되기 전까지 한 것을 카운팅 하면 답이 나온다.
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main(){
    int n,m,cnt=0;
    vector<int> a;
    cin >> n;
    for(int i=0; i<n; i++){
        cin >> m;
        a.push_back(m);
    }sort(a.begin(),a.end(),greater<int>());
    while (a[0]>0){
        cnt++;
        a[0]--;
        a[1]--;
        sort(a.begin(),a.end(),greater<int>());
    }if(cnt>1440)cout << -1;
    else cout << cnt;
}
```
#### Official Editorial (ad_hoc)
걸리는 최소 시간이 t라면,
한 번에 한 집의 눈을 최대 1만큼 치울 수 있으므로 t ≥ max(A) 여야 합니다.
한 번에 전체 눈을 최대 2만큼 치울 수 있으므로 t ≥ ceil(sum(A) / 2)여야 합니다.

t = max(max(A), ceil(sum(A) / 2))를 만족하는 방법은 그리디 알고리즘으로 찾을 수 있습니다.
매 분마다 눈이 가장 많이 쌓인 두 집 (또는 한 집)을 찾아 그 집들의 눈을 1씩 치우면 됩니다.

따라서 답은 max(max(A), ceil(sum(A) / 2))입니다.

Proof. 수학적 귀납법으로 증명할 수 있습니다.
- 한 집만 있는 경우에는 t = A[0] 이므로 성립합니다.
- 두 집 이상 있는 경우에는 A에서 눈이 가장 많이 쌓인 두 집의 눈을 1씩 치운다면 max(A)는 1, sum(A)는 2 감소하므로 t = max(max(A) – 1, ceil((sum(A) – 2) / 2)) + 1 = max(max(A), ceil(sum(A) / 2))가 되어 원하는 식이 성립합니다.

시간 복잡도: O(N)
그리디 전략을 시뮬레이션하는 O(1440N) 풀이도 통과합니다.