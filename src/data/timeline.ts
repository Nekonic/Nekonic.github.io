// About 페이지 타임라인. date는 활동한 날짜(글 쓴 날 아님): YYYY-MM 또는 YYYY-MM-DD, 여러 날이면 end에 끝나는 날(DD)
// YYYY만 쓰면 when에 표시할 기간을 적습니다. 화면에는 날짜 최신순으로 자동 정렬됩니다 (월만 쓰면 그달 1일로 봄)
// post는 src/content/blog의 파일 이름(.md 제외), evidence는 프로필 저장소(Nekonic/Nekonic)의 증빙 파일·폴더 경로 (/로 시작하면 이 블로그의 파일)
// 기간 활동은 until(끝난 날 YYYY-MM-DD, 진행 중이면 'now')을 넣으면 그래프에서 브랜치로 갈라졌다가 끝난 날 합쳐집니다.
// id가 있는 활동에는 branch: id(그 활동 안에서 한 일, 브랜치 위에 찍힘)나 uses: id(그 프로젝트를 쓴 행사, 거기서 병합)로 연결합니다.
// short는 연결된 카드에 붙는 칩 이름, chip은 카드에 붙는 상태 표시, note는 카드에 덧붙이는 설명입니다.
export type TimelineCat = '개발' | 'CTF/Wargame' | 'Bug_Bounty' | '블로그/기술문서' | '논문/컨퍼런스' | '공모전/자격증';

export interface TimelineItem {
  date: string;
  end?: string;
  when?: string;
  cat: TimelineCat;
  title: string;
  post?: string;
  url?: string;
  evidence?: string;
  until?: string;
  id?: string;
  short?: string;
  branch?: string;
  uses?: string;
  chip?: string;
  note?: string;
}

