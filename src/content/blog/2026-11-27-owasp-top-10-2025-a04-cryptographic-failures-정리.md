---
title: "OWASP Top 10 2025 A04 Cryptographic Failures 정리"
date: 2026-11-27
categories: ["[HSKF]블로그/기술문서"]
---

# 1. 등장 배경
 
## 1.1 주제 선정 이유
 
지금 수업시간에 암호기술 강의를 듣고 있다.  
수업에서 배운 AES, RSA, 해시가 OWASP에서는 어떤 위험으로 분류되는지 보고 싶어서 A04를 골랐다.
 
## 1.2 2021 대비 변화
 
OWASP Top 10은 웹에서 많이 나오는 보안 취약점 10가지를 모아 둔 문서다.  
암호화 실패는 2021년 2위에서 2025년 4위로 내려갔다.  
2017년에는 "민감 데이터 노출(Sensitive Data Exposure)"이라는 이름이었고, 2021년에 지금 이름으로 바뀌었다.  
OWASP 문서에는 하드웨어 AES 가속과 Let's Encrypt 같은 무료 인증서가 보급되면서 전송 구간 암호화 부담이 줄었다는 내용이 있다.
 
# 2. 핵심 용어
 
- **해시**: 데이터를 일정한 길이의 값으로 바꾸는 함수다.
- **암호화**: 키를 이용해 데이터를 알아볼 수 없게 바꾸는 것이다.
- **대칭키 암호**: 암호화와 복호화에 같은 키를 쓰는 방식이다. (AES)
- **비대칭키 암호**: 공개키로 암호화하고 개인키로 복호화하는 방식이다. (RSA)
- **IV(Initialization Vector)**: 같은 키로 같은 데이터를 암호화해도 다른 암호문이 나오도록 넣는 초기값이다.
- **솔트**: 비밀번호를 해시하기 전에 덧붙이는 랜덤값이다.
- **KDF(Key Derivation Function)**: 비밀번호 같은 값에서 암호화 키를 만들어 내는 함수다.
- **암호 스위트(Cipher Suite)**: TLS 연결에서 쓸 키 공유, 서버 인증, 데이터 암호화, 해시 알고리즘의 조합이다. (예: TLS_RSA_WITH_AES_128_GCM_SHA256)
- **TRNG(True Random Number Generator)**: 동전던지기처럼 진짜 난수를 만드는 생성기다.
- **CSPRNG(Cryptographically Secure Pseudo-Random Number Generator)**: TRNG로 만든 값을 시드로 받아, 예측할 수 없는 난수를 빠르게 만드는 보안용 생성기다.
# 3. 암호화 실패의 유형
 
## 3.1 전송 구간
 
- HTTP, FTP, Telnet 같은 평문 프로토콜 사용
- 일부 페이지만 HTTPS 적용, HSTS 없음
- 오래된 TLS 버전이나 약한 암호 스위트 허용
- 서버 인증서, 인증서 체인 검증 안 함

HSTS는 브라우저가 해당 사이트에 HTTPS로만 접속하도록 강제하는 응답 헤더다.
 
## 3.2 저장 구간
 
- 비밀번호를 MD5, SHA-1이나 솔트 없는 해시로 저장
- 비밀번호를 KDF 없이 그대로 키로 사용
- AES를 ECB 모드로 사용
- 인증 없는 암호화만 사용

ECB 모드는 블록마다 같은 키로 따로 암호화하는 방식으로, 같은 평문 블록은 같은 암호문 블록이 된다.  
인증 암호화(AEAD, Authenticated Encryption with Associated Data)는 데이터를 암호화하면서 인증 태그라는 검증값을 같이 붙이는 방식이다.  

받는 쪽은 복호화할 때 이 태그를 확인해서, 중간에 암호문이 바뀌었으면 복호화를 거부한다.  
인증이 없는 암호화는 암호문이 바뀌어도 알 수 없고, 바뀐 암호문을 그대로 복호화한다.  
대표적으로 AES-GCM, ChaCha20-Poly1305가 있다.
 
## 3.3 키와 난수
 
- 키를 소스코드나 Git 저장소에 넣음
- 기본 키, 약한 키, 재사용 키 사용, 키 교체 안 함
- 같은 키로 IV 재사용
- 보안용 난수를 일반 난수 생성기로 만들거나 예측 가능한 시드 사용

# 4. 공격 시나리오
 
## 4.1 프로토콜 다운그레이드와 세션 탈취
 
