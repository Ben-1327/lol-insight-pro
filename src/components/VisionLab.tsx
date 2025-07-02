'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, User, Eye, MapPin, Target, TrendingUp, AlertCircle, CheckCircle, Zap, Shield, Sun, Play, Pause, SkipBack, SkipForward, Clock, Users, Calendar } from 'lucide-react';
import { getMapInfo, gameToMapCoordinates, preloadMapImage, MapInfo } from '@/lib/data-dragon';

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

interface MatchTimelineData {
  matchId: string;
  mapId: number;
  frames: TimelineFrame[];
  wardEvents: WardEvent[];
  gameDuration: number;
}

interface MatchHistoryItem {
  matchId: string;
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  mapId: number;
  participants: Array<{
    championName: string;
    summonerName: string;
    teamId: number;
  }>;
}

interface ActiveWard {
  id: string;
  type: 'YELLOW_TRINKET' | 'BLUE_TRINKET' | 'CONTROL_WARD' | 'SIGHT_WARD';
  position: { x: number; y: number };
  teamId: number;
  placedAt: number;
  expiresAt?: number;
  isActive: boolean;
}

export default function VisionLab() {
  const [region, setRegion] = useState('jp1');
  const [summonerName, setSummonerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Map and timeline data
  const [mapInfo, setMapInfo] = useState<MapInfo | null>(null);
  const [timelineData, setTimelineData] = useState<MatchTimelineData | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  
  // Time control
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Vision state
  const [activeWards, setActiveWards] = useState<ActiveWard[]>([]);
  const [teamFilter, setTeamFilter] = useState<'all' | 100 | 200>('all');
  const [wardTypeFilter, setWardTypeFilter] = useState<string[]>(['YELLOW_TRINKET', 'BLUE_TRINKET', 'CONTROL_WARD', 'SIGHT_WARD']);

  const regions = [
    { value: 'jp1', label: 'Japan' },
    { value: 'kr', label: 'Korea' },
    { value: 'na1', label: 'North America' },
    { value: 'euw1', label: 'Europe West' },
    { value: 'eun1', label: 'Europe Nordic & East' },
  ];

  // Load Summoner's Rift map by default
  useEffect(() => {
    const loadDefaultMap = async () => {
      try {
        const map = await getMapInfo(11); // Summoner's Rift
        if (map) {
          setMapInfo(map);
          await preloadMapImage(11);
        }
      } catch (error) {
        console.error('Failed to load default map:', error);
      }
    };

    loadDefaultMap();
  }, []);

  // Time control effect
  useEffect(() => {
    if (!isPlaying || !timelineData) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + (1000 * playbackSpeed);
        if (next >= timelineData.gameDuration) {
          setIsPlaying(false);
          return timelineData.gameDuration;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, timelineData]);

  // Update active wards based on current time
  useEffect(() => {
    if (!timelineData) return;

    const newActiveWards: ActiveWard[] = [];
    
    timelineData.wardEvents.forEach((event, index) => {
      if (event.timestamp > currentTime) return;

      const wardId = `${event.position.x}-${event.position.y}-${event.timestamp}`;
      
      if (event.type === 'WARD_PLACED') {
        // Calculate expiration time based on ward type
        let expiresAt: number | undefined;
        switch (event.wardType) {
          case 'YELLOW_TRINKET':
            expiresAt = event.timestamp + 90000; // 90 seconds
            break;
          case 'BLUE_TRINKET':
            expiresAt = undefined; // Permanent until killed
            break;
          case 'CONTROL_WARD':
            expiresAt = undefined; // Permanent until killed
            break;
          default:
            expiresAt = event.timestamp + 180000; // 3 minutes default
        }

        // Check if ward is still active
        const isExpired = expiresAt && currentTime > expiresAt;
        const isKilled = timelineData.wardEvents.some(e => 
          e.type === 'WARD_KILL' && 
          e.position.x === event.position.x && 
          e.position.y === event.position.y &&
          e.timestamp <= currentTime &&
          e.timestamp > event.timestamp
        );

        if (!isExpired && !isKilled) {
          newActiveWards.push({
            id: wardId,
            type: event.wardType,
            position: event.position,
            teamId: event.teamId,
            placedAt: event.timestamp,
            expiresAt,
            isActive: true
          });
        }
      }
    });

    setActiveWards(newActiveWards);
  }, [currentTime, timelineData]);

  const handleSearch = async () => {
    if (!summonerName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get summoner info
      const summonerResponse = await fetch(`/api/summoner/${region}/${encodeURIComponent(summonerName)}`);
      const summonerResult = await summonerResponse.json();

      if (summonerResult.error) {
        setError(summonerResult.error);
        return;
      }

      // Get match history
      const matchesResponse = await fetch(`/api/matches/${region}/${summonerResult.puuid}?count=10`);
      const matchesResult = await matchesResponse.json();

      if (matchesResult.error || !matchesResult.matchIds?.length) {
        // Generate mock match history
        generateMockMatchHistory();
      } else {
        // Process real match history (would need additional API calls)
        generateMockMatchHistory();
      }

    } catch (error) {
      console.error('Error fetching summoner data:', error);
      generateMockMatchHistory();
    } finally {
      setLoading(false);
    }
  };

  const generateMockMatchHistory = () => {
    const mockMatches: MatchHistoryItem[] = Array.from({ length: 5 }, (_, i) => ({
      matchId: `JP1_${Date.now() - i * 1000000}`,
      gameCreation: Date.now() - i * 3600000, // Each game 1 hour apart
      gameDuration: 1800000 + Math.random() * 600000, // 30-40 minutes
      gameMode: 'CLASSIC',
      mapId: 11,
      participants: [
        { championName: 'Yasuo', summonerName: 'Player1', teamId: 100 },
        { championName: 'Jinx', summonerName: 'Player2', teamId: 100 },
        { championName: 'Thresh', summonerName: 'Player3', teamId: 100 },
        { championName: 'Lee Sin', summonerName: 'Player4', teamId: 100 },
        { championName: 'Ahri', summonerName: 'Player5', teamId: 100 },
        { championName: 'Garen', summonerName: 'Enemy1', teamId: 200 },
        { championName: 'Ashe', summonerName: 'Enemy2', teamId: 200 },
        { championName: 'Leona', summonerName: 'Enemy3', teamId: 200 },
        { championName: 'Graves', summonerName: 'Enemy4', teamId: 200 },
        { championName: 'Zed', summonerName: 'Enemy5', teamId: 200 },
      ]
    }));

    setMatchHistory(mockMatches);
    if (mockMatches.length > 0) {
      selectMatch(mockMatches[0].matchId);
    }
  };

  const selectMatch = async (matchId: string) => {
    setSelectedMatch(matchId);
    setLoading(true);
    
    try {
      const timelineResponse = await fetch(`/api/match-timeline/${region}/${matchId}`);
      const timeline = await timelineResponse.json();
      
      if (timeline.error) {
        setError(timeline.error);
        return;
      }

      setTimelineData(timeline);
      setCurrentTime(0);
      setIsPlaying(false);

      // Load appropriate map
      if (timeline.mapId !== mapInfo?.mapId) {
        const newMapInfo = await getMapInfo(timeline.mapId);
        if (newMapInfo) {
          setMapInfo(newMapInfo);
          await preloadMapImage(timeline.mapId);
        }
      }

    } catch (error) {
      console.error('Error loading match timeline:', error);
      setError('試合データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredWards = useMemo(() => {
    return activeWards.filter(ward => {
      const teamMatch = teamFilter === 'all' || ward.teamId === teamFilter;
      const typeMatch = wardTypeFilter.includes(ward.type);
      return teamMatch && typeMatch;
    });
  }, [activeWards, teamFilter, wardTypeFilter]);

  const getWardColor = (wardType: string, teamId: number) => {
    const baseColor = teamId === 100 ? 'blue' : 'red';
    switch (wardType) {
      case 'CONTROL_WARD':
        return teamId === 100 ? 'bg-pink-500' : 'bg-pink-700';
      case 'BLUE_TRINKET':
        return teamId === 100 ? 'bg-yellow-400' : 'bg-yellow-600';
      default:
        return teamId === 100 ? 'bg-green-500' : 'bg-green-700';
    }
  };

  const getWardIcon = (wardType: string) => {
    switch (wardType) {
      case 'CONTROL_WARD': return <Shield className="w-2 h-2 text-white" />;
      case 'BLUE_TRINKET': return <Sun className="w-2 h-2 text-white" />;
      default: return <Eye className="w-2 h-2 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Eye className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Vision Lab Pro
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            試合ごとの時間軸ワード分析とチーム視界可視化
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="summoner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                サモナー名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="summoner"
                  type="text"
                  value={summonerName}
                  onChange={(e) => setSummonerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="サモナー名またはRiot ID"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                リージョン
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:w-32 flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !summonerName.trim()}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? '検索中...' : '検索'}</span>
              </button>
            </div>
          </div>

          {/* Demo Button */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={generateMockMatchHistory}
              className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
            >
              🎮 デモデータで試す
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Match History */}
        {matchHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span>試合履歴</span>
            </h2>
            
            <div className="space-y-3">
              {matchHistory.map((match) => (
                <div
                  key={match.matchId}
                  onClick={() => selectMatch(match.matchId)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedMatch === match.matchId
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {match.gameMode} • {formatTime(match.gameDuration)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(match.gameCreation).toLocaleString('ja-JP')}
                      </div>
                    </div>
                    <div className="flex -space-x-1">
                      {match.participants.slice(0, 5).map((participant, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                            participant.teamId === 100 ? 'bg-blue-500' : 'bg-red-500'
                          }`}
                          title={`${participant.championName} (${participant.summonerName})`}
                        >
                          {participant.championName.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vision Analysis */}
        {timelineData && mapInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Visualization */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-purple-500" />
                <span>リアルタイム視界マップ</span>
              </h2>
              
              {/* Time Controls */}
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 30000))}
                      className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentTime(Math.min(timelineData.gameDuration, currentTime + 30000))}
                      className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-mono text-lg">{formatTime(currentTime)}</span>
                    <span className="text-gray-500">/</span>
                    <span className="font-mono text-gray-500">{formatTime(timelineData.gameDuration)}</span>
                  </div>
                  
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={4}>4x</option>
                  </select>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={timelineData.gameDuration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mb-4 flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value as 'all' | 100 | 200)}
                    className="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm"
                  >
                    <option value="all">全チーム</option>
                    <option value={100}>青チーム</option>
                    <option value={200}>赤チーム</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <div className="flex gap-1">
                    {[
                      { type: 'YELLOW_TRINKET', label: '黄', color: 'bg-green-500' },
                      { type: 'CONTROL_WARD', label: 'ピ', color: 'bg-pink-500' },
                      { type: 'BLUE_TRINKET', label: '青', color: 'bg-yellow-500' }
                    ].map(({ type, label, color }) => (
                      <button
                        key={type}
                        onClick={() => {
                          if (wardTypeFilter.includes(type)) {
                            setWardTypeFilter(prev => prev.filter(t => t !== type));
                          } else {
                            setWardTypeFilter(prev => [...prev, type]);
                          }
                        }}
                        className={`w-8 h-8 rounded text-white text-xs font-bold ${color} ${
                          wardTypeFilter.includes(type) ? 'opacity-100' : 'opacity-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Map Container */}
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg aspect-square overflow-hidden">
                {/* Map Image */}
                <img
                  src={mapInfo.imageUrl}
                  alt={mapInfo.mapName}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                
                {/* Ward Overlays */}
                {filteredWards.map((ward) => {
                  const coords = gameToMapCoordinates(
                    ward.position.x,
                    ward.position.y,
                    mapInfo.bounds
                  );
                  
                  return (
                    <div
                      key={ward.id}
                      className={`absolute w-4 h-4 rounded-full ${getWardColor(ward.type, ward.teamId)} 
                        border-2 border-white dark:border-gray-800 flex items-center justify-center
                        shadow-lg transform -translate-x-1/2 -translate-y-1/2`}
                      style={{
                        left: `${coords.x}%`,
                        top: `${coords.y}%`,
                      }}
                      title={`${ward.type} - Team ${ward.teamId} - ${formatTime(ward.placedAt)}`}
                    >
                      {getWardIcon(ward.type)}
                    </div>
                  );
                })}

                {/* Map Info Overlay */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {mapInfo.mapName}
                </div>
                
                {/* Ward Count Overlay */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  ワード: {filteredWards.length}
                </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>現在の状況</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {activeWards.filter(w => w.teamId === 100).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">青チーム</div>
                    </div>
                    
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-xl font-bold text-red-600 dark:text-red-400">
                        {activeWards.filter(w => w.teamId === 200).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">赤チーム</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">ワード種別</h4>
                    {Object.entries(
                      activeWards.reduce((acc, ward) => {
                        acc[ward.type] = (acc[ward.type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {type.replace('_', ' ')}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>最近のイベント</span>
                </h3>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {timelineData.wardEvents
                    .filter(event => event.timestamp <= currentTime)
                    .slice(-10)
                    .reverse()
                    .map((event, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <div className={`w-2 h-2 rounded-full ${event.teamId === 100 ? 'bg-blue-500' : 'bg-red-500'}`} />
                        <span className="text-gray-600 dark:text-gray-400">{formatTime(event.timestamp)}</span>
                        <span className="text-gray-900 dark:text-white">
                          {event.type === 'WARD_PLACED' ? '設置' : 
                           event.type === 'WARD_KILL' ? '破壊' : '期限切れ'}
                        </span>
                        <span className="text-gray-500">{event.wardType}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!timelineData && matchHistory.length === 0 && !loading && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-semibold text-purple-700 dark:text-purple-300">Vision Lab Pro へようこそ</h3>
                <p className="text-purple-600 dark:text-purple-400 mt-1">
                  サモナー名を入力して試合を検索するか、デモデータで機能を体験してください。
                  時間軸での視界変化、チーム視界の比較、リアルタイムマップ分析が可能です。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 