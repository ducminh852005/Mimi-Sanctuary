import React from 'react';
import { ScreenId, Language } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  language,
}) => {
  const tabs = [
    {
      id: 'dump-ambient-home' as ScreenId,
      label: language === 'vi' ? 'Trang chủ' : 'Home',
      icon: 'nest_eco_leaf',
      isActive: currentScreen === 'dump-ambient-home' || currentScreen === 'persona-qna',
    },
    {
      id: 'workload-overview' as ScreenId,
      label: language === 'vi' ? 'Khối lượng' : 'Workload',
      icon: 'potted_plant',
      isActive: currentScreen === 'workload-overview',
    },
    {
      id: 'one-next-action-focus' as ScreenId,
      label: language === 'vi' ? 'Tập trung' : 'Focus',
      icon: 'center_focus_strong',
      isActive: currentScreen === 'one-next-action-focus' || currentScreen === 'break-soothing-rest',
    },
    {
      id: 'reflection-study-mirror' as ScreenId,
      label: language === 'vi' ? 'Suy ngẫm' : 'Mirror',
      icon: 'auto_stories',
      isActive: currentScreen === 'reflection-study-mirror',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-[#fff9ed]/90 backdrop-blur-xl border-t border-[#c4c8c1]/30 shadow-[0_-2px_12px_rgba(69,82,70,0.04)]">
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto flex justify-around items-center h-16 px-2 sm:px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] gap-0.5 transition-all ${
              tab.isActive
                ? 'text-[#2e3b30] font-semibold scale-105'
                : 'text-[#434843] hover:text-[#1d1c14] opacity-80'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                tab.isActive ? 'text-[#47654d]' : ''
              }`}
              style={{
                fontVariationSettings: tab.isActive
                  ? "'FILL' 1, 'wght' 600"
                  : "'FILL' 0, 'wght' 400",
              }}
            >
              {tab.icon}
            </span>
            <span className="font-label-sm text-[11px] leading-tight tracking-tight">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