> 모든 페이지에 TLS를 강제하지 않은 사이트에서 세션 쿠키를 훔치는 공격이다.
 
1. 사이트가 일부 페이지만 HTTPS를 쓰거나 약한 암호를 허용한다.
2. 같은 네트워크에 있는 공격자가 연결을 HTTP로 떨어뜨린다.
3. 평문으로 오가는 세션 쿠키를 가로챈다.
4. 그 쿠키로 사용자 세션을 가져간다.

세션을 가져간 뒤에는 오가는 데이터를 읽거나, 송금 받는 사람을 바꿀 수도 있다.  
공격자가 사용자와 같은 네트워크 경로에 있어야 하고, 전 페이지 HTTPS와 HSTS가 적용돼 있으면 성립하지 않는다.
 
## 4.2 약한 비밀번호 저장
 
> 솔트 없는 해시로 저장된 비밀번호가 유출되어 평문이 복구되는 공격이다.
 
1. 서버가 비밀번호를 솔트 없는 단순 해시로 저장한다.
2. 파일 업로드 취약점 같은 다른 버그로 해시 목록이 유출된다.
3. 공격자가 미리 계산해 둔 해시표(레인보우 테이블)와 대조해 평문을 찾는다.

# 5. 대응 방법
 
## 5.1 전송 구간
 
- TLS 1.2 이상, 순방향 비밀성(Forward Secrecy) 지원 암호 스위트 사용
- CBC 기반 스위트 비활성화
- 모든 페이지 HTTPS + HSTS
- FTP, 평문 SMTP로 민감 데이터 전송 금지
- 민감한 응답은 웹 서버, CDN 등에서 캐싱되지 않도록 설정

순방향 비밀성은 서버 개인키가 유출되어도 과거 세션을 복호화할 수 없게 하는 성질이다.
 
## 5.2 비밀번호 저장
 
OWASP Password Storage Cheat Sheet 기준이다.
 
| 알고리즘 | 사용 조건 | 최소 설정 |
|---|---|---|
| Argon2id | 1순위 | 메모리 19MiB, 반복 2, 병렬 1 |
| scrypt | Argon2id를 못 쓸 때 | N=2^17(128MiB), r=8, p=1 |
| bcrypt | 레거시 시스템만 | work factor 10 이상, 72바이트 제한 |
| PBKDF2 | FIPS-140 인증이 필요할 때 | HMAC-SHA256 600,000회 |
 
솔트는 대부분의 라이브러리가 자동으로 만든다.
 
Argon2id는 argon2-cffi 라이브러리로 쓸 수 있다. 아래는 공식 문서의 예제다.
 
```python
from argon2 import PasswordHasher
 
ph = PasswordHasher()
hash = ph.hash("correct horse battery staple")
hash
ph.verify(hash, "correct horse battery staple")
ph.check_needs_rehash(hash)
ph.verify(hash, "Tr0ub4dor&3")
```
 
```
'$argon2id$v=19$m=65536,t=3,p=4$gJvMl2cmAdsiqxs1Dp047Q$OPLvbMkNNVIZJU4bzqNB/np6d27xKBQdop7dGkr2B/Y'
True
False
argon2.exceptions.VerifyMismatchError: The password does not match the supplied hash
```
 
해시 문자열에 알고리즘(argon2id), 설정값(m, t, p), 솔트, 해시값이 `$`로 구분되어 같이 저장된다.
 
## 5.3 데이터 암호화와 키 관리
 
- 데이터를 민감도별로 분류하고 그에 맞게 보호
- 필요 없는 민감 데이터는 저장 안 함, 저장해야 하면 토큰화나 마스킹
- 인증 암호화(AES-GCM 등) 사용
- 키는 HSM이나 클라우드 KMS에 보관하고 주기적으로 교체
- IV는 모드에 맞게 생성, 같은 키로 재사용 금지
- 키, 솔트, 토큰은 CSPRNG로 생성 (파이썬은 `random` 대신 `secrets`)
- MD5, SHA-1, ECB 모드, PKCS#1 v1.5 패딩 사용 금지

# 6. 2025 동향: 양자내성암호(PQC)
 
2025판 예방 항목에 양자내성암호(PQC) 대비가 들어갔다. ENISA 가이드를 근거로 고위험 시스템은 2030년까지 대비하라고 적혀 있다.
 
## 6.1 양자컴퓨터와 기존 암호
 
