export const MOCK_PUBLIC_ROUNDS = [
    {
        id: 'p1',
        user_id: 'u1', // Added for type compatibility
        userName: '신나는골퍼',
        course_id: 'c1',
        course_name: 'Sky72 Alpha',
        course_type: 'Ocean',
        score: 82,
        date: '2023-10-15',
        weather: 'Sunny',
        memo: 'Perfect weather for a round!',
        holeComments: [
            { hole: 1, content: "Tee shot is narrow, use iron." },
            { hole: 5, content: "Green is very fast, aim left." }
        ]
    },
    {
        id: 'p2',
        user_id: 'u2',
        userName: '원온쓰리퍼팅',
        course_id: 'c2',
        course_name: 'Pebble Beach',
        course_type: 'Links',
        score: 95,
        date: '2023-10-14',
        weather: 'Windy',
        memo: 'Wind was crazy today.',
        holeComments: [
            { hole: 7, content: "Don't look down at the cliffs!" }
        ]
    },
    {
        id: 'p3',
        user_id: 'u3',
        userName: '주말골퍼',
        course_id: 'c3',
        course_name: 'Anyang Benest',
        course_type: 'Mountain',
        score: 88,
        date: '2023-10-12',
        weather: 'Cloudy',
        memo: 'Nice course condition.'
    },
    {
        id: 'p4',
        user_id: 'u4',
        userName: '버디사냥꾼',
        course_id: 'c4',
        course_name: 'South Springs',
        course_type: 'Lake',
        score: 79,
        date: '2023-10-10',
        weather: 'Sunny',
        memo: 'Finally broke 80!'
    },
    {
        id: 'p5',
        user_id: 'u5',
        userName: 'OB마스터',
        course_id: 'c5',
        course_name: 'Blackstone',
        course_type: 'North',
        score: 102,
        date: '2023-10-09',
        weather: 'Rainy',
        memo: 'Should have stayed home.'
    }
];
