'use client';

import { useState } from 'react';
import BasicMetrics from '@/components/BasicMetrics';
import { Search, User, AlertCircle, CheckCircle, Clock, Info, TestTube } from 'lucide-react';

export default function Dashboard() {
  const [region, setRegion] = useState('jp1');
  const [summonerName, setSummonerName] = useState('');
  const [summonerData, setSummonerData] = useState<any>(null);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

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
    setIsUsingMockData(false);

    try {
      console.log('Starting search for:', { summonerName, region });

      // サモナー情報を取得
      const summonerResponse = await fetch(`/api/summoner/${region}/${encodeURIComponent(summonerName)}`);
      const summonerResult = await summonerResponse.json();

      console.log('Summoner API response:', summonerResult);

      if (summonerResult.error) {
        setError(summonerResult);
        setSummonerData(null);
        setMatchIds([]);
        return;
      }

      // モックデータかどうかをチェック
      if (summonerResult._isMockData) {
        setIsUsingMockData(true);
      }

      setSummonerData(summonerResult);

      // 試合履歴を取得
      console.log('Fetching match history for PUUID:', summonerResult.puuid);
      const matchesResponse = await fetch(`/api/matches/${region}/${summonerResult.puuid}?count=10`);
      const matchesResult = await matchesResponse.json();

      console.log('Matches API response:', matchesResult);

      if (matchesResult.error) {
        setError(matchesResult);
        setMatchIds([]);
        return;
      }

      setMatchIds(matchesResult.matchIds);
    } catch (err: any) {
      console.error('Unexpected error during search:', err);
      setError({
        error: 'Unexpected error',
        details: err.message || 'An unexpected error occurred',
        suggestions: ['Please try again', 'Check your internet connection']
      });
      setSummonerData(null);
      setMatchIds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderError = (error: any) => {
    if (!error) return null;

    const getErrorIcon = () => {
      if (error.error === 'Summoner not found') return <AlertCircle className="w-5 h-5 text-red-500" />;
      if (error.error === 'API access forbidden') return <AlertCircle className="w-5 h-5 text-orange-500" />;
      if (error.error === 'Rate limit exceeded') return <Clock className="w-5 h-5 text-yellow-500" />;
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    };

    const getErrorColor = () => {
      if (error.error === 'Summoner not found') return 'red';
      if (error.error === 'API access forbidden') return 'orange';
      if (error.error === 'Rate limit exceeded') return 'yellow';
      return 'red';
    };

    const colorClasses = {
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400'
    };

    return (
      <div className={`border rounded-lg p-4 mb-8 ${colorClasses[getErrorColor() as keyof typeof colorClasses]}`}>
        <div className="flex items-start space-x-3">
          {getErrorIcon()}
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{error.error}</h3>
            {error.details && (
              <p className="text-sm mb-3">{error.details}</p>
            )}
            {error.suggestions && error.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">💡 解決方法:</p>
                <ul className="text-sm space-y-1">
                  {error.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-current rounded-full"></span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    <span>Riot ID形式で試してください（例: Player#TAG）</span>
                  </li>
                </ul>
              </div>
            )}
            {error.region && error.summonerName && (
              <div className="mt-3 p-2 bg-black/5 dark:bg-white/5 rounded text-xs">
                <p>検索内容: "{error.summonerName}" in {error.region}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // モックデータ使用時の通知
  const renderMockDataNotice = () => {
    if (!isUsingMockData) return null;

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <TestTube className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
              🧪 デモモード
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
              現在、デモ用のモックデータを使用しています。Riot APIが利用できない場合の代替データです。
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-500">
              実際のAPIが利用可能になると、リアルタイムのデータを表示できます。
            </p>
          </div>
        </div>
      </div>
    );
  };

  // サジェスチョン機能
  const getSummonerSuggestions = () => {
    const suggestions = [
      { name: 'Hide on bush', region: 'kr', description: 'Faker の アカウント' },
      { name: 'Caps', region: 'euw1', description: 'G2 Esports Mid' },
      { name: 'Showmaker', region: 'kr', description: 'DWG KIA Mid' },
      { name: 'Faker', region: 'kr', description: 'T1 Mid Legend' },
      { name: 'ezToWin#lol', region: 'jp1', description: 'Riot ID形式のサンプル' },
      { name: 'TestPlayer#kr1', region: 'kr', description: 'Riot ID形式のサンプル' },
    ];

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">おすすめのサモナー</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setSummonerName(suggestion.name);
                setRegion(suggestion.region);
              }}
              className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
            >
              <div className="font-medium text-blue-700 dark:text-blue-300">{suggestion.name}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">{suggestion.description} • {suggestion.region}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            LoL Insight Pro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            League of Legends プレイデータ分析ツール
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
                  onKeyPress={handleKeyPress}
                  placeholder="サモナー名またはRiot ID (例: Player#TAG)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? '検索中...' : '検索'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {!summonerData && !error && getSummonerSuggestions()}

        {/* Error Display */}
        {renderError(error)}

        {/* Mock Data Notice */}
        {renderMockDataNotice()}

        {/* Summoner Info */}
        {summonerData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{summonerData.name}</h2>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  {isUsingMockData && <TestTube className="w-5 h-5 text-blue-500" />}
                </div>
                <p className="text-gray-600 dark:text-gray-400">レベル {summonerData.summonerLevel}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">PUUID: {summonerData.puuid.substring(0, 8)}...</p>
                {summonerData._mockMessage && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{summonerData._mockMessage}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Basic Metrics */}
        {summonerData && matchIds.length > 0 && (
          <BasicMetrics 
            region={region}
            puuid={summonerData.puuid}
            matchIds={matchIds}
          />
        )}

        {/* No Data Message */}
        {summonerData && matchIds.length === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <p className="text-yellow-600 dark:text-yellow-400">
                このサモナーの試合データが見つかりませんでした。ランク戦の履歴があることを確認してください。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 