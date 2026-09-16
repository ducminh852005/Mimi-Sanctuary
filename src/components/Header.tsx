import React from 'react';
import { ScreenId, Language, SmartWatchBiometrics } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (screen: ScreenId) => void;
  biometrics?: SmartWatchBiometrics;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  language,
  onLanguageChange,
  onNavigate,
  biometrics,
}) => {
  const isHome = currentScreen === 'dump-ambient-home';

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'persona-qna':
        return {
          title: 'Persona Mimi',
          sub: language === 'vi' ? 'Hỏi đáp & Lắng nghe' : 'Pacing Q&A',
        };
      case 'workload-overview':
        return {
          title: 'Mimi Arbor',
          sub: language === 'vi' ? 'Cây việc LMS & Brain Dump' : 'Workload Arbor',
        };
      case 'one-next-action-focus':
        return {
          title: 'Mimi Focus',
          sub: language === 'vi' ? 'Đơn nhiệm tĩnh lặng' : 'Monotask Enclave',
        };
      case 'break-soothing-rest':
        return {
          title: 'Mimi Rest',
          sub: language === 'vi' ? 'Nghỉ ngơi hạ stress' : 'Micro-Rest Recovery',
        };
      case 'reflection-study-mirror':
        return {
          title: 'Mimi Mirror',
          sub: language === 'vi' ? 'Gương soi chiếu học tập' : 'Study Reflection',
        };
      case 'dump-ambient-home':
      default:
        return {
          title: 'Mimi Sanctuary',
          sub: language === 'vi' ? 'Không gian tĩnh & Đồng bộ' : 'Dump & Biometrics',
        };
    }
  };

  const info = getScreenTitle();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#fff9ed]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#c4c8c1]/30">
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto h-16 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {!isHome ? (
            <button
              aria-label="Go back"
              onClick={() => {
                if (currentScreen === 'persona-qna') onNavigate('dump-ambient-home');
                else if (currentScreen === 'workload-overview') onNavigate('dump-ambient-home');
                else if (currentScreen === 'one-next-action-focus') onNavigate('workload-overview');
                else if (currentScreen === 'break-soothing-rest') onNavigate('one-next-action-focus');
                else if (currentScreen === 'reflection-study-mirror') onNavigate('dump-ambient-home');
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#434843] hover:bg-[#f3ede1] active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#f3ede1] flex items-center justify-center text-[#47654d] relative shadow-[0_2px_8px_rgba(69,82,70,0.06)] shrink-0">
              <span className="material-symbols-outlined text-[18px]">potted_plant</span>
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#47654d] rounded-full ring-2 ring-[#fff9ed] animate-pulse"></span>
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-[16px] text-[#2e3b30] leading-none font-semibold truncate">
                {info.title}
              </span>
              {biometrics?.connected && (
                <span
                  onClick={() => onNavigate('dump-ambient-home')}
                  className="cursor-pointer text-[10px] font-bold text-[#b34033] bg-white px-1.5 py-0.2 rounded-full border border-[#c4c8c1]/20 flex items-center gap-0.5 shrink-0 shadow-xs"
                  title="Smart Watch Live Sync"
                >
                  <span className="material-symbols-outlined text-[11px]">watch</span>
                  <span>{biometrics.heartRate}</span>
                </span>
              )}
            </div>
            <span className="font-label-sm text-[11px] text-[#434843] truncate">
              {info.sub}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#ede8dc]/80 p-0.5 rounded-full border border-[#c4c8c1]/40 shadow-inner">
            <button
              onClick={() => onLanguageChange('vi')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                language === 'vi'
                  ? 'bg-[#fff9ed] text-[#2e3b30] shadow-sm'
                  : 'text-[#434843] hover:text-[#1d1c14]'
              }`}
              title="Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span>VIE</span>
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-[#fff9ed] text-[#2e3b30] shadow-sm'
                  : 'text-[#434843] hover:text-[#1d1c14]'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>ENG</span>
            </button>
          </div>

          <div
            className="w-8 h-8 rounded-full bg-[#2e3b30] flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:opacity-90"
            title="User Profile"
          >
            <span className="material-symbols-outlined text-white text-[17px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
