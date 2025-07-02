'use client';

import { useState } from 'react';
import BasicMetrics from '@/components/BasicMetrics';
import { Search, User } from 'lucide-react';

export default function Dashboard() {
  const [region, setRegion] = useState('jp1');
  const [summonerName, setSummonerName] = useState('');
  const [summonerData, setSummonerData] = useState<any>(null);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
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
        throw new Error(summonerResult.error);
      }

      setSummonerData(summonerResult);

      // 試合履歴を取得
      const matchesResponse = await fetch(`/api/matches/${region}/${summonerResult.puuid}?count=10`);
      const matchesResult = await matchesResponse.json();

      if (matchesResult.error) {
        throw new Error(matchesResult.error);
      }

      setMatchIds(matchesResult.matchIds);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
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
                  placeholder="サモナー名を入力"
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Summoner Info */}
        {summonerData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{summonerData.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">レベル {summonerData.summonerLevel}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">PUUID: {summonerData.puuid}</p>
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
            <p className="text-yellow-600 dark:text-yellow-400">
              このサモナーの試合データが見つかりませんでした。ランク戦の履歴があることを確認してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 