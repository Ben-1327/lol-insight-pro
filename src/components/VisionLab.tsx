'use client';

import { useState, useEffect } from 'react';
import { Search, User, Eye, MapPin, Target, TrendingUp, AlertCircle, CheckCircle, Zap, Shield, Sun } from 'lucide-react';
import { WardPlacement, VisionAnalysis, generateRandomVisionData, getMockVisionData } from '@/lib/mock-data';

interface MapRegion {
  name: string;
  x: number;
  y: number;
  radius: number;
  importance: 'high' | 'medium' | 'low';
  description: string;
}

const MAP_REGIONS: MapRegion[] = [
  { name: 'Blue Baron', x: 20, y: 20, radius: 8, importance: 'high', description: 'バロンピット周辺' },
  { name: 'Dragon Pit', x: 80, y: 80, radius: 8, importance: 'high', description: 'ドラゴンピット周辺' },
  { name: 'Mid River', x: 50, y: 40, radius: 6, importance: 'medium', description: '中央川' },
  { name: 'Blue Jungle', x: 25, y: 45, radius: 10, importance: 'medium', description: '青チーム森' },
  { name: 'Red Jungle', x: 75, y: 55, radius: 10, importance: 'medium', description: '赤チーム森' },
  { name: 'Top Lane Bush', x: 15, y: 30, radius: 5, importance: 'low', description: 'トップレーン草むら' },
  { name: 'Bot Lane Bush', x: 85, y: 70, radius: 5, importance: 'low', description: 'ボットレーン草むら' },
];

export default function VisionLab() {
  const [region, setRegion] = useState('jp1');
  const [summonerName, setSummonerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [visionData, setVisionData] = useState<VisionAnalysis | null>(null);
  const [wardPlacements, setWardPlacements] = useState<WardPlacement[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const regions = [
    { value: 'jp1', label: 'Japan' },
    { value: 'kr', label: 'Korea' },
    { value: 'na1', label: 'North America' },
    { value: 'euw1', label: 'Europe West' },
    { value: 'eun1', label: 'Europe Nordic & East' },
  ];

  const handleSearch = async () => {
    if (!summonerName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // サモナー情報を取得
      const summonerResponse = await fetch(`/api/summoner/${region}/${encodeURIComponent(summonerName)}`);
      const summonerResult = await summonerResponse.json();

      if (summonerResult.error) {
        setError(summonerResult.error);
        return;
      }

      // 試合履歴を取得
      const matchesResponse = await fetch(`/api/matches/${region}/${summonerResult.puuid}?count=5`);
      const matchesResult = await matchesResponse.json();

      if (matchesResult.error || !matchesResult.matchIds?.length) {
        // モックデータを使用
        generateMockVisionData();
      } else {
        // 最新の試合のビジョンデータを分析
        await analyzeVisionData(region, matchesResult.matchIds[0], summonerResult.puuid);
      }

    } catch (error) {
      console.error('Error fetching vision data:', error);
      generateMockVisionData();
    } finally {
      setLoading(false);
    }
  };

  const analyzeVisionData = async (region: string, matchId: string, puuid: string) => {
    try {
      // 実際のAPIからタイムラインデータを取得してワード配置を分析
      // 現在はモックデータを使用
      generateMockVisionData();
      setSelectedMatch(matchId);
    } catch (error) {
      console.error('Error analyzing vision data:', error);
      generateMockVisionData();
    }
  };

  const generateMockVisionData = () => {
    // モックデータを使用してランダムなVision分析データを生成
    const mockData = generateRandomVisionData();
    
    setWardPlacements(mockData.wards);
    setVisionData(mockData.analysis);
  };

  // デモ用サンプルボタン
  const loadSampleData = (type: 'excellent' | 'good' | 'poor') => {
    const sampleData = getMockVisionData(type);
    setWardPlacements(sampleData.wards);
    setVisionData(sampleData.analysis);
    setSummonerName(`${type.charAt(0).toUpperCase() + type.slice(1)} Player`);
  };

  const getWardIcon = (type: string) => {
    switch (type) {
      case 'control': return <Shield className="w-3 h-3 text-pink-500" />;
      case 'farsight': return <Sun className="w-3 h-3 text-yellow-500" />;
      default: return <Eye className="w-3 h-3 text-green-500" />;
    }
  };

  const getWardColor = (type: string) => {
    switch (type) {
      case 'control': return 'bg-pink-500';
      case 'farsight': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRegionColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-600 dark:text-green-400';
    if (efficiency >= 65) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Eye className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Vision Lab
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            ワード配置分析と視界改善提案
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
                <span>{loading ? '分析中...' : '分析'}</span>
              </button>
            </div>
          </div>

          {/* Sample Data Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">サンプルデータで試す:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadSampleData('excellent')}
                className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg transition-colors"
              >
                🏆 優秀な配置
              </button>
              <button
                onClick={() => loadSampleData('good')}
                className="px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-lg transition-colors"
              >
                👍 普通の配置
              </button>
              <button
                onClick={() => loadSampleData('poor')}
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg transition-colors"
              >
                ⚠️ 改善が必要
              </button>
            </div>
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

        {/* Vision Analysis Results */}
        {visionData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Visualization */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-purple-500" />
                <span>ワード配置マップ</span>
              </h2>
              
              {/* Map Container */}
              <div className="relative bg-green-100 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700 aspect-square overflow-hidden">
                {/* Map Regions */}
                {MAP_REGIONS.map((region, index) => (
                  <div
                    key={index}
                    className={`absolute rounded-full border-2 ${getRegionColor(region.importance)} opacity-60`}
                    style={{
                      left: `${region.x - region.radius/2}%`,
                      top: `${region.y - region.radius/2}%`,
                      width: `${region.radius}%`,
                      height: `${region.radius}%`,
                    }}
                    title={region.description}
                  />
                ))}

                {/* Ward Placements */}
                {wardPlacements.map((ward, index) => (
                  <div
                    key={index}
                    className={`absolute w-4 h-4 rounded-full ${getWardColor(ward.type)} ${
                      ward.isActive ? 'opacity-100 ring-2 ring-white dark:ring-gray-800' : 'opacity-50'
                    } border-2 border-white dark:border-gray-800 flex items-center justify-center`}
                    style={{
                      left: `${ward.x}%`,
                      top: `${ward.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${ward.type} ward - ${ward.isActive ? 'Active' : 'Expired'}`}
                  >
                    {getWardIcon(ward.type)}
                  </div>
                ))}

                {/* Map Legend */}
                <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ワード種別</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Stealth</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Control</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Farsight</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              {/* Vision Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>視界統計</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {visionData.visionScore}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">視界スコア</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {visionData.mapCoverage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">マップカバー率</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {visionData.totalWards}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">総ワード数</div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className={`text-2xl font-bold ${getEfficiencyColor(visionData.efficiency)}`}>
                      {visionData.efficiency}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">効率性</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">ワード種別内訳</h4>
                  {Object.entries(visionData.wardTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{type} Ward</span>
                      <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Covered Areas */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>カバー済みエリア</span>
                </h3>
                
                <div className="space-y-2">
                  {visionData.keyAreasCovered.map((area, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span>改善提案</span>
                </h3>
                
                <div className="space-y-3">
                  {visionData.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!visionData && !loading && !error && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-semibold text-purple-700 dark:text-purple-300">Vision Lab へようこそ</h3>
                <p className="text-purple-600 dark:text-purple-400 mt-1">
                  サモナー名を入力してワード配置分析を開始してください。視界の改善点を特定し、
                  より効果的なワード配置のアドバイスを提供します。上記のサンプルボタンでデモを試すこともできます。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 