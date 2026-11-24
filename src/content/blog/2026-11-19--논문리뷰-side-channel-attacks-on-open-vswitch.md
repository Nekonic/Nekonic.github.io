---
title: "[논문리뷰]Side-Channel Attacks on Open vSwitch"
date: 2026-11-21
categories: ["[HSKF]논문/컨퍼런스", "Security", "Network"]
tags: ["paper_review", "usenix", "side_channel", "ovs", "openstack", "cloud", "network"]
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

패킷 헤더의 5개 필드(출발지,목적지 IP, 출발지,목적지 포트, 프로토콜)로 해시를 만들어 칸을 정하는 해시 테이블이다.  
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


# 3. 실험 결과와 실제 성과, 혹은 드러난 한계

## 3.1 실험 설정

- 네트워크: 서버 2대를 1Gbps 스위치 하나로 연결한 1-hop 네트워크 (외부와 물리적으로 분리)
- 서버: Intel Xeon Cascade Lake 24코어, 96GB 메모리, Intel I210 1Gbps NIC
- 소프트웨어: Ubuntu 22.04, OVS v2.17.9 + DPDK datapath
- 서비스: VM 안의 Memcached (GET 요청으로 RTT 측정)
- OVS 규칙: ClassBench-ng로 생성, megaflow subtable 40개
- 노이즈: UNSW-NB15 트레이스 재생 (낮음 초당 40패킷, 높음 초당 150패킷)

OpenStack이나 OVN 없이 OVS만 단독으로 올린 구성이다.

## 3.2 핵심 결과

저자들은 OVS 캐시만으로 VM 격리를 넘어 정보를 주고받거나 빼낼 수 있음을 보였다.

- **Remote Covert Channel**:  
직접 연결이 없는 두 사용자가 OVS 캐시만으로 초당 15.8비트를 96.8% 정확도로 주고받았다. 엔트리를 병렬로 쓰면 초당 222비트까지 올라간다.
- **Remote Packet Header Recovery Attack**:  
피해자 패킷을 직접 보지 않고도 약 7분 만에 91% 확률로 피해자의 출발지 IP·포트를 알아냈다.
- **Remote Packet Rate Monitoring Attack**:  
피해자의 초당 패킷 수 구간을 평균 71.92% 정확도로 실시간 추적했다.

세 공격 모두 공격자는 같은 OVS를 쓰는 서비스에 요청만 보냈다.

## 3.3 세부 결과 분석

### Remote Covert Channel

| 방식 | 대역폭 | 정확도 |
|---|---|---|
| Microflow (엔트리 1개) | 15.8 bit/s | 96.8% |
| Microflow (엔트리 15개 병렬) | 222.3 bit/s | 정확도 유지 |
| Megaflow | 0.73 bit/s | 85.7% |

엔트리를 병렬로 쓰면 대역폭이 14배 늘어난다. 기존 원격 covert channel 연구보다 1.58~197배 빠르다.  
배경 트래픽을 넣어도 정확도는 2% 미만으로만 떨어졌다. 엔트리 하나만 쓰기 때문에 다른 트래픽과 겹칠 일이 적다.  
다만 megaflow 방식은 subtable 재정렬 주기(약 1초)에 묶여 있어서 1 bit/s를 넘지 못한다.

### Remote Packet Header Recovery Attack

| 측정 반복 | 소요 시간 | 성공률 |
|---|---|---|
| 10회 | 83.4초 | 36% |
| 50회 | 약 7분 | 91% |
| 100회 | 837초 | 93% |

측정을 많이 할수록 성공률은 오르고 시간은 길어진다.  
시간은 거의 다 probing에서 쓰이고, 오프라인 해시 계산은 1.47초면 끝난다.  
노이즈가 높은 환경에서는 85%로 떨어진다. 캐시 전체를 probe해야 해서 covert channel보다 노이즈에 약하다.

### Remote Packet Rate Monitoring Attack

실제 트래픽 30개로 실험해 피해자의 패킷 레이트 구간을 평균 71.92% 맞혔다. 레이트가 일정하면 잘 맞고, 갑자기 바뀌면 틀린다.

## 3.4 방어 기법

