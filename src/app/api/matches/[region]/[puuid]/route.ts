import { NextRequest, NextResponse } from 'next/server';
import { riotAPI } from '@/lib/riot-api';

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

    const matchIds = await riotAPI.getMatchHistory(region, puuid, count);
    
    return NextResponse.json({ matchIds });
  } catch (error) {
    console.error('Error in matches API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    );
  }
} 