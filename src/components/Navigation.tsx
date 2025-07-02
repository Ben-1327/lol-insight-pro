'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Eye, Target, DollarSign, Brain, Home } from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'メイン分析画面'
  },
  {
    name: 'Basic Metrics',
    href: '/dashboard',
    icon: BarChart3,
    description: 'KDA、CS、ダメージ分析',
    completed: true
  },
  {
    name: 'Account Overview',
    href: '/account-overview',
    icon: Users,
    description: '複数アカウント比較',
    inProgress: true
  },
  {
    name: 'Vision Lab',
    href: '/vision-lab',
    icon: Eye,
    description: 'ワード配置分析',
    comingSoon: true
  },
  {
    name: 'Objective Hub',
    href: '/objective-hub',
    icon: Target,
    description: 'オブジェクト取得分析',
    comingSoon: true
  },
  {
    name: 'Gold Trade Simulator',
    href: '/gold-trade-simulator',
    icon: DollarSign,
    description: 'リコール判断シミュレーター',
    comingSoon: true
  },
  {
    name: 'AI Insights',
    href: '/ai-insights',
    icon: Brain,
    description: 'AI改善レポート',
    comingSoon: true
  }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              LoL Insight Pro
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const isDisabled = item.comingSoon;
              
              return (
                <Link
                  key={item.name}
                  href={isDisabled ? '#' : item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                      : isDisabled
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  
                  {/* Status Badges */}
                  {item.completed && (
                    <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                      完成
                    </span>
                  )}
                  {item.inProgress && (
                    <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full">
                      開発中
                    </span>
                  )}
                  {item.comingSoon && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                      予定
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const isDisabled = item.comingSoon;
              
              return (
                <Link
                  key={item.name}
                  href={isDisabled ? '#' : item.href}
                  className={`
                    flex flex-col items-center p-3 rounded-lg text-sm transition-colors
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                      : isDisabled
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-center opacity-75">{item.description}</span>
                  
                  {/* Mobile Status Badges */}
                  <div className="mt-1">
                    {item.completed && (
                      <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                        完成
                      </span>
                    )}
                    {item.inProgress && (
                      <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full">
                        開発中
                      </span>
                    )}
                    {item.comingSoon && (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                        予定
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
} 