RSA는 큰 수의 소인수분해가 어렵다는 점에 기반한다.  
양자컴퓨터는 쇼어(Shor) 알고리즘으로 소인수분해를 풀 수 있어서, 공개키만으로 개인키를 구할 수 있게 된다.  
RSA는 암호화와 전자서명에 쓰이고, 암호화는 ML-KEM이, 전자서명은 ML-DSA와 SLH-DSA가 대체한다.  
AES 같은 대칭키 암호에는 쇼어 알고리즘이 통하지 않는다. 그로버(Grover) 알고리즘으로 키 탐색이 빨라지는 정도라서, AES-256을 쓰면 양자컴퓨터는 위협이 되지 않는다.
 
## 6.2 Harvest Now, Decrypt Later
 
공격자가 지금 암호화된 데이터를 수집해 두고, 양자컴퓨터가 나온 뒤 복호화하는 방식이다.  
암호 알고리즘 교체에는 라이브러리, 인증서, 장비 교체가 필요해서 시간이 오래 걸린다.
 
## 6.3 NIST 표준
 
NIST는 2024년 8월 13일 첫 PQC 표준 3개를 확정했다.
 
| 표준 | 알고리즘 | 기반 | 용도 | 대체 대상 |
|---|---|---|---|---|
| FIPS 203 | ML-KEM | CRYSTALS-Kyber | 키 캡슐화(KEM) | RSA 암호화 |
| FIPS 204 | ML-DSA | CRYSTALS-Dilithium | 전자서명 | RSA 서명 |
| FIPS 205 | SLH-DSA | SPHINCS+ | 전자서명 (ML-DSA 백업) | RSA 서명 |
 
SLH-DSA는 ML-DSA와 다른 수학 원리를 쓰는 예비용 서명 표준이다.  
NIST는 전환에 시간이 걸리니 지금 바로 적용을 시작하라고 권고했다.
 
## 6.4 ML-KEM이 RSA를 대체하는 방식
 
RSA로 키를 공유하는 과정은 다음과 같다:
 
1. 클라이언트가 키를 만들어 서버의 RSA 공개키로 암호화한다.
2. 암호문을 서버에 보낸다.
3. 서버가 개인키로 복호화해 같은 키를 얻는다.
4. 양쪽이 이 키로 평문을 AES 암호화해 주고받는다.

ML-KEM은 다음과 같다:
 
1. 클라이언트가 서버의 ML-KEM 공개키로 캡슐화(Encaps)를 실행한다. Encaps는 내부에서 난수 m을 만들고, m을 공개키로 암호화해 암호문 c를, m과 공개키에서 공유 키를 만든다.
2. 암호문 c를 서버에 보낸다.
3. 서버가 개인키로 디캡슐화(Decaps)해 m을 복구하고, 같은 방식으로 공유 키를 만든다.
4. 양쪽이 이 공유 키로 평문을 AES 암호화해 주고받는다.

![](/assets/images/posts/2026-11-27-owasp-top-10-2025-a04-cryptographic-failures-정리/owasp-mwxw91wm.png)
 
| 구분 | RSA | ML-KEM |
|---|---|---|
| 키를 만드는 쪽 | 클라이언트가 직접 만들어 암호화 | Encaps 내부 난수 m에서 유도 |
| 안전성 기반 | 소인수분해 | 격자 문제(Module-LWE) |
| 양자컴퓨터 | 쇼어 알고리즘으로 깨짐 | 알려진 양자 알고리즘으로 풀리지 않음 |
 
# 7. 정리
 
| 구간 | 대응 |
|---|---|
| 전송 | 전 페이지 HTTPS, TLS 1.2 이상, HSTS, 인증서 검증 |
| 저장 | Argon2id 등 느린 해시 + 솔트, 인증 암호화 |
| 키·난수 | KMS/HSM 보관, 키 교체, IV 재사용 금지, CSPRNG |
| PQC | 장기 보관 데이터부터 PQC 알고리즘으로 전환 |
 
# 참고 자료
 
- [OWASP Top 10:2025 A04 Cryptographic Failures (한국어)](https://top10.owasp.org/2025/ko/A04_2025-Cryptographic_Failures/)
- [OWASP Top 10:2021 A02 Cryptographic Failures](https://owasp.org/Top10/2021/A02_2021-Cryptographic_Failures/)
- [OWASP Cheat Sheet: Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Cheat Sheet: Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP Cheat Sheet: Transport Layer Security](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [OWASP Cheat Sheet: HTTP Strict Transport Security](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
- [argon2-cffi 공식 문서](https://argon2-cffi.readthedocs.io/en/stable/)
- [NIST Releases First 3 Finalized Post-Quantum Encryption Standards](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards)