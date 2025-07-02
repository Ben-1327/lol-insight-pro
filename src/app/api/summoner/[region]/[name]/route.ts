import { NextRequest, NextResponse } from 'next/server';
import { riotAPI } from '@/lib/riot-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string; name: string } }
) {
  try {
    const { region, name } = params;

    if (!region || !name) {
      return NextResponse.json(
        { error: 'Region and summoner name are required' },
        { status: 400 }
      );
    }

    const summonerData = await riotAPI.getSummonerByName(region, name);
    
    return NextResponse.json(summonerData);
  } catch (error) {
    console.error('Error in summoner API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summoner data' },
      { status: 500 }
    );
  }
} 