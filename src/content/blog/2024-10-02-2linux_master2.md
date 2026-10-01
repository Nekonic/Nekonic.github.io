---
layout : post
title : Linux Master - 2 리눅스 설치
categories : Linux
tags : Linux license
---
# Partition
## 1. 파티션의 특징과 종류
1. 물리적 디스크를 여러개의 논리적 디스크로 분할.  
2. 다중파티션의 잠점은 부팅시간 단축, 안정성, 편리성.  
3. 파티션은 주 파티션(Primary Partition), 확장 파티션(Extended Partition), 논리 파티션(Logical Partition), 스왑 파티션(Swap Partition)으로 구분.  
- 주 파티션 : 부팅가능, 하나의 hdd에 최대4개의 주 파티션 분할 가능.  
- 확장 파티션 : 주 파티션 내에 생성, hdd당 1개만 생성, 데이터 저장 영역을 위한게 아닌 노리 파티션 생성.  
- 논리 파티션 : 확장파티션 안에 생성.  
- 스왑 파티션 : 주 파티션 또는 논리 파티션에 생성.  

## 2. 디스크와 장치명
분할된 파티션은 디스크의 장치 파일명 뒤에 숫자를 붙인다.  
/dav/hd a 3
hd : 하드 유형 sd,hd  
a : 한 케이블에 묶인 hdd 우선순위 정함.  
3 : 파티션 번호. 1~4는 Primary or Extended. 5~는 Logical.  

## 3. 파일 시스템
리눅스 전용 : ext, ext2, ext3, ext4  
저널링 파일 시스템 : JFS, XFS, ReiserFS  
네트워크 파일 시스템 : SMB, CIFS, NFS  
클러스터링 파일 시스템 : 레드헷 GFS 등등  
시스템 파일 시스템 : ISO9660, UDF  
타 운영체제 지원 : FAT, VFAT, FAT32, NTFS, HPFS, SysV  

## 4. LVM(Logical Volume Manager)
1. **여러개의 HDD를 합쳐서 사용**하는 기술로 한개의 파일 시스템을 사용.  

## 5. RAID(Redundant Array of Independent Disks)
1. **여러개의 물리적 디스크를 하나의 논리적 디스크로 인식**하여 작동하게 하는 기술.  
- 하드웨어 RAID : 하드웨어 제조업체에서 합친걸 장비로 제공.  
- 소프트웨어 RAID : 운영체제에서 지원. 저렴한 비용으로 안전한 데이터 저장 가능.  

2. 데이터를 저장하는 방법을 레벨이라 한다.  
3. 목적에 따라 레벨이 다르다.  

## 6. 파티션 문할
1. fdisk는 파티션 테이블을 관리하는 명령어.  
2. fdisk명령어  
- a : 부팅 티션 지정  
- l : 파티션 목록 확인  
- n : 새로운 파티션 추가  
- t : 파티션 종류를 변경  
- w : 파티션 정보를 저장  
- p : 파티션 정보를 확인
- q : 작업종료  
3.  주 파티션의 ID 번호는 83, LVM은 8e, RAID는 fd이다.  

# Boot Manager
## 부트로더의 기능
1. 부트스트랩 로더(bootstrap loader)의 준말로 컴퓨터를 사용자가 사용할 수 있도록 **저장된 운영체제를 읽어 메모리에 올려주는 프로그램**.  
2. 부트로너는 크기가 512byte로 HDD의 첫번째 섹터인 MBR(Master Boot Record)에 위치한다.  
3. 주 파티션마다 부트 섹터(boot sector)가 할당된다.  
4. 분할된 주 파티션들은 자신의 부트 레코드를 MBR에 기록하여 실행된다.  

## GRUB(GRand Unified Bootloader)

## run level
런레벨에 따라 작동하는 서비스를 조정 가능.  
0~6까지 총 7가지  
- 0 : shutdown, halt, init 0과 동일  
- 1 : 시스템 점검할 때 접근. root만 로그인가능.  
- 2 : 네트워크가 없는 다중 사용자 모드  
- 3 : CUI에 의한 다중 사용자 모드  
- 4 : 미사용  
- 5 : 그래픽 모드(GUI)에 의한 다중 다용자 모드  
- 6 : reboot, init 6 과 동일  

## 로그인과 로그아웃
1. 로그인 과정  
- 입력한 패스워드와 파일 /etc/passwd 필드를 비교  
- 셸 성정 파일 실행.  

2. 로그아웃  
로그아웃은 logout, exit 또는 조합키 Ctrl + D 사용
