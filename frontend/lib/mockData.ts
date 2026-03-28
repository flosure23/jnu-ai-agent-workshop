import { Entry, User } from "./types";

export const mockCurrentUser: User = {
  id: "mock-user-uuid-0001",
  email: "test@example.com",
};

export const mockEntries: Entry[] = [
  {
    id: "entry-001",
    user_id: mockCurrentUser.id,
    title: "봄이 왔다",
    content:
      "오늘 처음으로 벚꽃이 피었다. 점심시간에 산책을 나가니 분홍빛 꽃잎이 바람에 날리고 있었다. 올해도 이렇게 봄이 오는구나.",
    date: "2026-03-27",
    created_at: "2026-03-27T09:00:00Z",
  },
  {
    id: "entry-002",
    user_id: mockCurrentUser.id,
    title: "카페에서 코딩",
    content:
      "동네 카페에 노트북을 가져가서 Next.js 프로젝트를 시작했다. 아메리카노 한 잔으로 세 시간을 버텼다. 생각보다 집중이 잘 됐다.",
    date: "2026-03-26",
    created_at: "2026-03-26T14:30:00Z",
  },
  {
    id: "entry-003",
    user_id: mockCurrentUser.id,
    title: "비 오는 날",
    content:
      "하루 종일 비가 내렸다. 창문을 열고 빗소리를 들으며 책을 읽었다. 요즘 읽는 소설이 너무 재미있어서 시간 가는 줄 몰랐다.",
    date: "2026-03-25",
    created_at: "2026-03-25T19:00:00Z",
  },
  {
    id: "entry-004",
    user_id: mockCurrentUser.id,
    title: "운동 시작",
    content:
      "오늘부터 매일 30분 달리기를 하기로 했다. 첫날이라 힘들었지만 끝내고 나니 기분이 좋았다. 내일도 꼭 하자.",
    date: "2026-03-24",
    created_at: "2026-03-24T07:00:00Z",
  },
  {
    id: "entry-005",
    user_id: mockCurrentUser.id,
    title: "친구와 저녁",
    content:
      "오랜만에 대학 동기를 만나서 저녁을 먹었다. 삼겹살에 소주 한 잔 하면서 이런저런 이야기를 나눴다. 역시 사람을 만나야 에너지가 생긴다.",
    date: "2026-03-23",
    created_at: "2026-03-23T21:00:00Z",
  },
  {
    id: "entry-006",
    user_id: mockCurrentUser.id,
    title: "주말 청소",
    content:
      "집 전체를 대청소했다. 서랍 정리, 먼지 제거, 화장실 청소까지. 깨끗해진 방에서 뒹굴거리니 뿌듯했다.",
    date: "2026-03-22",
    created_at: "2026-03-22T15:00:00Z",
  },
  {
    id: "entry-007",
    user_id: mockCurrentUser.id,
    title: "새 앨범 발매",
    content:
      "좋아하는 가수의 새 앨범이 나왔다. 출퇴근 길에 계속 반복 재생했다. 타이틀곡이 특히 좋다. 뮤비도 나중에 봐야지.",
    date: "2026-03-21",
    created_at: "2026-03-21T08:30:00Z",
  },
  {
    id: "entry-008",
    user_id: mockCurrentUser.id,
    title: "요리 도전",
    content:
      "유튜브 보고 파스타를 만들어봤다. 알리오 올리오인데 마늘을 너무 태워서 쓴맛이 났다. 다음엔 불 조절을 잘 해야겠다.",
    date: "2026-03-20",
    created_at: "2026-03-20T18:00:00Z",
  },
  {
    id: "entry-009",
    user_id: mockCurrentUser.id,
    title: "늦잠의 대가",
    content:
      "알람을 끄고 다시 잠든 게 화근이었다. 지각 직전에 허겁지겁 뛰어갔다. 월요일부터 이러면 안 되는데.",
    date: "2026-03-19",
    created_at: "2026-03-19T09:15:00Z",
  },
  {
    id: "entry-010",
    user_id: mockCurrentUser.id,
    title: "일기장 기획",
    content:
      "나만의 일기장 웹앱을 만들기로 했다. Next.js + Supabase 조합이면 빠르게 만들 수 있을 것 같다. 오늘 spec 문서를 정리했다.",
    date: "2026-03-18",
    created_at: "2026-03-18T22:00:00Z",
  },
];
