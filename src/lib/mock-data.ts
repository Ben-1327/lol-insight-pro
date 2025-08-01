import { SummonerData, MatchData, ParticipantData } from './riot-api';

// Vision Lab用のインターフェース
export interface WardPlacement {
  x: number;
  y: number;
  type: 'stealth' | 'control' | 'farsight';
  timestamp: number;
  teamId: number;
  isActive: boolean;
}

export interface VisionAnalysis {
  totalWards: number;
  wardTypes: Record<string, number>;
  visionScore: number;
  mapCoverage: number;
  keyAreasCovered: string[];
  suggestions: string[];
  efficiency: number;
}

// モックサモナーデータ
export const mockSummonerData: Record<string, SummonerData> = {
  'hide on bush': {
    id: 'rIdjigtqGDjVX8Ev4nZH1cXkm7yf7jX-aINIrJfLhI5J0g',
    accountId: 'dJmQzIhMBsVl9_qWxGPMwKd2yfOQbRbqM_1Xy3Jjw_Q',
    puuid: 'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ',
    name: 'Hide on bush',
    profileIconId: 4901,
    revisionDate: 1704000000000,
    summonerLevel: 435
  },
  'faker': {
    id: 'rIdjigtqGDjVX8Ev4nZH1cXkm7yf7jX-aINIrJfLhI5J0g',
    accountId: 'dJmQzIhMBsVl9_qWxGPMwKd2yfOQbRbqM_1Xy3Jjw_Q',
    puuid: 'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ',
    name: 'Faker',
    profileIconId: 5008,
    revisionDate: 1704000000000,
    summonerLevel: 450
  },
  'caps': {
    id: 'caps-summoner-id-123',
    accountId: 'caps-account-id-123',
    puuid: 'caps-puuid-123',
    name: 'Caps',
    profileIconId: 4932,
    revisionDate: 1704000000000,
    summonerLevel: 380
  },
  'showmaker': {
    id: 'showmaker-summoner-id-123',
    accountId: 'showmaker-account-id-123',
    puuid: 'showmaker-puuid-123',
    name: 'Showmaker',
    profileIconId: 4873,
    revisionDate: 1704000000000,
    summonerLevel: 420
  },
  // Riot ID形式のサンプルデータ
  'eztowin#lol': {
    id: 'eztowin-summoner-id-456',
    accountId: 'eztowin-account-id-456',
    puuid: 'eztowin-puuid-456',
    name: 'ezToWin',
    profileIconId: 4567,
    revisionDate: 1704000000000,
    summonerLevel: 325
  },
  'testplayer#kr1': {
    id: 'testplayer-summoner-id-789',
    accountId: 'testplayer-account-id-789',
    puuid: 'testplayer-puuid-789',
    name: 'TestPlayer',
    profileIconId: 4123,
    revisionDate: 1704000000000,
    summonerLevel: 280
  },
  'proplayer#main': {
    id: 'proplayer-summoner-id-101',
    accountId: 'proplayer-account-id-101',
    puuid: 'proplayer-puuid-101',
    name: 'ProPlayer',
    profileIconId: 4890,
    revisionDate: 1704000000000,
    summonerLevel: 450
  }
};

// モック試合履歴
export const mockMatchHistory: Record<string, string[]> = {
  'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ': [
    'KR_7200123456',
    'KR_7200123457',
    'KR_7200123458',
    'KR_7200123459',
    'KR_7200123460'
  ],
  'caps-puuid-123': [
    'EUW1_6500123456',
    'EUW1_6500123457',
    'EUW1_6500123458',
    'EUW1_6500123459',
    'EUW1_6500123460'
  ],
  'showmaker-puuid-123': [
    'KR_7200234567',
    'KR_7200234568',
    'KR_7200234569',
    'KR_7200234570',
    'KR_7200234571'
  ],
  // Riot ID形式のサンプル用データ
  'eztowin-puuid-456': [
    'JP1_5800123456',
    'JP1_5800123457',
    'JP1_5800123458',
    'JP1_5800123459',
    'JP1_5800123460'
  ],
  'testplayer-puuid-789': [
    'KR_7200345678',
    'KR_7200345679',
    'KR_7200345680',
    'KR_7200345681',
    'KR_7200345682'
  ],
  'proplayer-puuid-101': [
    'KR_7200456789',
    'KR_7200456790',
    'KR_7200456791',
    'KR_7200456792',
    'KR_7200456793'
  ]
};

// モック参加者データ（既存のもののみ維持）
export const mockParticipantData: Record<string, ParticipantData[]> = {
  'KR_7200123456': [{
    puuid: 'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ',
    summonerId: 'rIdjigtqGDjVX8Ev4nZH1cXkm7yf7jX-aINIrJfLhI5J0g',
    summonerName: 'Hide on bush',
    championId: 7,
    championName: 'LeBlanc',
    kills: 8,
    deaths: 2,
    assists: 12,
    totalMinionsKilled: 245,
    neutralMinionsKilled: 15,
    goldEarned: 16800,
    totalDamageDealtToChampions: 28500,
    visionScore: 32,
    wardsPlaced: 18,
    wardsKilled: 8
  }],
  'KR_7200123457': [{
    puuid: 'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ',
    summonerId: 'rIdjigtqGDjVX8Ev4nZH1cXkm7yf7jX-aINIrJfLhI5J0g',
    summonerName: 'Hide on bush',
    championId: 157,
    championName: 'Yasuo',
    kills: 12,
    deaths: 4,
    assists: 8,
    totalMinionsKilled: 278,
    neutralMinionsKilled: 22,
    goldEarned: 18200,
    totalDamageDealtToChampions: 32100,
    visionScore: 28,
    wardsPlaced: 14,
    wardsKilled: 6
  }],
  'KR_7200123458': [{
    puuid: 'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ',
    summonerId: 'rIdjigtqGDjVX8Ev4nZH1cXkm7yf7jX-aINIrJfLhI5J0g',
    summonerName: 'Hide on bush',
    championId: 91,
    championName: 'Talon',
    kills: 15,
    deaths: 3,
    assists: 9,
    totalMinionsKilled: 198,
    neutralMinionsKilled: 45,
    goldEarned: 17500,
    totalDamageDealtToChampions: 29800,
    visionScore: 25,
    wardsPlaced: 12,
    wardsKilled: 9
  }],
  'KR_7200123459': [{
    puuid: 'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ',
    summonerId: 'rIdjigtqGDjVX8Ev4nZH1cXkm7yf7jX-aINIrJfLhI5J0g',
    summonerName: 'Hide on bush',
    championId: 103,
    championName: 'Ahri',
    kills: 6,
    deaths: 1,
    assists: 14,
    totalMinionsKilled: 267,
    neutralMinionsKilled: 8,
    goldEarned: 15900,
    totalDamageDealtToChampions: 26400,
    visionScore: 35,
    wardsPlaced: 21,
    wardsKilled: 12
  }],
  'KR_7200123460': [{
    puuid: 'HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ',
    summonerId: 'rIdjigtqGDjVX8Ev4nZH1cXkm7yf7jX-aINIrJfLhI5J0g',
    summonerName: 'Hide on bush',
    championId: 134,
    championName: 'Syndra',
    kills: 9,
    deaths: 2,
    assists: 11,
    totalMinionsKilled: 289,
    neutralMinionsKilled: 12,
    goldEarned: 17800,
    totalDamageDealtToChampions: 31200,
    visionScore: 29,
    wardsPlaced: 16,
    wardsKilled: 7
  }]
};

