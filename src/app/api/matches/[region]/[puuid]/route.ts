import { NextRequest, NextResponse } from 'next/server';
import { riotAPI } from '@/lib/riot-api';
import { getMockMatchHistory } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string; puuid: string } }
) {
  try {
    const { region, puuid } = params;
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '20');

    if (!region || !puuid) {
      return NextResponse.json(
        { error: 'Region and PUUID are required' },
        { status: 400 }
      );
    }

    // まずRiot APIを試行
    try {
      console.log('Attempting to fetch match history from Riot API:', {
        region,
        puuid,
        count
      });

      const matchIds = await riotAPI.getMatchHistory(region, puuid, count);
      
      console.log('Match history retrieved successfully from Riot API:', {
        matchCount: matchIds.length
      });
      
      return NextResponse.json({ matchIds });
    } catch (riotError) {
      console.log('Riot API failed, attempting mock data fallback:', {
        error: riotError instanceof Error ? riotError.message : 'Unknown error',
        puuid
      });

      // Riot APIが失敗した場合、モックデータにフォールバック
      const mockMatchIds = getMockMatchHistory(puuid);
      
      if (mockMatchIds.length > 0) {
        console.log('Mock match history found:', {
          matchCount: mockMatchIds.length
        });

        return NextResponse.json({ 
          matchIds: mockMatchIds,
          _isMockData: true 
        });
      }

      // モックデータも見つからない場合は、元のエラーを投げる
      throw riotError;
    }
  } catch (error) {
    console.error('Error in matches API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    );
  }
} 