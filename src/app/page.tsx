'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Target, TrendingUp, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: BarChart3,
      title: 'Basic Metrics',
      description: 'KDA、CS/min、Gold/minなどの基本指標を詳細分析',
    },
    {
      icon: Target,
      title: 'Vision Lab',
      description: 'ワード配置と死角を可視化し、視界管理を改善',
    },
    {
      icon: TrendingUp,
      title: 'Objective Hub',
      description: 'ドラゴン・バロンの取得タイミングをプロと比較',
    },
    {
      icon: Zap,
      title: 'Gold Simulator',
      description: 'リコール判断の機会損失をシミュレーション',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            LoL Insight Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            League of Legendsのプレイデータを詳細分析し、プロ平均との比較・選択肢の振り返り・
            次回プレイへのインサイトを提供する高機能分析ツール
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors space-x-2"
          >
            <span>分析を開始</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            技術スタック
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Next.js 14</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">React Framework</div>
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">TypeScript</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Type Safety</div>
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Tailwind CSS</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Modern Styling</div>
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Riot API</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Game Data</div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            使い方
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                サモナー名を入力
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                分析したいLoLアカウントのサモナー名とリージョンを入力
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                データ分析
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                試合履歴を自動分析し、各種メトリクスを計算
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                改善インサイト
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                視覚的なダッシュボードで改善点を確認し、上達を支援
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