// Vision Lab用モックデータ
export const mockVisionData: Record<string, {
  wards: WardPlacement[];
  analysis: VisionAnalysis;
}> = {
  'excellent': {
    wards: [
      { x: 20, y: 18, type: 'control', timestamp: 180000, teamId: 100, isActive: true },
      { x: 45, y: 35, type: 'stealth', timestamp: 240000, teamId: 100, isActive: true },
      { x: 78, y: 75, type: 'stealth', timestamp: 300000, teamId: 100, isActive: true },
      { x: 50, y: 20, type: 'control', timestamp: 360000, teamId: 100, isActive: true },
      { x: 65, y: 40, type: 'farsight', timestamp: 420000, teamId: 100, isActive: true },
      { x: 82, y: 65, type: 'stealth', timestamp: 480000, teamId: 100, isActive: true },
      { x: 15, y: 28, type: 'stealth', timestamp: 540000, teamId: 100, isActive: true },
      { x: 25, y: 50, type: 'control', timestamp: 600000, teamId: 100, isActive: true },
      { x: 75, y: 30, type: 'stealth', timestamp: 660000, teamId: 100, isActive: true },
    ],
    analysis: {
      totalWards: 9,
      wardTypes: { stealth: 6, control: 3, farsight: 1 },
      visionScore: 58,
      mapCoverage: 85,
      keyAreasCovered: ['Baron Pit', 'Dragon Pit', 'Mid River', 'Blue Jungle', 'Red Jungle'],
      suggestions: [
        '素晴らしいワード配置です！',
        'バロンとドラゴン両方をカバーできています',
        'ジャングルの主要ルートを監視できています'
      ],
      efficiency: 92
    }
  },
  'good': {
    wards: [
      { x: 22, y: 18, type: 'control', timestamp: 180000, teamId: 100, isActive: true },
      { x: 45, y: 35, type: 'stealth', timestamp: 240000, teamId: 100, isActive: true },
      { x: 78, y: 75, type: 'stealth', timestamp: 300000, teamId: 100, isActive: true },
      { x: 30, y: 50, type: 'control', timestamp: 360000, teamId: 100, isActive: false },
      { x: 65, y: 40, type: 'farsight', timestamp: 420000, teamId: 100, isActive: true },
      { x: 85, y: 65, type: 'stealth', timestamp: 480000, teamId: 100, isActive: true },
      { x: 15, y: 28, type: 'stealth', timestamp: 540000, teamId: 100, isActive: true },
    ],
    analysis: {
      totalWards: 7,
      wardTypes: { stealth: 5, control: 2, farsight: 1 },
      visionScore: 42,
      mapCoverage: 68,
      keyAreasCovered: ['Dragon Pit', 'Mid River', 'Blue Jungle'],
      suggestions: [
        'バロンピット周辺の視界が不足しています',
        'トップサイドジャングルにもワードを配置することを推奨',
        'コントロールワードの使用回数を増やしましょう',
        '敵ジャングルへの侵入時の視界確保が重要です'
      ],
      efficiency: 75
    }
  },
  'poor': {
    wards: [
      { x: 50, y: 50, type: 'stealth', timestamp: 300000, teamId: 100, isActive: true },
      { x: 40, y: 40, type: 'stealth', timestamp: 420000, teamId: 100, isActive: false },
      { x: 60, y: 60, type: 'stealth', timestamp: 540000, teamId: 100, isActive: true },
      { x: 45, y: 55, type: 'control', timestamp: 600000, teamId: 100, isActive: false },
    ],
    analysis: {
      totalWards: 4,
      wardTypes: { stealth: 3, control: 1, farsight: 0 },
      visionScore: 18,
      mapCoverage: 25,
      keyAreasCovered: ['Mid River'],
      suggestions: [
        'ワード配置が中央に集中しすぎています',
        'バロンとドラゴンピットの視界確保が必要です',
        'ジャングルエントリーポイントの監視が不足',
        'コントロールワードをもっと活用しましょう',
        'ファーサイトワードで安全な視界確保を',
        'レーンの草むらにもワードを配置しましょう'
      ],
      efficiency: 35
    }
  }
};

