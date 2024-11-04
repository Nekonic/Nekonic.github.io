---
layout : post
title : Linux Master - 1 리눅스 일반
categories : Linux
tags : Linux license
---
# Linux의 개요
## 특징 및 장단점
### 1. 특징
1. opensource OS
2. multiuser, multitasking OS
3. multithreading 을 지원하는 network OS
4. 여러 종류의 file system 지원

### 2. 장단점
1. Linux는 UNIX와 완벽하게 호환
2. Linux는 PC용 OS보다 안정적
3. hardware 기능을 효과적으로 사용
4. 기술 지원의 한계
5. 보안상의 문제가 신속하게 해결될 수 있다.

## Linux Directory 종류와 특징

### /boot 
부팅 시 커널 이미지와 부팅 정보 저장
### /proc 
커널기능 제어, 프로세스와 하드웨어 정보 저장  
가상파일 시스템  
실제 드라이브가 아니라 메모리 상에 저장  
### /lib 
커널 모듈, 실행지원 라이브러리 저장  
동적 공유 라이브러리. ex)pytroch
### /bin 
기본적인 명령어 저장
### /dev 
시스템 디바이스 파일. ex)CD-ROM 등  
hdd, 프린터, 키보드 등을 파일화하여 관리
### /etc 
시스템 환경 설정
#### /group
그룹의 정보 저장
##### /passwd
자원을 사용할 수 있는 사용자 목록 저장
##### /shadow
passwd의 패스워드 부분을 암호화 관리  
패스워드 만기일, 계정 만기일 등을 설정
### /root 
관리자용 홈
### /sbin 
관리자용 명령어 저장
### /usr 
사용자 데이터나 앱 저장  
일반 사용자들이 사용
### /home 
일반사용자용 홈
### /var 
가변 자료 저장. ex)log, cache, crash, tmp 등등
### /mnt 
파일시스템을 일시적으로 마운트할 떄 사용
### /lost+found 
결함이 있는 파일 정보 저장

## 리눅스 배포판
### 특징
리눅스 전체 시스템을 구성하는 소프트웨어 패키지 형태  
300여 가지의 배포판 존재  
기업이 관리하는 배포판으로는 Fedora - Rad Hat, openSUSE - Novell, Ubuntu - Canonical 등이 있다.  

### 종류
#### 1. Slackware Linux
가장 먼저 대중화.  
1992 패트릭 볼커딩에 의해 출시.  
구조가 간결하고 파악하기 쉬워 유닉스 학습에 적합.  

#### 2. Debian
1994년 이안머독에 의해 프로젝트 설립.  
GNU의 공식적인 후원을 받고 있는 유일한 배포판.  

#### 3. Ubuntu
Debian Gnu/Linux에 기초한 OS.  
고유한 Unity Desktop Environment 사용.  
Canonical의 지원.  
6달마다 새 버전 배포. GNOME과 비슷.  
사용자 편의성에 초점.  

#### 4. Radhat
기업용 RHEL과 Fedora로 나뉘어 있다.  

#### 5. RHEL(Red Hat Enterprise Linux)
상용 리눅스 패포판.  
18~24개월에 한 번씩 새로운 버전 공개.  
기술지원은 7년.  
소스코드는 FTP를 통해 공개.  

#### 6. Fedora
6개월 간격으로 새로운 버전 배포, 지원기간은 13개월.  

#### 7. CentOS
무료 기업용 컴퓨팅 운영체제.  
플랫폼을 제공할 목적으로 제작.  
자체 커뮤니티에 의해 관리.  
상위판과 호환성을 유지하는 것을 원칙으로 하고 있다.  

#### 8. SUSE
유럽에서 인기.  
롤링 릴리즈(rolling release)방식을 사용.  
openSUSE, SUSE Enterprise Linux로 나뉜다.  

# 리눅스의 역사
## 1. 1960년대 후반
1965년 MIT, AT&T 벨 연구소, General Electric 초기 형태의 시분할 운영체제.  
1969년 벨 연구소의 **켄 톰슨(Ken Thompson)이 초기 형태의 UNIX 개발**.  

## 2. 1970년대
1971년 벨 연구소의 **데니스 리치(Dennis Ritchie)가 C언어 개발**. UNIX가 C로 재작성.  
UNIX는 Berkeley Unix(BSD)와 SYSV로 분열되어 발전.  

## 3. 1980년대 초중반
MIT 연구소의 **리처드 스톨먼(Richard Stollman)은 GNU(GNU is Not Unix)** 프로젝트 시작.  
FSF(Free Software Foundation)설립 후 'GNU 선언문(Manifesto)' 발표.  
1987년 앤드루 타넨바움(Andrew Tanenbaum)은 미닉스(MINIX)를 개발.  

## 4. 1990년대 초중반
핀란드 헬싱키 대학의 리누스 토발즈(Linux Torvalds)가 GNU시스템에 적합한 커널 개발.  
스톨먼과 FSF는 **Linux를 GNU커널로 채택**.  

# Linux license
## 1. FSF(Free Software Foundation)
- 실행의 자유
- 재배포할 수 있는 자유
- 개작할 수 있는 자유
- 개작한 프로그램을 배포할 수 있는 자유

## 2. GNU GPL(General Public license)
1. GPL 코드를 일부 사용하더라도 해당 프로그램은 GPL됨.  
2. 유료판매 가능. 하지만 소스코드는 무료공개.  
3. 외부에 공표, 배포할 때에는 전체 소스코드를 공개.  

## 3. GNU LGPL(Lesser General Public license)
1. GPL보다 훨씬 완화된(Lesser) 조건.  
2. LGPL이 적용된 **라이브러리를 이용**하여 개발할 경우 **소스코드 공개하지 않아도 된다**.  
3. LGPL 코드를 사용했음을 **명시**만 하면 된다.  
4. 코드 이용이 아닌 수정한 또는 파생된 라이브러리를 이용할 경우는 전체 코드를 공개해야 한다.  

## 4. BSD(Berkeley Software Distribution)
1. 수정한 것을 제한없이 배포.  

## 5. Apache
1. 저작권을 양도, 전송할 수 있다.  
2. BSD와 비슷하지만 아파치 라이선스 버전 2.0을 명시해야 한다.  

## 6. MIT(Massachusetts Institute of Technology)
1. BSD 계열  
2. **수정본의 재배포 시에 소스코드 비공개 가능**.  
3. 오픈소스 여부에 관계 없이 재사용 인정.  

## 7. MPL(Mozilla Public License)
1. MPL의 특징은 **소스코드와 실행파일의 저작권을 분리**했다는 점이다.  
2. 수정한 2차 소스코드는 MPL로 공개해야 하지만 **실행파일은 독점 라이선스로 배포**할 수 있다.  
