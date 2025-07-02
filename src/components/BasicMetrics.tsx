'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Coins, Zap, Trophy } from 'lucide-react';

interface MetricsData {
  kda: number;
  csPerMin: number;
  goldPerMin: number;
  damagePerMin: number;
}

interface RawStats {
  kills: number;
  deaths: number;
  assists: number;
  totalCS: number;
  goldEarned: number;
  totalDamage: number;
  visionScore: number;
  wardsPlaced: number;
}

interface MatchMetrics {
  matchId: string;
  puuid: string;
  championName: string;
  gameMode: string;
  gameDuration: number;
  metrics: MetricsData;
  rawStats: RawStats;
}

interface BasicMetricsProps {
  region: string;
  puuid: string;
  matchIds: string[];
}

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle 
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

export default function BasicMetrics({ region, puuid, matchIds }: BasicMetricsProps) {
  const [metricsHistory, setMetricsHistory] = useState<MatchMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 最新5試合のメトリクスを取得
        const latestMatches = matchIds.slice(0, 5);
        const metricsPromises = latestMatches.map(matchId =>
          fetch(`/api/metrics/${region}/${matchId}?puuid=${puuid}`)
            .then(res => res.json())
        );

        const results = await Promise.all(metricsPromises);
        const validResults = results.filter(result => !result.error);
        
        setMetricsHistory(validResults);
      } catch (err) {
        setError('Failed to fetch metrics data');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (matchIds.length > 0) {
      fetchMetrics();
    }
  }, [region, puuid, matchIds]);

  const calculateAverages = () => {
    if (metricsHistory.length === 0) return null;

    const totals = metricsHistory.reduce(
      (acc, match) => ({
        kda: acc.kda + match.metrics.kda,
        csPerMin: acc.csPerMin + match.metrics.csPerMin,
        goldPerMin: acc.goldPerMin + match.metrics.goldPerMin,
        damagePerMin: acc.damagePerMin + match.metrics.damagePerMin,
      }),
      { kda: 0, csPerMin: 0, goldPerMin: 0, damagePerMin: 0 }
    );

    const count = metricsHistory.length;
    return {
      kda: Math.round((totals.kda / count) * 100) / 100,
      csPerMin: Math.round((totals.csPerMin / count) * 100) / 100,
      goldPerMin: Math.round((totals.goldPerMin / count) * 100) / 100,
      damagePerMin: Math.round((totals.damagePerMin / count) * 100) / 100,
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Metrics</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const averages = calculateAverages();

  if (!averages) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Metrics</h2>
        <p className="text-gray-600 dark:text-gray-400">No metrics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Metrics</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          過去 {metricsHistory.length} 試合の平均
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="KDA"
          value={averages.kda}
          icon={Trophy}
          trend={averages.kda >= 2 ? 'up' : averages.kda >= 1 ? 'neutral' : 'down'}
          subtitle={`${averages.kda >= 2 ? 'Excellent' : averages.kda >= 1 ? 'Good' : 'Needs Improvement'}`}
        />
        
        <MetricCard
          title="CS/min"
          value={averages.csPerMin}
          icon={Target}
          trend={averages.csPerMin >= 7 ? 'up' : averages.csPerMin >= 5 ? 'neutral' : 'down'}
          subtitle={`${averages.csPerMin >= 7 ? 'Excellent' : averages.csPerMin >= 5 ? 'Good' : 'Needs Improvement'}`}
        />
        
        <MetricCard
          title="Gold/min"
          value={Math.round(averages.goldPerMin)}
          icon={Coins}
          trend={averages.goldPerMin >= 400 ? 'up' : averages.goldPerMin >= 300 ? 'neutral' : 'down'}
          subtitle={`${averages.goldPerMin >= 400 ? 'High Income' : averages.goldPerMin >= 300 ? 'Average' : 'Low Income'}`}
        />
        
        <MetricCard
          title="Damage/min"
          value={Math.round(averages.damagePerMin)}
          icon={Zap}
          trend={averages.damagePerMin >= 600 ? 'up' : averages.damagePerMin >= 400 ? 'neutral' : 'down'}
          subtitle={`${averages.damagePerMin >= 600 ? 'High Impact' : averages.damagePerMin >= 400 ? 'Average' : 'Low Impact'}`}
        />
      </div>

      {/* 最新試合の詳細 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">最新試合の履歴</h3>
        <div className="space-y-3">
          {metricsHistory.slice(0, 3).map((match, index) => (
            <div 
              key={match.matchId} 
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{match.championName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{match.gameMode}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">{match.metrics.kda}</div>
                  <div className="text-gray-500 dark:text-gray-400">KDA</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">{match.metrics.csPerMin}</div>
                  <div className="text-gray-500 dark:text-gray-400">CS/min</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">{Math.round(match.metrics.goldPerMin)}</div>
                  <div className="text-gray-500 dark:text-gray-400">Gold/min</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">{Math.round(match.metrics.damagePerMin)}</div>
                  <div className="text-gray-500 dark:text-gray-400">Dmg/min</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 