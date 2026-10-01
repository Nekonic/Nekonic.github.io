---
layout: post
title: 리버스 프록시(Reverse Proxy)
categories: hacking network
tags: hacking network server
---

## 1. 리버스 프록시란 무엇인가?
리버스 프록시는 클라이언트의 요청을 받아 내부 서버로 전달하고, 서버의 응답을 다시 클라이언트에게 전달하는 중개 서버이다. 이는 서버 측에 위치하여 외부로부터의 직접적인 접근을 차단하고, 다양한 부가 기능을 제공한다.  
![img](/assets/images/Reverse_Proxy/a.png)
  
리버스 프록시의 주요 기능은 다음과 같다:
  
- Protection from attacks : 서버의 IP 주소와 구조를 숨겨 외부 공격으로부터 보호한다.
- Load balancing : 여러 대의 서버로 트래픽을 분산시켜 성능을 향상시킨다.
- Caching : 자주 요청되는 콘텐츠를 캐싱하여 응답 시간을 단축한다.
- SSL/TLS encryption : SSL 인증서를 관리하고 암호화 통신을 처리한다.


## 2. 리버스 프록시의 해킹 사례
### 캐시 포이즈닝(Cache Poisoning) 공격
해커는 리버스 프록시의 캐싱 기능을 악용하여 악성 데이터를 캐시에 저장한다. 이후 정상적인 사용자들이 해당 데이터를 요청하면, 악성 콘텐츠를 전달받게 된다.  
  
공격 방법:
  
- 해커가 조작된 요청을 리버스 프록시에 전송한다.
- 리버스 프록시가 해당 요청을 캐시에 저장한다.
- 다른 사용자들이 동일한 요청을 하면 캐시된 악성 데이터가 전달된다.
  
## 3. 그럼에도 써야하는 이유

### 개인 정보 보호 강화와 DDoS 방어
리버스 프록시는 실제 서버의 IP 주소를 숨겨 외부로부터의 직접적인 공격을 방지한다. 이는 개인 정보 보호를 강화할 뿐만 아니라, 공격자가 서버의 위치를 알 수 없게 만들어 DDoS 공격의 표적이 되는 것을 어렵게 한다. 또한 리버스 프록시는 트래픽을 모니터링하고 필터링하여 대규모 트래픽 공격에 효과적으로 대응할 수 있다.  

### 안전한 원격 접근
집에서 사용하는 NAS, 라즈베리 파이, 스마트 홈 기기 등에 외부에서 안전하게 접근하기 위해 리버스 프록시를 활용할 수 있다.  

### 컨텐츠 필터링 및 광고 차단
AdGuard Home 등을 설치하여 광고차단을 할 수 있다.  

### 캐싱으로 인한 속도 향상
자주 방문하는 웹사이트나 사용하는 데이터를 캐싱하여 인터넷 속도를 높이고 대역폭을 절약할 수 있다.  

### 로컬 개발 환경 구축
개발자 지망생이나 취미로 코딩을 하는 일반인들이 로컬에서 웹 서버를 운영하고 외부에 공개할 때 리버스 프록시를 활용하면 보안과 편의성을 동시에 얻을 수 있다.  

### VPN 대안으로 활용
간단한 설정으로 특정 서비스에 대한 프록시를 구축하여 VPN 없이도 안전한 통신을 할 수 있다.  



Source  
[OWASP Top 10 Security Risks](https://owasp.org/www-project-top-ten/)  
[Reverse Proxy 서버 설정 가이드](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)  
[캐시 포이즈닝 공격에 대한 이해](https://portswigger.net/web-security/cache-poisoning)  
[리버스 프록시란?](https://www.cloudflare.com/ko-kr/learning/cdn/glossary/reverse-proxy/)  