| 방어 기법 | Remote Covert Channel | Remote Packet Header Recovery Attack | Remote Packet Rate Monitoring Attack |
|---|---|---|---|
| OVS 인스턴스 분리 | 약 50% (무작위 수준) | 0% | 10.83% (사실상 실패) |
| Microflow 해시 랜덤화 | 약 50% | 5/100 성공 | 방어됨 |
| Megaflow 재정렬 주기 랜덤화 | Megaflow 방식만 약 50% | 효과 없음 | 방어됨 |

인스턴스 분리와 해시 랜덤화는 세 공격을 모두 막는다. 재정렬 주기 랜덤화는 megaflow를 쓰는 공격만 막는다.  
다만 인스턴스 분리는 사용자마다 OVS를 따로 띄워야 해서 메모리,CPU 오버헤드와 관리 부담이 생긴다. 방어 기법의 성능 비용은 따로 나오지는 않았다.

## 3.5 저자가 인정한 한계

- 실험은 1-hop 격리망에서만 했다. 실제 multi-hop 네트워크에서는 노이즈가 더 크다.
- kernel datapath를 쓰면 microflow cache가 없어서 헤더 복구는 성립하지 않고, 나머지 공격도 약해진다.
- 피해자 flow가 몇 분 이상 유지되고 레이트가 안정적이어야 공격이 성공한다.
- 피해자의 목적지 IP,포트를 미리 알아야 하고, OVS가 기본 해시 함수를 써야 한다.

## 3.6 내가 본 한계

**첫째, 실험 환경이 실제 클라우드와 다르다.**  
OpenStack, OVN 없이 OVS만 단독으로 올렸기 때문에, 실제 Geneve/VXLAN)이 빠져 있다. subtable 개수와 순서도 실제 환경에서는 다르게 나온다. 따라서 실제 클라우드 구성에서 같은 결과가 나오는지는 별도로 확인이 필요하다.

**둘째, 공격 대상 환경이 좁다.**  
가장 강한 공격인 헤더 복구는 OVS-DPDK에서만 성립한다. OVS-DPDK는 CPU 코어 전용 할당, hugepage, NIC 바인딩이 필요해서 OpenStack 배포 도구(Kolla-Ansible, OpenStack-Helm)의 기본값이 아니다. 그래서 일반 범용 클라우드보다는 성능 때문에 DPDK를 켜는 NFV 환경이 주 대상이라고 본다.

**셋째, NAT 환경을 다루지 않았다.**  
VM이 사설 IP를 쓰고 라우터에서 floating IP로 바뀌는 구조라면, 복구되는 주소는 사설 IP일 가능성이 높다. 외부에서는 그 주소로 직접 접근할 수 없어서 논문이 말한 포트 스캔 같은 후속 공격 가치가 줄어든다.
실제 위협 수준은 후속 실험으로 확인해야 한다고 생각한다.

# 4. 느낀 점과 앞으로 할 것

## 4.1 느낀 점

처음 이 논문을 고를 때는 OVS 공격이라고 하면 DoS 정도를 떠올렸다. 그런데 이 논문은 버그 하나 없이, 성능을 위해 넣은 캐시만으로 VM 격리를 넘을 수 있다는 것을 보였다.  
microflow hit와 megaflow hit의 차이는 7µs밖에 안 된다. 이 정도 차이도 측정을 반복하면 원격에서 구분할 수 있고, 그것만으로 IP와 포트까지 복구된다는 점이 인상적이었다.  
다만 실험 환경이 OVS 단독 구성이고 OVS-DPDK가 기본값이 아니라서, 내가 운영하는 OpenStack에 그대로 통하는 공격은 아니었다. 논문의 결과를 어떤 조건에서 성립하는지 나눠 읽는 것이 중요하다고 느꼈다.

## 4.2 배운 점

성능 최적화를 위한 기능이 취약점이 될 수 있다는 것을 알게 되었다.  
캐시와 subtable 재정렬은 모두 OVS를 빠르게 하려고 넣은 기능인데, 빠르게 만든다는 것 자체가 타이밍 차이를 만들고 그 차이가 정보를 준다는 게 신기했다.  
OVS처럼 오픈소스가 공격자에게도 유리하게 작용한다는 것을 배웠다. CPU 캐시 공격에서는 해시 함수를 리버싱해야 하지만, OVS는 해시 함수가 공개되어 있어서 그대로 가져다 역산할 수 있었다.  
마지막으로 시스템을 먼저 측정해 공격 프리미티브를 모으고, 그것을 조합해 공격을 만드는 연구 흐름을 배울 수 있었다.