export const timeline: TimelineItem[] = [
  { date: '2026-11-04', end: '05', cat: '논문/컨퍼런스', title: '부산 사이버보안 컨퍼런스 부스 운영', uses: 'vibe', post: '2026-11-08-부산-사이버보안-컨퍼런스-부스운영-후기' },
  { date: '2026-11-07', cat: '논문/컨퍼런스', title: 'KUCIS 서경강 세미나', post: '2026-11-08-2026-kucis-서경강-세미나-후기' },
  { date: '2026-11-06', cat: '블로그/기술문서', title: "'나'에 대해 기록하기", branch: 'hskf', post: '2026-11-06--나-에-대해-기록하기' },
  { date: '2026-10-30', until: 'now', id: 'hskf', short: 'HSKF', chip: '10.30 입단 · 진행 중', cat: '블로그/기술문서', title: 'HSPACE Knights Frontier 3기' },
  { date: '2026-09', cat: '공모전/자격증', title: 'KISIA 정보보호 온라인 실습교육 7과정 수료', evidence: '2026/kisia' },
  { date: '2026-08-04', cat: '논문/컨퍼런스', title: 'KUCIS 기업탐방 (국가정보원, 윈스테크넷)', post: '2026-10-27-kucis-2026-기업탐방-국가정보원-윈스테크넷-' },
  { date: '2026-07-24', cat: '논문/컨퍼런스', title: 'CODEGATE 2026 부스 운영', uses: 'vibe', post: '2026-10-27-codegate-2026-부스운영-후기' },
  { date: '2026-07-02', id: 'vibe', short: 'vibe-security-score', note: 'CODEGATE · 부산 부스 운영에 사용', cat: '개발', title: 'vibe-security-score [부스용 바이브 코딩 보안 자동 채점기]', url: 'https://github.com/Nekonic/vibe-security-score' },
  { date: '2026-08-14', until: '2026-09-04', cat: '개발', title: 'univ-lab-ops [대학 실습실 관리 프로젝트]', url: 'https://github.com/Nekonic/univ-lab-ops', post: '2026-07-06-Univ_PC0' },
  { date: '2026-08-09', cat: 'CTF/Wargame', title: '2026 KISIA CTF 68위 (팀 ********, 4 solve)', evidence: '/assets/file/ctf/kisia-ctf-2026-score.webp' },
  { date: '2026-10-30', cat: 'CTF/Wargame', title: '2026 AI 해킹 방어 대회(ACDC) 학생 분야 예선 참가', post: '2026-10-30-acdc-2026' },
  { date: '2026-04-25', cat: 'CTF/Wargame', title: '2026 핵테온 세종 beginner 4 solve', post: '2026-04-25-hacktheon-sejong-2026', evidence: '2026/[beginnerA][1q2w3e4r]_writeup.pdf' },
  { date: '2026-04', cat: '공모전/자격증', title: '인터넷보안전문가 2급', evidence: '2026/인터넷보안전문가2급.pdf' },
  { date: '2025-12', cat: '공모전/자격증', title: '네트워크관리사 2급', evidence: '2025/네트워크관리사2급.pdf' },
  { date: '2025-11-27', cat: '논문/컨퍼런스', title: 'KUCIS 우수동아리 발표평가', evidence: '2025/[KISIA] 2025년도 대학정보보호동아리(KUCIS) 우수동아리 발표평가 참가확인증_김영빈.pdf' },
  { date: '2025-11', cat: '공모전/자격증', title: '제7회 우석 컴퓨팅사고 창작대회 대상 (WCMS)', evidence: '2025/컴퓨팅사고대회.pdf' },
  { date: '2025-09-19', when: '09.19–11.28', until: '2025-11-28', cat: '공모전/자격증', title: 'CHFI(Computer Hacking Forensic Investigator) 과정 이수', evidence: '2025/[이수증]2025학년도 정보보안학과 CHFI(Computer Hacking Forensic Investigator) 과정.pdf' },
  { date: '2025-09-06', cat: '논문/컨퍼런스', title: 'KUCIS 영남 권역 세미나', evidence: '2025/[KISIA] 2025 KUCIS 영남 권역 세미나 참가확인증_김영빈.pdf' },
  { date: '2025-08-04', cat: 'CTF/Wargame', title: 'DFC 2025 101 - In Vehicle Infotainment 풀이 제출', post: '2025-08-04-dfc-2025-101', evidence: '2025/DFC_[1q2w3e4r][101].pdf' },
  { date: '2025-08', cat: 'CTF/Wargame', title: '제11회 디지털 범인을 찾아라 경진대회 참가', evidence: '2025/RE_ 2025년 제11회 디지털 범인을 찾아라 경진대회 참가신청.pdf' },
  { date: '2025-07-29', cat: '논문/컨퍼런스', title: 'KUCIS 안랩 기업견학', evidence: '2025/[KISIA] 2025 KUCIS 정보보호 기업견학 참가확인증_김영빈.pdf' },
  { date: '2025-07-18', end: '20', cat: 'CTF/Wargame', title: '2025 KUCIS CTF 본선 3 solve', evidence: '2025/KUCIS CTF 참여확인증.pdf' },
  { date: '2025-05-16', cat: '논문/컨퍼런스', title: 'KUCIS 네트워킹 데이', evidence: '2025/[KISIA] 2025 KUCIS 네트워킹 데이 참가확인증_김영빈.pdf' },
  { date: '2024-12', cat: '공모전/자격증', title: '정보처리기능사' },
  { date: '2023-12', cat: '공모전/자격증', title: 'SW·AI 창의 아이디어 공모전 장려상', evidence: '2023/IOT와 함께하는 지능형 에너지 관리 시스템.pdf' },
  { date: '2023-11', cat: '공모전/자격증', title: '호남제일고 일본문화탐구보고회 은상', evidence: '2023/2023 일본문화탐구보고회.pdf' },
  { date: '2023-05', cat: '공모전/자격증', title: '한국정보올림피아드(KOI) 상위 37%' },
  { date: '2022-12', cat: '공모전/자격증', title: '호남제일고 수학탐구발표회 동상' },
  { date: '2022-11', cat: '공모전/자격증', title: '전북 해커톤 SW·AI 창의캠프 1위', post: '2022-12-31-JBSWAI' },
  { date: '2021', when: '2019–2021', cat: '개발', title: '전주온빛중 인공지능부 1기 프로그래밍 담당 (Arduino)' },
];
