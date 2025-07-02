'use client';

import { useState } from 'react';
import { SummonerData } from '@/lib/riot-api';
import { Search, User, Plus, X, BarChart3, Trophy, Target, TrendingUp, AlertCircle, CheckCircle, Users, TestTube } from 'lucide-react';

interface SummonerWithMetrics extends SummonerData {
  avgKDA?: number;
  avgCSPerMin?: number;
  avgGoldPerMin?: number;
  avgDamagePerMin?: number;
  totalMatches?: number;
  winRate?: number;
  favoriteChampion?: string;
  rank?: string;
  _isMockData?: boolean;
}

interface ComparisonMetrics {
  metric: string;
  displayName: string;
  format: 'number' | 'percentage' | 'decimal';
  icon: any;
}

const COMPARISON_METRICS: ComparisonMetrics[] = [
  { metric: 'avgKDA', displayName: '平均KDA', format: 'decimal', icon: Target },
  { metric: 'avgCSPerMin', displayName: 'CS/分', format: 'decimal', icon: TrendingUp },
  { metric: 'avgGoldPerMin', displayName: 'Gold/分', format: 'number', icon: Trophy },
  { metric: 'avgDamagePerMin', displayName: 'ダメージ/分', format: 'number', icon: BarChart3 },
  { metric: 'winRate', displayName: '勝率', format: 'percentage', icon: CheckCircle },
];

