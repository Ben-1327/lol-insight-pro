import axios, { AxiosInstance } from 'axios';

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
      throw new Error(`Unsupported region: ${region}`);
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

  /**
   * サモナー情報を取得
   */
  async getSummonerByName(region: string, summonerName: string): Promise<SummonerData> {
    try {
      const client = this.getPlatformClient(region);
      const response = await client.get(`/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching summoner data:', error);
      throw new Error(`Failed to fetch summoner: ${summonerName}`);
    }
  }

  /**
   * 試合履歴を取得
   */
  async getMatchHistory(region: string, puuid: string, count: number = 20): Promise<string[]> {
    try {
      const client = this.getRegionalClient(region);
      const response = await client.get(`/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        params: {
          start: 0,
          count: count,
          type: 'ranked',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching match history:', error);
      throw new Error(`Failed to fetch match history for: ${puuid}`);
    }
  }

  /**
   * 試合詳細を取得
   */
  async getMatchDetails(region: string, matchId: string): Promise<MatchData> {
    try {
      const client = this.getRegionalClient(region);
      const response = await client.get(`/lol/match/v5/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw new Error(`Failed to fetch match details: ${matchId}`);
    }
  }

  /**
   * 試合タイムラインを取得
   */
  async getMatchTimeline(region: string, matchId: string): Promise<TimelineData> {
    try {
      const client = this.getRegionalClient(region);
      const response = await client.get(`/lol/match/v5/matches/${matchId}/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match timeline:', error);
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