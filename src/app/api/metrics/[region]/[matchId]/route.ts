import { NextRequest, NextResponse } from 'next/server';
import { riotAPI } from '@/lib/riot-api';

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

    // 試合詳細を取得
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
  } catch (error) {
    console.error('Error in metrics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match metrics' },
      { status: 500 }
    );
  }
} 