export default function AccountOverview() {
  const [region, setRegion] = useState('jp1');
  const [searchInputs, setSearchInputs] = useState<string[]>(['', '']);
  const [summoners, setSummoners] = useState<SummonerWithMetrics[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const regions = [
    { value: 'jp1', label: 'Japan' },
    { value: 'kr', label: 'Korea' },
    { value: 'na1', label: 'North America' },
    { value: 'euw1', label: 'Europe West' },
    { value: 'eun1', label: 'Europe Nordic & East' },
  ];

  const addSearchInput = () => {
    if (searchInputs.length < 4) {
      setSearchInputs([...searchInputs, '']);
      setLoading([...loading, false]);
      setErrors([...errors, '']);
    }
  };

  const removeSearchInput = (index: number) => {
    if (searchInputs.length > 2) {
      const newInputs = searchInputs.filter((_, i) => i !== index);
      setSearchInputs(newInputs);
      
      const newSummoners = summoners.filter((_, i) => i !== index);
      setSummoners(newSummoners);
      
      const newErrors = errors.filter((_, i) => i !== index);
      setErrors(newErrors);
      
      const newLoading = loading.filter((_, i) => i !== index);
      setLoading(newLoading);
    }
  };

  const updateSearchInput = (index: number, value: string) => {
    const newInputs = [...searchInputs];
    newInputs[index] = value;
    setSearchInputs(newInputs);
  };

  const searchSummoner = async (index: number) => {
    const summonerName = searchInputs[index]?.trim();
    if (!summonerName) return;

    const newLoading = [...loading];
    newLoading[index] = true;
    setLoading(newLoading);

    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);

    try {
      // サモナー情報を取得
      const summonerResponse = await fetch(`/api/summoner/${region}/${encodeURIComponent(summonerName)}`);
      const summonerResult = await summonerResponse.json();

      if (summonerResult.error) {
        newErrors[index] = summonerResult.error;
        setErrors(newErrors);
        return;
      }

      // 試合履歴を取得
      const matchesResponse = await fetch(`/api/matches/${region}/${summonerResult.puuid}?count=20`);
      const matchesResult = await matchesResponse.json();

      let summonerWithMetrics: SummonerWithMetrics = { 
        ...summonerResult,
        avgKDA: 0,
        avgCSPerMin: 0,
        avgGoldPerMin: 0,
        avgDamagePerMin: 0,
        totalMatches: 0,
        winRate: 0,
        favoriteChampion: 'Unknown',
        rank: 'Unranked'
      };

      if (!matchesResult.error && matchesResult.matchIds?.length > 0) {
        // 基本メトリクスを計算
        const metrics = await calculateSummonerMetrics(region, summonerResult.puuid, matchesResult.matchIds);
        summonerWithMetrics = { ...summonerResult, ...metrics };
      }

      const newSummoners = [...summoners];
      newSummoners[index] = summonerWithMetrics;
      setSummoners(newSummoners);

    } catch (error) {
      newErrors[index] = 'サモナーの検索に失敗しました';
      setErrors(newErrors);
    } finally {
      const newLoadingFinal = [...newLoading];
      newLoadingFinal[index] = false;
      setLoading(newLoadingFinal);
    }
  };

  const searchAllSummoners = async () => {
    const promises = searchInputs.map((_, index) => searchSummoner(index));
    await Promise.all(promises);
  };

  const calculateSummonerMetrics = async (region: string, puuid: string, matchIds: string[]) => {
    try {
      const matchPromises = matchIds.slice(0, 10).map(matchId => 
        fetch(`/api/metrics/${region}/${matchId}?puuid=${puuid}`)
          .then(res => res.json())
      );

      const matchResults = await Promise.all(matchPromises);
      const validMatches = matchResults.filter(result => !result.error && result.participant);

      if (validMatches.length === 0) {
        return {
          avgKDA: 0,
          avgCSPerMin: 0,
          avgGoldPerMin: 0,
          avgDamagePerMin: 0,
          totalMatches: 0,
          winRate: 0,
          favoriteChampion: 'Unknown',
          rank: 'Unranked'
        };
      }

      const totalKDA = validMatches.reduce((sum, match) => sum + (match.metrics?.kda || 0), 0);
      const totalCS = validMatches.reduce((sum, match) => sum + (match.metrics?.csPerMin || 0), 0);
      const totalGold = validMatches.reduce((sum, match) => sum + (match.metrics?.goldPerMin || 0), 0);
      const totalDamage = validMatches.reduce((sum, match) => sum + (match.metrics?.damagePerMin || 0), 0);
      const wins = validMatches.filter(match => match.participant?.win).length;

      // チャンピオン使用頻度を計算
      const championCount: Record<string, number> = {};
      validMatches.forEach(match => {
        const champion = match.participant?.championName || 'Unknown';
        championCount[champion] = (championCount[champion] || 0) + 1;
      });

      const favoriteChampion = Object.entries(championCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

      return {
        avgKDA: Math.round((totalKDA / validMatches.length) * 100) / 100,
        avgCSPerMin: Math.round((totalCS / validMatches.length) * 100) / 100,
        avgGoldPerMin: Math.round(totalGold / validMatches.length),
        avgDamagePerMin: Math.round(totalDamage / validMatches.length),
        totalMatches: validMatches.length,
        winRate: Math.round((wins / validMatches.length) * 100),
        favoriteChampion,
        rank: 'Ranked' // 実際のランク情報は別途取得が必要
      };
    } catch (error) {
      console.error('Error calculating summoner metrics:', error);
      return {
        avgKDA: 0,
        avgCSPerMin: 0,
        avgGoldPerMin: 0,
        avgDamagePerMin: 0,
        totalMatches: 0,
        winRate: 0,
        favoriteChampion: 'Unknown',
        rank: 'Unranked'
      };
    }
  };

  const formatMetricValue = (value: number, format: 'number' | 'percentage' | 'decimal') => {
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getMetricComparison = (metric: string) => {
    const activeSummoners = summoners.filter(s => s.name);
    const values = activeSummoners.map(s => (s as any)[metric] || 0).filter(v => v > 0);
    if (values.length === 0) return [];

    const max = Math.max(...values);
    const min = Math.min(...values);

    return activeSummoners.map(summoner => {
      const value = (summoner as any)[metric] || 0;
      let comparison = 'equal';
      if (value === max && max !== min) comparison = 'highest';
      else if (value === min && max !== min) comparison = 'lowest';
      
      return { value, comparison };
    });
  };

  // デモ用サンプルのサジェスチョン
  const getSampleSuggestions = () => {
    const suggestions = [
      { name: 'Challenger#kr', region: 'kr', description: 'Challenger Level Player' },
      { name: 'Diamond#main', region: 'kr', description: 'Diamond Level Player' },
      { name: 'GoldPlayer#jp1', region: 'jp1', description: 'Gold Level Player' },
      { name: 'SilverAce#euw', region: 'euw1', description: 'Silver Level Player' },
    ];

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">💡 デモ用サンプル</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                if (searchInputs.length > index) {
                  updateSearchInput(index, suggestion.name);
                  setRegion(suggestion.region);
                }
              }}
              className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
            >
              <div className="font-medium text-blue-700 dark:text-blue-300">{suggestion.name}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">{suggestion.description}</div>
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
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Account Overview
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            複数アカウントの性能比較分析
          </p>
        </div>

        {/* Sample Suggestions */}
        {getSampleSuggestions()}

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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

            <div className="flex-1">
              <button
                onClick={searchAllSummoners}
                disabled={loading.some(l => l) || !searchInputs.some(input => input.trim())}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading.some(l => l) ? '検索中...' : 'すべて検索'}</span>
              </button>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="space-y-4">
            {searchInputs.map((input, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => updateSearchInput(index, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchSummoner(index)}
                      placeholder={`サモナー名またはRiot ID ${index + 1}`}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {errors[index] && (
                    <p className="text-red-500 text-sm mt-1">{errors[index]}</p>
                  )}
                </div>

                <button
                  onClick={() => searchSummoner(index)}
                  disabled={loading[index] || !input.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {loading[index] ? '...' : '検索'}
                </button>

                {searchInputs.length > 2 && (
                  <button
                    onClick={() => removeSearchInput(index)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {searchInputs.length < 4 && (
              <button
                onClick={addSearchInput}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors text-gray-600 dark:text-gray-400"
              >
                <Plus className="w-4 h-4" />
                <span>サモナーを追加</span>
              </button>
            )}
          </div>
        </div>

        {/* Comparison Results */}
        {summoners.filter(s => s.name).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">比較結果</h2>

            {/* Summoner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {summoners.filter(s => s.name).map((summoner, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{summoner.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Lv.{summoner.summonerLevel}</p>
                      {summoner._isMockData && (
                        <div className="flex items-center space-x-1">
                          <TestTube className="w-3 h-3 text-blue-500" />
                          <p className="text-xs text-blue-600 dark:text-blue-400">Demo Data</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">試合数:</span>
                      <span className="font-medium">{summoner.totalMatches || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">勝率:</span>
                      <span className="font-medium">{summoner.winRate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">得意:</span>
                      <span className="font-medium text-xs">{summoner.favoriteChampion || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics Comparison Table */}
            {summoners.filter(s => s.name).length > 1 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        メトリック
                      </th>
                      {summoners.filter(s => s.name).map((summoner, index) => (
                        <th key={index} className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {summoner.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_METRICS.map((metric) => {
                      const comparisons = getMetricComparison(metric.metric);
                      return (
                        <tr key={metric.metric} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 px-4 flex items-center space-x-2">
                            <metric.icon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {metric.displayName}
                            </span>
                          </td>
                          {summoners.filter(s => s.name).map((summoner, index) => {
                            const comparison = comparisons[index];
                            const value = (summoner as any)[metric.metric] || 0;
                            
                            let cellClass = "text-center py-3 px-4";
                            if (comparison?.comparison === 'highest') {
                              cellClass += " bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold";
                            } else if (comparison?.comparison === 'lowest') {
                              cellClass += " bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                            }

                            return (
                              <td key={index} className={cellClass}>
                                {formatMetricValue(value, metric.format)}
                                {comparison?.comparison === 'highest' && (
                                  <span className="ml-1">👑</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* No Data Message */}
        {summoners.filter(s => s.name).length === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">開始方法</h3>
                <p className="text-blue-600 dark:text-blue-400 mt-1">
                  上記のフォームに比較したいサモナー名を入力して検索を開始してください。
                  最大4つのアカウントを同時に比較できます。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 