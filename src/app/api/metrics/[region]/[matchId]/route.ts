import { NextRequest, NextResponse } from 'next/server';
import { riotAPI } from '@/lib/riot-api';
import { getMockMatchDetails } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string; matchId: string } }
) {
  try {
    const { region, matchId } = params;
    const { searchParams } = new URL(request.url);
    const puuid = searchParams.get('puuid');

    if (!region || !matchId || !puuid) {
      return NextResponse.json(
        { error: 'Region, matchId, and puuid are required' },
        { status: 400 }
      );
    }

    // まずRiot APIを試行
    try {
      console.log('Attempting to fetch match details from Riot API:', {
        region,
        matchId,
        puuid
      });

      const matchData = await riotAPI.getMatchDetails(region, matchId);
      
      // 指定されたPUUIDの参加者データを検索
      const participant = matchData.info.participants.find(p => p.puuid === puuid);
      
      if (!participant) {
        return NextResponse.json(
          { error: 'Participant not found in match' },
          { status: 404 }
        );
      }

      // 基本メトリクスを計算
      const metrics = riotAPI.calculateBasicMetrics(participant, matchData.info.gameDuration);
      
      return NextResponse.json({
        matchId,
        puuid,
        championName: participant.championName,
        gameMode: matchData.info.gameMode,
        gameDuration: matchData.info.gameDuration,
        metrics,
        rawStats: {
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
          totalCS: participant.totalMinionsKilled + participant.neutralMinionsKilled,
          goldEarned: participant.goldEarned,
          totalDamage: participant.totalDamageDealtToChampions,
          visionScore: participant.visionScore,
          wardsPlaced: participant.wardsPlaced,
        }
      });
    } catch (riotError) {
      console.log('Riot API failed, attempting mock data fallback:', {
        error: riotError instanceof Error ? riotError.message : 'Unknown error',
        matchId
      });

      // Riot APIが失敗した場合、モックデータにフォールバック
      const mockMatchData = getMockMatchDetails(matchId);
      
      if (mockMatchData) {
        const participant = mockMatchData.info.participants.find(p => p.puuid === puuid);
        
        if (participant) {
          console.log('Mock match data found:', {
            matchId,
            championName: participant.championName
          });

          // 基本メトリクスを計算
          const metrics = riotAPI.calculateBasicMetrics(participant, mockMatchData.info.gameDuration);
          
          return NextResponse.json({
            matchId,
            puuid,
            championName: participant.championName,
            gameMode: mockMatchData.info.gameMode,
            gameDuration: mockMatchData.info.gameDuration,
            metrics,
            rawStats: {
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              totalCS: participant.totalMinionsKilled + participant.neutralMinionsKilled,
              goldEarned: participant.goldEarned,
              totalDamage: participant.totalDamageDealtToChampions,
              visionScore: participant.visionScore,
              wardsPlaced: participant.wardsPlaced,
            },
            _isMockData: true
          });
        }
      }

      // モックデータも見つからない場合は、元のエラーを投げる
      throw riotError;
    }
  } catch (error) {
    console.error('Error in metrics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match metrics' },
      { status: 500 }
    );
  }
} 