// Vision Lab用ヘルパー関数
export const getMockVisionData = (efficiency: 'excellent' | 'good' | 'poor' = 'good') => {
  return mockVisionData[efficiency];
};

// ランダムな Vision Lab データを生成
export const generateRandomVisionData = () => {
  const efficiencyLevels: ('excellent' | 'good' | 'poor')[] = ['excellent', 'good', 'poor'];
  const randomLevel = efficiencyLevels[Math.floor(Math.random() * efficiencyLevels.length)];
  return getMockVisionData(randomLevel);
};

// モック試合データ
export const mockMatchDetails: Record<string, MatchData> = {
  'KR_7200123456': {
    metadata: {
      matchId: 'KR_7200123456',
      participants: ['HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ']
    },
    info: {
      gameId: 7200123456,
      gameCreation: 1704000000000,
      gameDuration: 1850, // 30分50秒
      gameMode: 'CLASSIC',
      gameType: 'MATCHED_GAME',
      participants: mockParticipantData['KR_7200123456']
    }
  },
  'KR_7200123457': {
    metadata: {
      matchId: 'KR_7200123457',
      participants: ['HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ']
    },
    info: {
      gameId: 7200123457,
      gameCreation: 1703950000000,
      gameDuration: 2120, // 35分20秒
      gameMode: 'CLASSIC',
      gameType: 'MATCHED_GAME',
      participants: mockParticipantData['KR_7200123457']
    }
  },
  'KR_7200123458': {
    metadata: {
      matchId: 'KR_7200123458',
      participants: ['HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ']
    },
    info: {
      gameId: 7200123458,
      gameCreation: 1703900000000,
      gameDuration: 1680, // 28分
      gameMode: 'CLASSIC',
      gameType: 'MATCHED_GAME',
      participants: mockParticipantData['KR_7200123458']
    }
  },
  'KR_7200123459': {
    metadata: {
      matchId: 'KR_7200123459',
      participants: ['HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ']
    },
    info: {
      gameId: 7200123459,
      gameCreation: 1703850000000,
      gameDuration: 1920, // 32分
      gameMode: 'CLASSIC',
      gameType: 'MATCHED_GAME',
      participants: mockParticipantData['KR_7200123459']
    }
  },
  'KR_7200123460': {
    metadata: {
      matchId: 'KR_7200123460',
      participants: ['HsH2xmxhWa8wSgEuCsrMW9-D7Jg5fP3UlXv5jnQ9X8vH2pQ']
    },
    info: {
      gameId: 7200123460,
      gameCreation: 1703800000000,
      gameDuration: 2250, // 37分30秒
      gameMode: 'CLASSIC',
      gameType: 'MATCHED_GAME',
      participants: mockParticipantData['KR_7200123460']
    }
  }
};

// モックモードかどうかの判定
export const isMockMode = () => {
  return process.env.NODE_ENV === 'development' && 
         (!process.env.RIOT_API_KEY || process.env.USE_MOCK_DATA === 'true');
};

// サモナー名を正規化（大文字小文字、スペースを無視）
export const normalizeSummonerName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
};

// モックサモナーデータを取得（Riot ID形式にも対応）
export const getMockSummoner = (summonerName: string): SummonerData | null => {
  const normalizedName = normalizeSummonerName(summonerName);
  
  // 直接マッチを試行
  if (mockSummonerData[normalizedName]) {
    return mockSummonerData[normalizedName];
  }
  
  // Riot ID形式の場合（GameName#TagLine）
  if (normalizedName.includes('#')) {
    return mockSummonerData[normalizedName] || null;
  }
  
  // 従来のサモナー名検索（スペースを含む場合の処理）
  return mockSummonerData[normalizedName] || null;
};

// モック試合履歴を取得
export const getMockMatchHistory = (puuid: string): string[] => {
  return mockMatchHistory[puuid] || [];
};

// モック試合詳細を取得
export const getMockMatchDetails = (matchId: string): MatchData | null => {
  return mockMatchDetails[matchId] || null;
}; 