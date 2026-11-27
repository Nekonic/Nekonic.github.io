---
title: "fuzzer 와 fuzzing"
date: 2026-11-27
categories: ["[HSKF]블로그/기술문서"]
---

# Fuzzer와 Fuzzing

## 1. Fuzzing이란

### 1.1 정의

Fuzzing은 프로그램에 자동으로 만든 입력을 대량으로 넣고 크래시나 멈춤이 일어나는지 관찰하는 테스트 기법이다. 단위 테스트는 사람이 정한 입력으로 기능을 확인하고, fuzzing은 요구사항과 상관없는 프로그래밍 오류를 찾는다.

찾는 버그는 메모리 오류, 산술 오류, NULL 역참조, 무한 루프다.

Fuzzing은 신뢰할 수 없는 입력을 받는 코드에 쓴다. 파서, 미디어 코덱, 네트워크 프로토콜, OS 커널이 그렇다.

### 1.2 핵심 용어

- Fuzz Target: fuzzer가 만든 바이트를 받아 테스트할 코드를 호출하는 함수다. harness라고도 부른다
- Seed: 처음 넣는 입력이다. PNG 파서라면 정상 PNG 파일을 넣는다
- Corpus: seed를 포함해 fuzzer가 모아둔 입력 묶음이다
- Fuzzer: 입력을 변형하고 target을 실행하는 도구다
- Coverage: 입력이 실행한 코드 범위다

### 1.3 동작 방식

