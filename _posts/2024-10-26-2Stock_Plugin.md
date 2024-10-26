---
layout: post
title: -2- Todo List (Minecraft Stock Plugin)
categories: Minecraft_Plugin
tags: Minecraft_Plugin Minecraft
---
# Mineconomy-Core Mark 시스템 TODO 리스트

## 1. 명령어 구현
- [x] 개인 관련 명령어 작성
  - [x] `/mark balance`: 플레이어의 현재 잔액 조회 기능
  - [x] `/mark deposit <아이템>`: 인벤토리에서 특정 아이템을 Mark로 변환하여 입금
  - [x] `/mark withdraw <금액>`: Mark를 아이템으로 출금하여 인벤토리에 추가
  - [x] `/mark send <플레이어> <금액>`: 플레이어 간의 Mark 송금 기능
- [ ] 회사 관련 명령어 작성
  - [ ] `/mark company balance`: 회사 잔액 조회
  - [ ] `/mark company deposit <금액>`: 회사 계좌에 Mark 입금
  - [ ] `/mark company withdraw <금액>`: 회사 계좌에서 출금하여 인벤토리에 아이템 추가
  - [ ] `/mark company transfer <목적지 회사> <금액>`: 회사 간의 자본 이동

## 2. EconomyManager.java
- [ ] Mark 초기화 및 관리 기능 구현
- [ ] 자원 공급과 수급에 따른 Mark 가치 변동 로직 구현
- [ ] Mark 선물 옵션 거래 기능
  - [ ] 자원 가격 예측 기능 구현
  - [ ] Mark 거래에 따른 리스크 및 수익 계산 로직 추가

## 3. 데이터베이스 설계 및 연결
- [x] **players** 테이블 생성: 플레이어 잔액 정보 저장
- [ ] **companies** 테이블 생성: 회사 계좌 정보 저장
- [ ] **transactions** 테이블 생성: 거래 내역 저장
- [ ] 데이터베이스 트랜잭션 관리 로직 구현 (입출금 및 송금 시 데이터 무결성 보장)

## 4. 캐시 시스템 도입 (선택 사항)
- [ ] 빈번한 데이터 조회에 Redis 캐시 추가 (플레이어 잔액, 회사 잔액)
- [ ] 캐시 데이터와 데이터베이스의 주기적 동기화 로직 구현

## 5. 테스트 코드 작성
- [ ] EconomyManagerTest.java: 개인 및 회사의 입출금, 송금 기능 테스트
- [ ] MarkCommandTest.java: 명령어 입력에 따른 처리 로직 테스트
- [ ] DatabaseManagerTest.java: 대규모 트랜잭션 시 데이터 무결성 테스트
