import axios, { AxiosInstance, AxiosError } from 'axios';

// リージョンマッピング
const REGION_MAPPING: Record<string, string> = {
  'jp1': 'asia',
  'kr': 'asia',
  'na1': 'americas',
  'euw1': 'europe',
  'eun1': 'europe',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',
  'oc1': 'sea',
  'tr1': 'europe',
  'ru': 'europe',
  'ph2': 'sea',
  'sg2': 'sea',
  'th2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea',
};

export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface AccountData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface MatchData {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameId: number;
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    gameType: string;
    participants: ParticipantData[];
  };
}

export interface ParticipantData {
  puuid: string;
  summonerId: string;
  summonerName: string;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
}

export interface TimelineData {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    frameInterval: number;
    frames: FrameData[];
  };
}

export interface FrameData {
  timestamp: number;
  events: EventData[];
  participantFrames: Record<string, ParticipantFrameData>;
}

export interface EventData {
  type: string;
  timestamp: number;
  participantId?: number;
  position?: {
    x: number;
    y: number;
  };
  wardType?: string;
  monsterType?: string;
  monsterSubType?: string;
}

export interface ParticipantFrameData {
  participantId: number;
  totalGold: number;
  level: number;
  currentGold: number;
  minionsKilled: number;
  jungleMinionsKilled: number;
  position: {
    x: number;
    y: number;
  };
}

class RiotAPI {
  private apiKey: string;
  private regionalClients: Record<string, AxiosInstance> = {};
  private platformClients: Record<string, AxiosInstance> = {};

  constructor() {
    this.apiKey = process.env.RIOT_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Riot API key is required');
    }
  }

  private getRegionalClient(region: string): AxiosInstance {
    const regionalEndpoint = REGION_MAPPING[region.toLowerCase()];
    if (!regionalEndpoint) {
      console.error('Unsupported region:', region, 'Available regions:', Object.keys(REGION_MAPPING));
      throw new Error(`Unsupported region: ${region}. Available regions: ${Object.keys(REGION_MAPPING).join(', ')}`);
    }

    if (!this.regionalClients[regionalEndpoint]) {
      this.regionalClients[regionalEndpoint] = axios.create({
        baseURL: `https://${regionalEndpoint}.api.riotgames.com`,
        headers: {
          'X-Riot-Token': this.apiKey,
        },
        timeout: 10000,
      });
    }

    return this.regionalClients[regionalEndpoint];
  }

  private getPlatformClient(region: string): AxiosInstance {
    const platformCode = region.toLowerCase();
    
    if (!this.platformClients[platformCode]) {
      console.log('Creating platform client for region:', platformCode);
      this.platformClients[platformCode] = axios.create({
        baseURL: `https://${platformCode}.api.riotgames.com`,
        headers: {
          'X-Riot-Token': this.apiKey,
        },
        timeout: 10000,
      });
    }

    return this.platformClients[platformCode];
  }

  private handleAxiosError(error: AxiosError, context: string): never {
    console.error(`Riot API Error in ${context}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      headers: error.config?.headers
    });

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data as any;
      
      switch (status) {
        case 400:
          throw new Error(`Bad request: ${errorData?.status?.message || 'Invalid request parameters'}`);
        case 401:
          throw new Error(`Unauthorized: Invalid API key`);
        case 403:
          throw new Error(`Forbidden: API key expired or insufficient permissions`);
        case 404:
          throw new Error(`Not found: ${errorData?.status?.message || 'Resource not found'}`);
        case 429:
          throw new Error(`Rate limit exceeded: Too many requests. Please wait before trying again.`);
        case 500:
          throw new Error(`Server error: Riot API is currently experiencing issues`);
        case 502:
        case 503:
        case 504:
          throw new Error(`Service unavailable: Riot API is currently down`);
        default:
          throw new Error(`HTTP ${status}: ${errorData?.status?.message || error.response.statusText}`);
      }
    } else if (error.request) {
      throw new Error(`Network error: Cannot reach Riot API servers`);
    } else {
      throw new Error(`Request setup error: ${error.message}`);
    }
  }

  /**
   * Riot IDでアカウント情報を取得（推奨方法）
   */
  async getAccountByRiotId(region: string, gameName: string, tagLine: string): Promise<AccountData> {
    try {
      console.log('Fetching account data by Riot ID:', { region, gameName, tagLine });
      
      const client = this.getRegionalClient(region);
      const encodedGameName = encodeURIComponent(gameName);
      const encodedTagLine = encodeURIComponent(tagLine);
      const url = `/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;
      
      console.log('Making request to:', `${client.defaults.baseURL}${url}`);
      
      const response = await client.get(url);
      
      console.log('Account data received:', {
        gameName: response.data.gameName,
        tagLine: response.data.tagLine,
        puuid: response.data.puuid
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, `getAccountByRiotId(${region}, ${gameName}#${tagLine})`);
      }
      console.error('Unexpected error fetching account data:', error);
      throw new Error(`Failed to fetch account: ${gameName}#${tagLine}`);
    }
  }

  /**
   * PUUIDからサモナー情報を取得
   */
  async getSummonerByPuuid(region: string, puuid: string): Promise<SummonerData> {
    try {
      console.log('Fetching summoner data by PUUID:', { region, puuid });
      
      const client = this.getPlatformClient(region);
      const url = `/lol/summoner/v4/summoners/by-puuid/${puuid}`;
      
      console.log('Making request to:', `${client.defaults.baseURL}${url}`);
      
      const response = await client.get(url);
      
      console.log('Summoner data received:', {
        name: response.data.name,
        level: response.data.summonerLevel,
        id: response.data.id
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, `getSummonerByPuuid(${region}, ${puuid})`);
      }
      console.error('Unexpected error fetching summoner data:', error);
      throw new Error(`Failed to fetch summoner by PUUID: ${puuid}`);
    }
  }

  /**
   * サモナー情報を取得（両方式に対応）
   */
  async getSummonerByName(region: string, summonerName: string): Promise<SummonerData> {
    try {
      console.log('Fetching summoner data:', { region, summonerName });
      
      // Riot ID形式（GameName#TagLine）かチェック
      if (summonerName.includes('#')) {
        const [gameName, tagLine] = summonerName.split('#');
        if (gameName && tagLine) {
          console.log('Detected Riot ID format, using account-v1 API');
          
          // Riot IDでアカウント情報を取得
          const accountData = await this.getAccountByRiotId(region, gameName, tagLine);
          
          // PUUIDでサモナー情報を取得
          return await this.getSummonerByPuuid(region, accountData.puuid);
        }
      }
      
      // 従来のサモナー名検索
      console.log('Using legacy summoner name search');
      const client = this.getPlatformClient(region);
      const encodedName = encodeURIComponent(summonerName);
      const url = `/lol/summoner/v4/summoners/by-name/${encodedName}`;
      
      console.log('Making request to:', `${client.defaults.baseURL}${url}`);
      
      const response = await client.get(url);
      
      console.log('Summoner data received:', {
        name: response.data.name,
        level: response.data.summonerLevel,
        id: response.data.id
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, `getSummonerByName(${region}, ${summonerName})`);
      }
      console.error('Unexpected error fetching summoner data:', error);
      throw new Error(`Failed to fetch summoner: ${summonerName}`);
    }
  }

  /**
   * 試合履歴を取得
   */
  async getMatchHistory(region: string, puuid: string, count: number = 20): Promise<string[]> {
    try {
      console.log('Fetching match history:', { region, puuid, count });
      
      const client = this.getRegionalClient(region);
      const response = await client.get(`/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        params: {
          start: 0,
          count: count,
          type: 'ranked',
        },
      });
      
      console.log('Match history received:', { matchCount: response.data.length });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, `getMatchHistory(${region}, ${puuid})`);
      }
      console.error('Unexpected error fetching match history:', error);
      throw new Error(`Failed to fetch match history for: ${puuid}`);
    }
  }

  /**
   * 試合詳細を取得
   */
  async getMatchDetails(region: string, matchId: string): Promise<MatchData> {
    try {
      console.log('Fetching match details:', { region, matchId });
      
      const client = this.getRegionalClient(region);
      const response = await client.get(`/lol/match/v5/matches/${matchId}`);
      
      console.log('Match details received for:', matchId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, `getMatchDetails(${region}, ${matchId})`);
      }
      console.error('Unexpected error fetching match details:', error);
      throw new Error(`Failed to fetch match details: ${matchId}`);
    }
  }

  /**
   * 試合タイムラインを取得
   */
  async getMatchTimeline(region: string, matchId: string): Promise<TimelineData> {
    try {
      console.log('Fetching match timeline:', { region, matchId });
      
      const client = this.getRegionalClient(region);
      const response = await client.get(`/lol/match/v5/matches/${matchId}/timeline`);
      
      console.log('Match timeline received for:', matchId);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, `getMatchTimeline(${region}, ${matchId})`);
      }
      console.error('Unexpected error fetching match timeline:', error);
      throw new Error(`Failed to fetch match timeline: ${matchId}`);
    }
  }

  /**
   * 基本メトリクスを計算
   */
  calculateBasicMetrics(participantData: ParticipantData, gameDurationSeconds: number): {
    kda: number;
    csPerMin: number;
    goldPerMin: number;
    damagePerMin: number;
  } {
    const gameDurationMinutes = gameDurationSeconds / 60;
    const totalCS = participantData.totalMinionsKilled + participantData.neutralMinionsKilled;
    
    const kda = participantData.deaths === 0 
      ? participantData.kills + participantData.assists 
      : (participantData.kills + participantData.assists) / participantData.deaths;

    return {
      kda: Math.round(kda * 100) / 100,
      csPerMin: Math.round((totalCS / gameDurationMinutes) * 100) / 100,
      goldPerMin: Math.round((participantData.goldEarned / gameDurationMinutes) * 100) / 100,
      damagePerMin: Math.round((participantData.totalDamageDealtToChampions / gameDurationMinutes) * 100) / 100,
    };
  }
}

export const riotAPI = new RiotAPI(); 