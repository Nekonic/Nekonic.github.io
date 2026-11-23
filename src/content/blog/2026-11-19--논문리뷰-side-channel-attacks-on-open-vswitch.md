---
title: "[논문리뷰]Side-Channel Attacks on Open vSwitch"
date: 2026-11-21
categories: ["[HSKF]논문/컨퍼런스"]
tags: ["cloud", "network"]
---

# 1. 등장 배경 및 문제 정의
## 1.1 논문 선정 이유

OpenStack에서 네트워크를 담당하는 Neutron은 OVN을 백엔드로 쓰고, OVN은 OVS 위에서 동작한다. 클라우드의 모든 VM 트래픽이 결국 OVS를 거친다는 뜻이다.  
직접 OpenStack을 운영하면서 이 OVS를 통해 어떤 공격이 가능한지 궁금해져 이 논문을 골랐다.

## 1.2 논문이 다루는 문제

OVS는 패킷 처리를 빠르게 하려고 microflow cache와 megaflow cache라는 두 단계의 소프트웨어 캐시를 쓴다.  
논문은 이 캐시를 같은 서버의 모든 VM이 공유한다는 점에 주목해, 캐시 hit/miss에 따른 응답 시간 차이를 원격에서 측정하면 다른 사용자의 정보를 알아낼 수 있는지를 다룬다.  
저자들은 이 방법으로 VM 간 몰래 통신, 피해자의 IP·포트 복구, 피해자의 패킷 레이트 추정을 해냈다.

## 1.3 왜 이 문제가 중요한가

클라우드가 커질수록 VM들을 연결하는 가상 네트워크의 성능이 중요해지고, OVS 같은 가상 스위치가 그 역할을 맡는다.  
클라우드 환경에서는 여러 사용자가 네트워크, 컴퓨팅, 스토리지 자원을 공유한다.  
자원 공유는 효율을 높이지만, 그만큼 다른 사용자에게 정보가 새어 나갈 수 있는 통로도 생긴다.  
이 논문의 공격자는 피해자 서버에 VM을 띄우지 않고도, 피해자와 같은 OVS를 쓰는 공개 서비스(예: 웹 서버, Memcached 등)에 요청만 보내면 된다. 공격 조건이 이 정도로 낮다는 점에서 중요하다.

## 1.4 기존 연구의 한계

기존 OVS 보안 연구는 대량의 flow로 성능을 떨어뜨리는 DoS 공격(tuple space explosion, 관련 CVE)에만 집중했다.  
원격 사이드채널 연구(NetSpectre, NetCAT 등)는 CPU 캐시, DDIO 같은 하드웨어를 대상으로 했고, OVS 같은 소프트웨어 스위치의 캐시는 보안 관점에서의 분석이 거의 없었다.  
SDN 규칙의 hit/miss 타이밍을 이용한 기존 공격도 있었지만, 특정 flow가 발생했는지 여부만 알 수 있어서 정밀도가 낮았다.

# 2. 저자들이 제안한 핵심 접근 방식

## 2.1 Side-Channel Attack

부채널 공격은 시스템의 의도하지 않은 동작을 이용해 중요한 정보를 유추하는 공격이다.  
부채널에는 전력 소비, 전자기 신호, 타이밍 차이 등이 있는데, 이 논문은 타이밍 기반 부채널을 다룬다.

### Prime+Probe

Prime+Probe는 가장 잘 알려진 캐시 기반 부채널 공격 중 하나다.

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-4-35-13-mwsyb30a.png)

1. 공격자가 대상 캐시 셋을 자신의 데이터로 채운다(Prime).
2. 피해자가 같은 캐시 셋에 접근하면 공격자의 데이터가 쫓겨난다.
3. 공격자가 같은 캐시 셋에 다시 접근해 시간을 잰다(Probe).
   - 시간이 길면: 공격자 데이터가 쫓겨났다 → 피해자가 접근했다.
   - 시간이 짧으면: 공격자 데이터가 남아 있다 → 피해자가 접근하지 않았다.

이 타이밍 차이로 공격자는 피해자가 해당 캐시 셋에 접근했는지 알 수 있다.


## 2.2 OVS의 Flow Caching

OVS는 VM과 컨테이너를 연결하는 가상 스위치이고, 여러 테넌트가 하나의 OVS를 같이 쓴다. 그래서 부채널 공격의 대상이 될 수 있다.  

OVS는 패킷 처리를 빠르게 하려고 두 단계의 flow 캐시를 쓴다. 패킷이 도착하면 먼저 Microflow cache를 조회하고, hit면 바로 동작을 실행한다. miss면 Megaflow cache를, 여기서도 miss면 OpenFlow 테이블을 조회한다. 조회가 끝나면 결과를 캐시에 다시 넣어 다음 패킷을 빠르게 처리한다.

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-4-33-35-mwsy8zob.png)


### Microflow Cache

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-5-05-17-mwszdqt9.png)