![Coverage-guided fuzzing](https://fuchsia.dev/static/fuchsia-src/images/fuzzing/coverage-guided.png)
*출처: [Fuzz testing | Fuchsia](https://fuchsia.dev/fuchsia-src/contribute/testing/fuzz_testing)*

Fuzzer는 corpus에서 입력 하나를 골라 비트 뒤집기, 바이트 삽입 같은 방법으로 변형하고 target을 실행한다. 새 coverage를 만든 입력은 corpus에 추가하고, 크래시를 낸 입력은 따로 저장한다.

## 2. Fuzzing의 종류

### 2.1 입력 생성 방식

Mutation-based는 기존 입력을 조금씩 변형해 새 입력을 만든다. 입력 형식을 몰라도 된다. Generation-based는 문법이나 스펙을 보고 입력을 처음부터 만든다. 형식 모델을 직접 만들어야 하고, 모델이 정확하면 형식 검사가 엄격한 파서도 통과한다.

### 2.2 내부 정보 활용 정도

- Black-box: 입력을 넣고 크래시만 본다
- Grey-box: instrumentation으로 수집한 coverage를 입력 선택에 쓴다. Coverage-guided fuzzing이 여기에 해당한다
- White-box: 분기 조건을 수식으로 바꾸고 SMT solver로 풀어서 그 분기를 통과하는 입력을 계산한다. 경로가 많아지면 계산량이 폭발한다

분기 조건이 여러 겹이면 black-box는 모든 조건을 한 번에 우연히 맞춰야 안쪽 코드에 도달한다. Grey-box는 조건 하나를 통과한 입력을 corpus에 남기고, 그 입력에서 다음 조건을 노린다.

### 2.3 Instrumentation 방식

- Compile-time instrumentation: 컴파일할 때 분기마다 기록 코드를 넣는다. 소스가 필요하다. AFL++ `afl-cc`, libFuzzer `-fsanitize=fuzzer`가 이 방식이다
- DBI(Dynamic Binary Instrumentation): 실행 중인 바이너리에 instrumentation 코드를 끼워 넣는다. 소스가 없어도 되지만 compile-time보다 느리다. TinyInst, Frida가 이 방식이다
- Emulation: QEMU, Unicorn 위에서 바이너리를 실행하며 coverage를 기록한다. 다른 아키텍처용 바이너리도 실행한다

## 3. Sanitizer

Fuzzer는 크래시와 timeout으로 버그를 판단한다. 힙 버퍼를 몇 바이트 넘겨 써도 넘친 영역이 매핑된 메모리면 인접 데이터를 덮어쓰기만 하고 크래시가 나지 않는다. Sanitizer는 이런 버그를 실행 중에 검출한다.

ASan은 버퍼 오버플로와 UAF(use-after-free)를 잡고, 검출 즉시 프로세스를 종료한다. 자동으로 붙지 않아서 libFuzzer는 `-fsanitize=fuzzer,address`, AFL++는 `AFL_USE_ASAN=1`로 켠다. UBSan은 부호 있는 정수 오버플로, 정렬되지 않은 포인터 같은 미정의 동작을 잡는다. 기본 설정에서는 리포트만 남기고 계속 실행하므로 `-fno-sanitize-recover`를 줘야 fuzzer가 크래시로 잡는다. MSan은 초기화되지 않은 값이 분기나 주소 계산에 쓰이는 것을 잡는다. 의존 라이브러리까지 전부 instrumentation을 넣어서 빌드해야 한다.

## 4. Fuzzer 비교

| | AFL++ | libFuzzer | Jackalope | Fuzzilli |
|---|---|---|---|---|
| 소스 필요 | 선택 (바이너리 모드는 불필요) | 필요 | 불필요 | 필요 (엔진 빌드) |
| Instrumentation | compile-time, QEMU, Frida, Unicorn | compile-time | TinyInst (DBI) | compile-time |
| 실행 방식 | forkserver, persistent | in-process | 프로세스 재실행, target 함수 지정 시 persistent | 프로세스 재사용 |
| 입력 생성 | mutation-based, custom mutator로 grammar-based | mutation-based | mutation-based, grammar-based | FuzzIL 단위 mutation |
| 주 용도 | 프로그램, libFuzzer harness | 라이브러리 함수 | 소스 없는 바이너리 | JavaScript 엔진 |
| 플랫폼 | Linux, macOS (제한) | Linux, macOS, Windows (ASan 필수) | Windows, macOS, Linux, Android | Linux, macOS, Windows |

### 4.1 AFL++

AFL을 fork한 프로젝트다. `afl-cc`로 compile-time instrumentation을 넣고, forkserver 방식으로 실행한다. `main()` 직전 상태의 프로세스를 띄워두고 입력마다 `fork()`로 복제하기 때문에 매번 `execve()`로 띄우는 것보다 빠르다. Persistent 모드는 소스에 `__AFL_LOOP(N)` 루프를 넣어서 프로세스 하나로 입력 N개를 처리하고, 그 뒤 프로세스를 새로 띄운다. 소스가 없으면 QEMU, Frida, Unicorn 모드로 바이너리를 fuzzing한다.

### 4.2 libFuzzer

LLVM에 포함된 in-process fuzzer다. Fuzzer와 target이 같은 프로세스에 있고, fuzzer가 `LLVMFuzzerTestOneInput()`을 반복 호출한다. 그래서 target이 전역 상태를 바꾸면 다음 입력에 영향이 간다.

### 4.3 Jackalope

Project Zero가 만든 fuzzer로, 소스가 없는 바이너리를 fuzzing한다. Coverage는 TinyInst(DBI)로 얻는다. Target 함수를 지정하면 persistent 모드로 그 함수만 반복 실행한다. 여러 머신에서 분산 실행하고, 서버가 corpus, 크래시, coverage를 모아 각 머신에 나눠준다.

### 4.4 Fuzzilli

Project Zero가 만든 JavaScript 엔진 fuzzer다. FuzzIL이라는 중간 언어(IR)로 된 프로그램을 변형한 뒤 JavaScript로 변환해서 엔진에 넣는다. JavaScript 코드를 문법 단위로 변형하면 문법은 맞아도 예외를 던지는 코드가 많이 나와서 JIT 컴파일러까지 가지 못하기 때문이다. V8, JavaScriptCore, SpiderMonkey 같은 엔진의 JIT 최적화 버그를 찾는다.

## 참고 자료

- [Fuzz testing | Fuchsia](https://fuchsia.dev/fuchsia-src/contribute/testing/fuzz_testing)
- [google/fuzzing](https://github.com/google/fuzzing)
- [google/sanitizers](https://github.com/google/sanitizers)
- [google/AFL](https://github.com/google/AFL)
- [AFLplusplus/AFLplusplus](https://github.com/AFLplusplus/AFLplusplus)
- [libFuzzer – LLVM Documentation](https://llvm.org/docs/LibFuzzer.html)
- [googleprojectzero/Jackalope](https://github.com/googleprojectzero/Jackalope)
- [googleprojectzero/TinyInst](https://github.com/googleprojectzero/TinyInst)
- [googleprojectzero/fuzzilli](https://github.com/googleprojectzero/fuzzilli)