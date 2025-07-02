import { SummonerData, MatchData, ParticipantData } from './riot-api';

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
  },
  // Account Overview用の追加アカウント
  'challenger#kr': {
    id: 'challenger-summoner-id-001',
    accountId: 'challenger-account-id-001',
    puuid: 'challenger-puuid-001',
    name: 'ChallengerPlayer',
    profileIconId: 4999,
    revisionDate: 1704000000000,
    summonerLevel: 500
  },
  'diamond#main': {
    id: 'diamond-summoner-id-002',
    accountId: 'diamond-account-id-002',
    puuid: 'diamond-puuid-002',
    name: 'DiamondPlayer',
    profileIconId: 4850,
    revisionDate: 1704000000000,
    summonerLevel: 340
  },
  'goldplayer#jp1': {
    id: 'gold-summoner-id-003',
    accountId: 'gold-account-id-003',
    puuid: 'gold-puuid-003',
    name: 'GoldPlayer',
    profileIconId: 4600,
    revisionDate: 1704000000000,
    summonerLevel: 180
  },
  'silverace#euw': {
    id: 'silver-summoner-id-004',
    accountId: 'silver-account-id-004',
    puuid: 'silver-puuid-004',
    name: 'SilverAce',
    profileIconId: 4400,
    revisionDate: 1704000000000,
    summonerLevel: 120
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
  ],
  // Account Overview用の追加アカウント
  'challenger-puuid-001': [
    'KR_8000123456',
    'KR_8000123457',
    'KR_8000123458',
    'KR_8000123459',
    'KR_8000123460'
  ],
  'diamond-puuid-002': [
    'KR_7500123456',
    'KR_7500123457',
    'KR_7500123458',
    'KR_7500123459',
    'KR_7500123460'
  ],
  'gold-puuid-003': [
    'JP1_6000123456',
    'JP1_6000123457',
    'JP1_6000123458',
    'JP1_6000123459',
    'JP1_6000123460'
  ],
  'silver-puuid-004': [
    'EUW1_5500123456',
    'EUW1_5500123457',
    'EUW1_5500123458',
    'EUW1_5500123459',
    'EUW1_5500123460'
  ]
};

// 新しいアカウント用のモック参加者データを追加
const createMockParticipantData = (puuid: string, summonerId: string, summonerName: string, skillLevel: 'challenger' | 'diamond' | 'gold' | 'silver'): Record<string, ParticipantData[]> => {
  const baseStats = {
    challenger: { kda: 3.5, cs: 300, gold: 20000, damage: 35000 },
    diamond: { kda: 2.8, cs: 280, gold: 18000, damage: 30000 },
    gold: { kda: 2.2, cs: 220, gold: 15000, damage: 25000 },
    silver: { kda: 1.8, cs: 180, gold: 12000, damage: 20000 }
  };

  const stats = baseStats[skillLevel];
  const champions = ['Azir', 'LeBlanc', 'Yasuo', 'Syndra', 'Orianna'];

  return {
    [`${puuid.split('-')[0]}_${skillLevel.toUpperCase()}123456`]: [{
      puuid,
      summonerId,
      summonerName,
      championId: 134,
      championName: champions[0],
      kills: Math.floor(stats.kda * 3),
      deaths: 3,
      assists: Math.floor(stats.kda * 4),
      totalMinionsKilled: Math.floor(stats.cs * 0.8),
      neutralMinionsKilled: Math.floor(stats.cs * 0.2),
      goldEarned: stats.gold,
      totalDamageDealtToChampions: stats.damage,
      visionScore: 35,
      wardsPlaced: 18,
      wardsKilled: 8
    }]
  };
};

// モック参加者データ（既存 + 新規）
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
  }],
  // Challenger レベル
  'KR_8000123456': [{
    puuid: 'challenger-puuid-001',
    summonerId: 'challenger-summoner-id-001',
    summonerName: 'ChallengerPlayer',
    championId: 134,
    championName: 'Syndra',
    kills: 12,
    deaths: 2,
    assists: 15,
    totalMinionsKilled: 320,
    neutralMinionsKilled: 25,
    goldEarned: 22000,
    totalDamageDealtToChampions: 38000,
    visionScore: 45,
    wardsPlaced: 25,
    wardsKilled: 12
  }],
  // Diamond レベル
  'KR_7500123456': [{
    puuid: 'diamond-puuid-002',
    summonerId: 'diamond-summoner-id-002',
    summonerName: 'DiamondPlayer',
    championId: 103,
    championName: 'Ahri',
    kills: 8,
    deaths: 3,
    assists: 12,
    totalMinionsKilled: 280,
    neutralMinionsKilled: 20,
    goldEarned: 18500,
    totalDamageDealtToChampions: 31000,
    visionScore: 38,
    wardsPlaced: 20,
    wardsKilled: 10
  }],
  // Gold レベル
  'JP1_6000123456': [{
    puuid: 'gold-puuid-003',
    summonerId: 'gold-summoner-id-003',
    summonerName: 'GoldPlayer',
    championId: 157,
    championName: 'Yasuo',
    kills: 6,
    deaths: 4,
    assists: 8,
    totalMinionsKilled: 220,
    neutralMinionsKilled: 15,
    goldEarned: 15200,
    totalDamageDealtToChampions: 25500,
    visionScore: 25,
    wardsPlaced: 15,
    wardsKilled: 7
  }],
  // Silver レベル
  'EUW1_5500123456': [{
    puuid: 'silver-puuid-004',
    summonerId: 'silver-summoner-id-004',
    summonerName: 'SilverAce',
    championId: 91,
    championName: 'Talon',
    kills: 4,
    deaths: 5,
    assists: 6,
    totalMinionsKilled: 180,
    neutralMinionsKilled: 10,
    goldEarned: 12800,
    totalDamageDealtToChampions: 21000,
    visionScore: 18,
    wardsPlaced: 12,
    wardsKilled: 5
  }]
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