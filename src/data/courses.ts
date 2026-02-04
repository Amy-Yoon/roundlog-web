export const MOCK_COURSES = [
    {
        id: 'c1',
        name: '스카이72 CC',
        location: '인천',
        rating: 4.5,
        description: '바다를 조망하며 플레이할 수 있는 프리미엄 퍼블릭 코스입니다.',
        subCourses: [
            {
                id: 'c1-1',
                name: '오션 코스',
                holes: 18,
                par: 72,
                holeData: [
                    { hole: 1, par: 4, distances: { ladies: 280, white: 360, blue: 400, black: 430 }, handicap: 5 },
                    { hole: 2, par: 3, distances: { ladies: 120, white: 150, blue: 170, black: 185 }, handicap: 17 },
                    { hole: 3, par: 5, distances: { ladies: 420, white: 480, blue: 520, black: 550 }, handicap: 1 },
                    { hole: 4, par: 4, distances: { ladies: 300, white: 380, blue: 410, black: 440 }, handicap: 7 },
                    { hole: 5, par: 4, distances: { ladies: 290, white: 350, blue: 385, black: 410 }, handicap: 11 },
                    { hole: 6, par: 3, distances: { ladies: 110, white: 140, blue: 160, black: 175 }, handicap: 15 },
                    { hole: 7, par: 5, distances: { ladies: 440, white: 500, blue: 540, black: 570 }, handicap: 3 },
                    { hole: 8, par: 4, distances: { ladies: 310, white: 370, blue: 400, black: 425 }, handicap: 9 },
                    { hole: 9, par: 4, distances: { ladies: 295, white: 365, blue: 395, black: 420 }, handicap: 13 },
                    { hole: 10, par: 4, distances: { ladies: 285, white: 355, blue: 390, black: 415 }, handicap: 6 },
                    { hole: 11, par: 3, distances: { ladies: 125, white: 155, blue: 175, black: 190 }, handicap: 16 },
                    { hole: 12, par: 5, distances: { ladies: 430, white: 490, blue: 530, black: 560 }, handicap: 2 },
                    { hole: 13, par: 4, distances: { ladies: 305, white: 375, blue: 405, black: 435 }, handicap: 8 },
                    { hole: 14, par: 4, distances: { ladies: 295, white: 360, blue: 395, black: 420 }, handicap: 12 },
                    { hole: 15, par: 3, distances: { ladies: 115, white: 145, blue: 165, black: 180 }, handicap: 18 },
                    { hole: 16, par: 5, distances: { ladies: 425, white: 485, blue: 525, black: 555 }, handicap: 4 },
                    { hole: 17, par: 4, distances: { ladies: 300, white: 370, blue: 400, black: 430 }, handicap: 10 },
                    { hole: 18, par: 4, distances: { ladies: 315, white: 385, blue: 415, black: 445 }, handicap: 14 }
                ]
            },
            {
                id: 'c1-2',
                name: '레이크 코스',
                holes: 18,
                par: 72,
                holeData: []
            },
            {
                id: 'c1-3',
                name: '하늘 코스',
                holes: 18,
                par: 72,
                holeData: []
            }
        ]
    },
    {
        id: 'c2',
        name: '안양 CC',
        location: '안양',
        rating: 4.8,
        description: '대한민국 최고의 명문 골프장 중 하나로, 수려한 조경을 자랑합니다.',
        subCourses: [
            {
                id: 'c2-1',
                name: '단일 코스',
                holes: 18,
                par: 72,
                holeData: []
            }
        ]
    },
    {
        id: 'c3',
        name: '블랙스톤 이천',
        location: '이천',
        rating: 4.7,
        description: '전략적인 코스 공략이 필요한 난이도 높은 구장입니다.',
        subCourses: [
            { id: 'c3-1', name: '북 코스', holes: 9, par: 36, holeData: [] },
            { id: 'c3-2', name: '동 코스', holes: 9, par: 36, holeData: [] },
            { id: 'c3-3', name: '서 코스', holes: 9, par: 36, holeData: [] }
        ]
    },
    {
        id: 'c4',
        name: '핀크스 GC',
        location: '제주',
        rating: 4.9,
        description: '세계 100대 코스에 선정된 제주도의 보석 같은 골프장.',
        subCourses: [
            { id: 'c4-1', name: '이스트', holes: 18, par: 72, holeData: [] },
            { id: 'c4-2', name: '웨스트', holes: 18, par: 72, holeData: [] }
        ]
    }
];