패킷 헤더의 5개 필드(출발지·목적지 IP, 출발지·목적지 포트, 프로토콜)로 해시를 만들어 칸을 정하는 해시 테이블이다.  
hit면 저장된 엔트리를 바로 쓰고, miss면 새 flow를 해당 칸에 넣는다. 그 칸에 이미 다른 flow가 있으면(충돌) 기존 것을 덮어쓴다.  

### Megaflow Cache

여러 개의 subtable로 이루어져 있고, 패킷이 오면 일치하는 엔트리를 찾을 때까지 subtable을 순서대로 조회한다. 그래서 조회 시간은 몇 개의 subtable을 거쳤는지에 따라 달라진다.  
OVS는 주기적으로 접근 빈도를 기준으로 subtable을 재정렬해 자주 쓰이는 것을 앞으로 옮긴다. 실제로 뒤쪽 subtable일수록 지연 시간이 일정하게 늘어나서, 지연 시간만 재도 subtable 순서를 알 수 있다.

## 2.3 Attack Primitive

공격 프리미티브(Attack Primitive)는 공격을 구성하는 기본 요소로, 공격에 이용할 수 있는 시스템의 성질을 말한다.  
저자들은 앞의 특성에서 프리미티브 3가지를 찾았다.

1. **지연 시간 차이**: 캐시 hit와 miss의 지연 시간이 구분된다.
2. **Microflow 해시 충돌**: 해시가 헤더에서 나오므로, 충돌을 관찰하면 헤더 정보를 알 수 있다.
3. **Megaflow subtable 순서**: 조회 시간이 subtable 순서에 따라 달라지므로, 트래픽 레이트 정보가 드러난다.


## 2.4 공격 모델

공격자와 피해자는 직접 연결되어 있지 않아서 서로 통신할 수 없다. 공격자는 피해자와 같은 서버에서 돌아가는 공개 서비스에만 접근할 수 있다.  
따라서 공격자와 피해자 사이에 공유되는 자원은 OVS 하나뿐이고, 모든 공격은 OVS를 통해 새어 나오는 정보를 이용한다.

## 2.5 세 가지 공격

### Remote Covert Channel

> 캐시 hit/miss에 따른 응답 속도 차이를 이용해 데이터를 은밀하게 주고받는 공격이다.

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-7-51-20-mwt5begv.png)

송신자는 1을 보낼 때 패킷을 보내 수신자의 캐시 엔트리를 쫓아내고, 0을 보낼 때는 아무것도 하지 않는다.  
수신자는 자기 엔트리의 RTT를 재서, 느리면(miss) 1, 빠르면(hit) 0으로 읽는다.  
두 사람은 직접 연결 없이 OVS 캐시만으로 통신한다.

### Remote Packet Header Recovery Attack

> 캐시 해시 충돌을 이용해 피해자의 출발지 IP와 포트를 알아내는 공격이다.

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-7-50-40-mwt5amtv.png)

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-7-52-13-mwt5cczh.png)


microflow cache는 패킷 헤더를 해시해서 저장할 칸을 정한다.  
공격자는 모든 칸을 자기 패킷으로 채운 뒤, 피해자 때문에 쫓겨난 칸을 RTT로 찾는다.  
그 칸에 들어갈 수 있는 IP·포트 조합을 브루트포스로 전부 계산해서 피해자의 헤더를 복구한다.

### Remote Packet Rate Monitoring Attack

> 캐시 subtable 순서를 이용해 피해자가 얼마나 자주 통신하는지 알아내는 공격이다.

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-7-52-55-mwt5da4w.png)

megaflow cache는 자주 쓰이는 subtable을 앞으로 옮기고, 앞에 있을수록 응답이 빠르다.  
공격자는 이 성질을 이용해 피해자의 레이트를 기준선 사이에 끼워 넣는 방식으로 잰다.  

![](/assets/images/posts/2026-11-19--논문리뷰-side-channel-attacks-on-open-vswitch/2026-11-23-7-58-32-mwt5kgxj.png)

#### 기준선 만들기 (Figure 18)

공격자는 subtable 4개(Th 1-4)에 각각 초당 4, 3, 2, 1개씩 패킷을 보내 레이트 순서대로 줄을 세운다.  
피해자가 초당 2.5개를 보내면, 재정렬 후 피해자 subtable은 Th 2(3개)와 Th 3(2개) 사이에 들어간다.  
공격자는 RTT로 이 위치를 확인하고 피해자의 레이트를 "초당 2-3개"로 추정한다.  
기준 사이의 "…"는 RTT 차이를 벌리기 위해 끼워 넣은 padding subtable이다.

#### 기준선 조정하기 (Figure 19)

피해자 레이트가 Th 1보다 높으면 기준을 2배로 올리고, Th 4보다 낮으면 절반으로 내린다.  
조정은 재정렬 주기(약 1초)마다 일어나기 때문에, 레이트가 급변하면 따라잡는 동안 오차가 생긴다.


# 3. 

# 4. 느낀 점과 앞으로 할 것