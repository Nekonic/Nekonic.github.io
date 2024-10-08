---
layout: post
title: 운영체제와 컴퓨터구조 - 1 [개요]
categories: Operating_System
tags: Operating_System 
---
## 운영체제란?

운영체제(Operating System)는 컴퓨터 시스템의 핵심 소프트웨어로서, 하드웨어와 응용 프로그램 간의 인터페이스 역할을 한다. 운영체제는 다양한 기능과 서비스를 제공하여 사용자 및 응용 프로그램이 시스템 자원을 효율적으로 활용할 수 있도록 지원한다.



### 운영체제의 역할과 기능

운영체제의 주요 역할과 기능은 다음과 같다:
- 자원 관리(Resource management): CPU, 메모리, 입출력 장치 등의 시스템 자원을 효율적으로 관리하고 할당
- 메모리 관리(Memory management): 물리적 메모리를 관리하고 가상 메모리 기술을 통해 메모리의 효율적인 사용을 지원
- 입출력 관리(Input/output devices): 입출력 장치와의 효율적인 통신을 관리하고 입출력 작업을 스케줄링하여 시스템의 성능을 향상
- 파일 시스템 관리(Disk access and file systems): 사용자 및 응용 프로그램이 시스템과 상호 작용할 수 있는 인터페이스를 제공

### 운영체제의 역사

운영체제는 컴퓨터 과학의 발전과 함께 역사를 거슬러 올라간다. 초기 컴퓨터에서는 운영체제가 없었고, 프로그램이 직접 하드웨어를 제어하며 실행되었다. 그러나 시간이 흐름에 따라 운영체제의 개념이 발전하고, 다양한 운영체제가 등장하였다.

- 일괄 처리 시스템(batch processing system): 초기의 운영체제는 일괄 처리 시스템으로, 여러 사용자의 작업을 일괄적으로 처리하는 방식
- 대화형 시스템(interactive system): 키보드와 모니터의 개발으로 컴퓨터와 사용자의 대화를 통해 작업이 이루어지는 시스템
- 시분할 시스템(time-sharing system): 여러 사용자가 동시에 컴퓨터를 사용할 수 있도록 하여 대화형 인터페이스를 제공하는 시스템
- 분산 시스템(distributed system): 여러 컴퓨터들이 네트워크로 연결되어 자원을 공유하고 협력하는 시스템
- 클라이언트/서버 시스템(client/server system): 요청하는 클라이언트와 처리하는 서버의 이중구조로 나뉜다.
- P2P 시스템(peer to peer): 중앙 집중형 서버 없이 여러 대의 컴퓨터가 직접적으로 서로 통신하여 파일이나 리소스를 공유하는 방식
- 그리드 컴퓨팅(Grid Computing): 여러 대의 컴퓨터나 리소스를 네트워크로 연결하여 하나의 가상화된 컴퓨터처럼 사용하는 컴퓨팅 시스템
- 클라우드 컴퓨팅(Cloud Computing): 인터넷을 통해 가상화된 컴퓨팅 리소스를 제공하는 컴퓨팅 시스템


## 운영체제의 구성
### 커널(kernel)
- 커널은 프로세스 관리, 메모리 관리, 저장장치 관리와 같은 운영체제의 핵심 기능을 구현한 프로그램이다.

### 인터페이스(interface)
- 인터페이스는 커널에 명령을 전달하고 실행 결과를 사용자와 프로그램에 돌려준다.

### 시스템 호출(System Calls):
- 응용 프로그램이 운영체제의 서비스를 요청할 때 사용하는 인터페이스.
- 시스템 호출을 통해 운영체제의 기능을 호출하고 실행할 수 있다.

### 커널의 역할
- 자원 관리(Resource management): CPU, 메모리, 입출력 장치 등의 시스템 자원을 효율적으로 관리하고 할당
- 메모리 관리(Memory management): 물리적 메모리를 관리하고 가상 메모리 기술을 통해 메모리의 효율적인 사용을 지원
- 입출력 관리(Input/output devices): 입출력 장치와의 효율적인 통신을 관리하고 입출력 작업을 스케줄링하여 시스템의 성능을 향상
- 파일 시스템 관리(Disk access and file systems): 사용자 및 응용 프로그램이 시스템과 상호 작용할 수 있는 인터페이스를 제공
- 프로세스 관리(Process Management): 프로세스 생성, 스케줄링, 동기화, 통신 등과 관련된 작업을 관리
- 사용자 인터페이스(User Interface): 사용자와 시스템 간의 상호작용을 위한 인터페이스를 제공
- 네트워킹(Networking): 네트워크 관련 기능을 제공

### 커널의 종류
- 단일형 커널(Monolithic Kernel): 모든 운영체제의 기능을 하나의 단일한 커널 내에 구현하는 형태
- 계층형 커널(Layered Kernel): 계층간의 통신을 통해운영체제를 구현하는 방식
- 마이크로 커널(Micro Kernel): 프로세스 관리, 메모리 관리등의 가장 기본적인 기능만 제공
- 하이브리드 커널(Hybrid Kernel): 단일형 커널과 마이크로 커널의 장점을 결합한 형태. 일부 기능은 커널 내부에 구현되고, 다른 기능은 사용자 공간에 위치.
- 나노 커널(Nano Kernel): 가장 작은 기능만을 내부에 구현하고, 대부분의 기능은 사용자 모드에서 실행되는 형태. 널의 크기를 최소화하여 빠른 부팅과 작은 메모리 사용량이 특징

## 컴퓨터의 기본 구성
