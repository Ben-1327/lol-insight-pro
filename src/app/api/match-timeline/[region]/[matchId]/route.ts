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

interface ObjectiveEvent {
  type: 'BUILDING_KILL' | 'ELITE_MONSTER_KILL' | 'CHAMPION_KILL';
  timestamp: number;
  position?: { x: number; y: number };
  monsterType?: string;
  buildingType?: string;
  teamId: number;
  participantId?: number;
}

interface TimelineFrame {
  timestamp: number;
  events: (WardEvent | ObjectiveEvent)[];
}

interface MatchTimelineResponse {
  matchId: string;
  mapId: number;
  frames: TimelineFrame[];
  wardEvents: WardEvent[];
  objectiveEvents: ObjectiveEvent[];
  gameDuration: number;
  participants: Array<{
    participantId: number;
    summonerName: string;
    teamId: number;
    championName: string;
  }>;
}

// モックデータ生成関数（APIエラー時のフォールバック）
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
      participantId: 6,
      teamId: 200
    },
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
      participantId: 7,
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
      participantId: 8,
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

  const objectiveEvents: ObjectiveEvent[] = [
    {
      type: 'ELITE_MONSTER_KILL',
      timestamp: 300000, // 5:00
      position: { x: 9866, y: 4414 },
      monsterType: 'DRAGON',
      teamId: 100,
      participantId: 1
    },
    {
      type: 'ELITE_MONSTER_KILL',
      timestamp: 900000, // 15:00
      position: { x: 4954, y: 10387 },
      monsterType: 'RIFTHERALD',
      teamId: 200,
      participantId: 6
    },
    {
      type: 'ELITE_MONSTER_KILL',
      timestamp: 1500000, // 25:00
      position: { x: 4954, y: 10387 },
      monsterType: 'BARON',
      teamId: 100,
      participantId: 3
    }
  ];

  // Group events by timestamp frames (every 60 seconds)
  const frames: TimelineFrame[] = [];
  const frameInterval = 60000; // 1 minute
  const gameDuration = 2100000; // 35 minutes

  for (let time = 0; time <= gameDuration; time += frameInterval) {
    const frameWardEvents = wardEvents.filter(
      event => event.timestamp >= time && event.timestamp < time + frameInterval
    );
    const frameObjectiveEvents = objectiveEvents.filter(
      event => event.timestamp >= time && event.timestamp < time + frameInterval
    );
    
    frames.push({
      timestamp: time,
      events: [...frameWardEvents, ...frameObjectiveEvents]
    });
  }

  return {
    matchId,
    mapId: 11, // Summoner's Rift
    frames,
    wardEvents,
    objectiveEvents,
    gameDuration,
    participants: [
      { participantId: 1, summonerName: 'Player1', teamId: 100, championName: 'Yasuo' },
      { participantId: 2, summonerName: 'Player2', teamId: 100, championName: 'Jinx' },
      { participantId: 3, summonerName: 'Player3', teamId: 100, championName: 'Thresh' },
      { participantId: 4, summonerName: 'Player4', teamId: 100, championName: 'Lee Sin' },
      { participantId: 5, summonerName: 'Player5', teamId: 100, championName: 'Ahri' },
      { participantId: 6, summonerName: 'Enemy1', teamId: 200, championName: 'Garen' },
      { participantId: 7, summonerName: 'Enemy2', teamId: 200, championName: 'Ashe' },
      { participantId: 8, summonerName: 'Enemy3', teamId: 200, championName: 'Leona' },
      { participantId: 9, summonerName: 'Enemy4', teamId: 200, championName: 'Graves' },
      { participantId: 10, summonerName: 'Enemy5', teamId: 200, championName: 'Zed' },
    ]
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

    const apiKey = process.env.RIOT_API_KEY;
    if (!apiKey) {
      console.warn('Riot API key not configured, using mock data');
      const mockData = generateMockTimelineData(matchId);
      return NextResponse.json(mockData);
    }

    try {
      // Get match timeline data
      const timelineUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline?api_key=${apiKey}`;
      const timelineResponse = await fetch(timelineUrl);

      if (!timelineResponse.ok) {
        console.warn(`Timeline API failed with status ${timelineResponse.status}, using mock data`);
        const mockData = generateMockTimelineData(matchId);
        return NextResponse.json(mockData);
      }

      const timelineData = await timelineResponse.json();

      // Get match details for participant info
      const matchUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`;
      const matchResponse = await fetch(matchUrl);

      if (!matchResponse.ok) {
        console.warn(`Match API failed with status ${matchResponse.status}, using mock data`);
        const mockData = generateMockTimelineData(matchId);
        return NextResponse.json(mockData);
      }

      const matchData = await matchResponse.json();

      // Extract ward events from timeline
      const wardEvents: WardEvent[] = [];
      const objectiveEvents: ObjectiveEvent[] = [];
      
      timelineData.info.frames.forEach((frame: any) => {
        frame.events.forEach((event: any) => {
          if (event.type === 'WARD_PLACED' || event.type === 'WARD_KILL') {
            const wardType = mapWardType(event.wardType);
            if (wardType && event.position) {
              wardEvents.push({
                type: event.type,
                timestamp: event.timestamp,
                position: event.position,
                wardType: wardType,
                killerId: event.killerId,
                creatorId: event.creatorId,
                participantId: event.participantId || event.killerId || 0,
                teamId: getParticipantTeam(event.participantId || event.killerId || 0, matchData.info.participants)
              });
            }
          }

          // Extract objective events
          if (event.type === 'ELITE_MONSTER_KILL' || event.type === 'BUILDING_KILL') {
            objectiveEvents.push({
              type: event.type,
              timestamp: event.timestamp,
              position: event.position,
              monsterType: event.monsterType,
              buildingType: event.buildingType,
              teamId: getParticipantTeam(event.killerId || event.participantId || 0, matchData.info.participants),
              participantId: event.killerId || event.participantId
            });
          }
        });
      });

      // Extract participant info
      const participants = matchData.info.participants.map((participant: any, index: number) => ({
        participantId: index + 1,
        summonerName: participant.summonerName,
        teamId: participant.teamId,
        championName: participant.championName
      }));

      // Group events by timestamp frames
      const frames: TimelineFrame[] = [];
      const frameInterval = 60000; // 1 minute
      const gameDuration = matchData.info.gameDuration * 1000; // Convert to milliseconds

      for (let time = 0; time <= gameDuration; time += frameInterval) {
        const frameWardEvents = wardEvents.filter(
          event => event.timestamp >= time && event.timestamp < time + frameInterval
        );
        const frameObjectiveEvents = objectiveEvents.filter(
          event => event.timestamp >= time && event.timestamp < time + frameInterval
        );
        
        frames.push({
          timestamp: time,
          events: [...frameWardEvents, ...frameObjectiveEvents]
        });
      }

      return NextResponse.json({
        matchId,
        mapId: matchData.info.mapId,
        frames,
        wardEvents,
        objectiveEvents,
        gameDuration,
        participants
      });

    } catch (apiError) {
      console.error('API request failed:', apiError);
      console.log('Falling back to mock data');
      const mockData = generateMockTimelineData(matchId);
      return NextResponse.json(mockData);
    }

  } catch (error) {
    console.error('Error processing match timeline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to map ward types from API to our enum
function mapWardType(apiWardType: string): 'YELLOW_TRINKET' | 'BLUE_TRINKET' | 'CONTROL_WARD' | 'SIGHT_WARD' | null {
  switch (apiWardType) {
    case 'YELLOW_TRINKET':
    case 'SIGHT_WARD':
      return 'YELLOW_TRINKET';
    case 'BLUE_TRINKET':
    case 'FARSIGHT_ALTERATION':
      return 'BLUE_TRINKET';
    case 'CONTROL_WARD':
    case 'VISION_WARD':
      return 'CONTROL_WARD';
    default:
      return 'YELLOW_TRINKET'; // Default fallback
  }
}

// Helper function to get participant team
function getParticipantTeam(participantId: number, participants: any[]): number {
  const participant = participants.find((p: any, index: number) => (index + 1) === participantId);
  return participant ? participant.teamId : 100; // Default to team 100
} 