## 4.3 더 읽어볼 논문

- **Last-Level Cache Side-Channel Attacks are Practical** (IEEE S&P 2015)  

## 4.4 다른 분야에 적용할 가능성

이 공격의 핵심은 여러 사용자가 공유하는 패킷 처리 구조다. eBPF로 만든 패킷 처리 시스템에도 같은 구조가 있다.

BPF는 2025년 SKT 해킹 사건에 쓰인 BPFDoor 때문에 많이 알려졌다. BPFDoor는 커널의 패킷 필터(BPF)에 규칙을 심어, 포트를 열지 않고도 특정 매직 패킷이 오면 동작하는 백도어다. BPFDoor가 쓴 것은 eBPF의 전신인 classic BPF지만, 커널 안의 패킷 처리 경로가 공격 수단이 될 수 있다는 점을 보여 준 사례다.

이 논문은 반대로 패킷 처리 구조에 아무것도 심지 않고, 그 구조가 만드는 타이밍 차이만으로 정보를 빼냈다. eBPF로 만든 5G UPF는 한 UPF가 처리하는 여러 가입자의 트래픽이 같은 eBPF map을 거친다. SKT 사건이 일어난 곳도 같은 통신사 코어망이라는 점에서, 이 구조에 같은 시각을 적용해 볼 가치가 있다고 생각한다.

## 4.5 직접 재현하고 비교해 보고 싶은 것

먼저 논문의 아티팩트로 결과를 그대로 재현해 보고 싶다. 저자들이 Zenodo에 코드와 실험 스크립트를 공개했고, 실험 환경도 명시되어 있어서 서버 두 대만 있으면 같은 구성을 만들 수 있다. 특히 Remote Packet Header Recovery Attack이 정말 수 분 만에 IP와 포트를 복구하는지 직접 확인하고 싶다.

가장 해 보고 싶은 것은 실제 OpenStack 환경에서의 검증이다. Kolla-Ansible로 OVS-DPDK를 켠 OpenStack을 올리면 Neutron이 만든 실제 규칙과 보안 그룹, NAT가 모두 들어간 상태에서 공격을 해 볼 수 있다.

## 4.6 연구·프로젝트로 발전시킨다면

이 논문을 읽으면서 인프라의 밑바닥에 있는 취약한 부분을 연구해 보고 싶어졌다.  
보안 연구는 보통 웹이나 애플리케이션처럼 사용자에게 보이는 곳에 몰린다. 하지만 이 논문이 다룬 OVS처럼, 모든 VM의 트래픽이 지나가는데도 아무도 의심하지 않는 구성 요소가 있다. 가상 스위치, 커널 네트워크 스택, NIC 같은 곳은 성능을 위해 캐시와 공유 구조를 쓰고, 그 구조는 사용자가 볼 수도 바꿀 수도 없다. 이런 곳에서 생긴 취약점은 그 위에 올라간 모든 서비스에 영향을 준다.  
그 첫 단계로 OpenStack의 컴포넌트 중 하나인 Nova의 소스코드를 직접 보면서 작동 원리를 분석해 보고 싶다. Nova는 VM을 만들고 하이퍼바이저와 연결하는 컴포넌트로, VM이 생성될 때 가상 NIC를 OVS에 연결하는 과정도 Nova를 거친다. 이 논문에서 본 OVS 아래의 세계가 실제로 어떻게 만들어지는지 코드 수준에서 따라가 보면, 인프라의 밑바닥에서 어디가 공유되고 어디가 약한지 더 잘 보일 것이라고 생각한다.


## 참고 내용

- 저자: Daewoo Kim, Sihang Liu (University of Waterloo)
- 학회: USENIX Security '26 (pp. 6247–6265)
- 링크: https://www.usenix.org/conference/usenixsecurity26/presentation/kim-daewoo
- 발표자료: https://www.usenix.org/system/files/sec26_slides_kim-daewoo.pdf
- 아티팩트: https://doi.org/10.5281/zenodo.17965902
- arXiv: https://arxiv.org/abs/2601.15632