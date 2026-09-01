import React from 'react';
import { Store, Users, BarChart3, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

export type TabType = 'dashboard' | 'customers' | 'ai';

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  customerCount: number;
  hasUrgentRecovery: boolean;
}

export const TabNav: React.FC<TabNavProps> = ({
  activeTab,
  onTabChange,
  language,
  customerCount,
  hasUrgentRecovery
}) => {
  const t = translations[language];

  const tabs: Array<{
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: t.tabDashboard,
      icon: <Store className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      id: 'customers',
      label: t.tabCustomers,
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      badge: customerCount > 0 ? customerCount : undefined,
      badgeColor: 'bg-[#2d5a3d]/15 text-[#2d5a3d]'
    },
    {
      id: 'ai',
      label: t.tabAi,
      icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
      badge: 'AI',
      badgeColor: 'bg-emerald-600 text-white animate-pulse'
    }
  ];

  return (
    <div className="w-full bg-[#f5f3e8] border-b border-[#2d5a3d]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav id="main-tabs-nav" className="flex space-x-2 sm:space-x-4 pt-4 pb-0 overflow-x-auto no-scrollbar" aria-label="Main Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex items-center gap-2 sm:gap-2.5 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2d5a3d] text-amber-50 shadow-sm'
                    : 'bg-stone-200/50 hover:bg-stone-200 text-stone-700 hover:text-stone-950'
                }`}
              >
                <span className={isActive ? 'text-amber-300' : 'text-stone-500 group-hover:text-[#2d5a3d]'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-400 text-stone-950' : tab.badgeColor || 'bg-stone-300 text-stone-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {/* Subtle indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
