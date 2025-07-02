import { NextRequest, NextResponse } from 'next/server';

interface WardEvent {
  type: 'WARD_PLACED' | 'WARD_KILL' | 'WARD_EXPIRED';
  timestamp: number;
  position: { x: number; y: number };
  wardType: 'YELLOW_TRINKET' | 'BLUE_TRINKET' | 'CONTROL_WARD' | 'SIGHT_WARD';
  killerId?: string;
  creatorId?: string;
  participantId: number;
  teamId: number;
}

interface TimelineFrame {
  timestamp: number;
  events: WardEvent[];
}

interface MatchTimelineResponse {
  matchId: string;
  mapId: number;
  frames: TimelineFrame[];
  wardEvents: WardEvent[];
  gameDuration: number;
}

// Mock timeline data for development
const generateMockTimelineData = (matchId: string): MatchTimelineResponse => {
  const wardEvents: WardEvent[] = [
    // Early game wards (0-10 min)
    {
      type: 'WARD_PLACED',
      timestamp: 90000, // 1:30
      position: { x: 2800, y: 6400 },
      wardType: 'YELLOW_TRINKET',
      creatorId: 'player1',
      participantId: 1,
      teamId: 100
    },
    {
      type: 'WARD_PLACED',
      timestamp: 180000, // 3:00
      position: { x: 9800, y: 3200 },
      wardType: 'CONTROL_WARD',
      creatorId: 'player2',
      participantId: 2,
      teamId: 100
    },
    {
      type: 'WARD_PLACED',
      timestamp: 240000, // 4:00
      position: { x: 7400, y: 11200 },
      wardType: 'YELLOW_TRINKET',
      creatorId: 'player3',
      participantId: 3,
      teamId: 200
    },
    
    // Mid game wards (10-20 min)
    {
      type: 'WARD_PLACED',
      timestamp: 600000, // 10:00
      position: { x: 4900, y: 6600 },
      wardType: 'CONTROL_WARD',
      creatorId: 'player1',
      participantId: 1,
      teamId: 100
    },
    {
      type: 'WARD_KILL',
      timestamp: 660000, // 11:00
      position: { x: 9800, y: 3200 },
      wardType: 'CONTROL_WARD',
      killerId: 'player4',
      participantId: 4,
      teamId: 200
    },
    {
      type: 'WARD_PLACED',
      timestamp: 720000, // 12:00
      position: { x: 11200, y: 7800 },
      wardType: 'BLUE_TRINKET',
      creatorId: 'player5',
      participantId: 5,
      teamId: 100
    },
    
    // Late game wards (20+ min)
    {
      type: 'WARD_PLACED',
      timestamp: 1200000, // 20:00
      position: { x: 3200, y: 9800 },
      wardType: 'CONTROL_WARD',
      creatorId: 'player2',
      participantId: 2,
      teamId: 100
    },
    {
      type: 'WARD_PLACED',
      timestamp: 1260000, // 21:00
      position: { x: 12800, y: 4200 },
      wardType: 'YELLOW_TRINKET',
      creatorId: 'player6',
      participantId: 6,
      teamId: 200
    },
    {
      type: 'WARD_EXPIRED',
      timestamp: 1320000, // 22:00
      position: { x: 2800, y: 6400 },
      wardType: 'YELLOW_TRINKET',
      participantId: 1,
      teamId: 100
    }
  ];

  // Group events by timestamp frames (every 60 seconds)
  const frames: TimelineFrame[] = [];
  const frameInterval = 60000; // 1 minute

  for (let time = 0; time <= 1800000; time += frameInterval) { // 30 minutes max
    const frameEvents = wardEvents.filter(
      event => event.timestamp >= time && event.timestamp < time + frameInterval
    );
    
    frames.push({
      timestamp: time,
      events: frameEvents
    });
  }

  return {
    matchId,
    mapId: 11, // Summoner's Rift
    frames,
    wardEvents,
    gameDuration: 1800000 // 30 minutes
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string; matchId: string } }
) {
  try {
    const { region, matchId } = params;

    if (!region || !matchId) {
      return NextResponse.json(
        { error: 'Region and Match ID are required' },
        { status: 400 }
      );
    }

    // For now, return mock data
    // In production, this would call the actual Riot API timeline endpoint
    const timelineData = generateMockTimelineData(matchId);

    return NextResponse.json(timelineData);

    // Production code would look like this:
    /*
    const apiKey = process.env.RIOT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Riot API key not configured' },
        { status: 500 }
      );
    }

    const timelineUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline?api_key=${apiKey}`;
    const timelineResponse = await fetch(timelineUrl);

    if (!timelineResponse.ok) {
      const errorText = await timelineResponse.text();
      return NextResponse.json(
        { error: `Failed to fetch match timeline: ${errorText}` },
        { status: timelineResponse.status }
      );
    }

    const timelineData = await timelineResponse.json();
    
    // Extract ward events from timeline
    const wardEvents: WardEvent[] = [];
    
    timelineData.info.frames.forEach((frame: any) => {
      frame.events.forEach((event: any) => {
        if (event.type === 'WARD_PLACED' || event.type === 'WARD_KILL') {
          wardEvents.push({
            type: event.type,
            timestamp: event.timestamp,
            position: event.position,
            wardType: event.wardType,
            killerId: event.killerId,
            creatorId: event.creatorId,
            participantId: event.participantId,
            teamId: event.teamId
          });
        }
      });
    });

    return NextResponse.json({
      matchId,
      mapId: timelineData.info.mapId,
      frames: timelineData.info.frames,
      wardEvents,
      gameDuration: timelineData.info.gameDuration
    });
    */

  } catch (error) {
    console.error('Error fetching match timeline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 