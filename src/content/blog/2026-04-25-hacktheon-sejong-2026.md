---
title: "2026 핵테온 세종 beginner 라이트업"
date: 2026-04-25
categories: ["[HSKF]CTF/Wargame", "CTF"]
tags: ["hacktheon", "ctf", "writeup", "web", "pwn", "reversing"]
---

2026 핵테온 세종에 1q2w3e4r 팀으로 beginner 부문에 참가해서 4문제를 풀었다.
대회에 제출한 라이트업을 그대로 올린다.

## 푼 문제

| 문제 | 분야 | 핵심 |
| :--- | :--- | :--- |
| simple-sqli | Web | 입력값이 f-string으로 쿼리에 바로 들어감 → `admin' --` 로 비밀번호 조건 주석 처리 |
| Immutable | Pwn | `scanf("%s")` 오버플로우, 비교 변수가 canary보다 아래라 128바이트 + `0xdeadbeef` 로 덮기 |
| Recover It! | Reversing | 입력 각 바이트를 `i + 0x67` 로 XOR 후 비교 → `cmptable[i] ^ (i + 0x67)` 로 역산 |
| Voice Over | Misc | 화자 유사도 0.8 이상 필요, gTTS는 0.59 → XTTS v2 보이스 클로닝으로 통과 |

## 라이트업

![2026 HACKTHEON SEJONG beginner 라이트업 (1q2w3e4r)](/assets/file/ctf/hacktheon-sejong-2026-writeup.pdf)
