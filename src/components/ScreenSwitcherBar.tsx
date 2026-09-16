import React from 'react';
import { ScreenId, Language } from '../types';

interface ScreenSwitcherBarProps {
  currentScreen: ScreenId;
  onSelectScreen?: (screen: ScreenId) => void;
  language: Language;
}

export const ScreenSwitcherBar: React.FC<ScreenSwitcherBarProps> = ({
  currentScreen,
  language,
}) => {
  const steps: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'dump-ambient-home', label: language === 'vi' ? 'Ghi chép' : 'Dump', icon: 'edit_note' },
    { id: 'persona-qna', label: language === 'vi' ? 'Làm rõ & Cây' : 'Q&A Draft', icon: 'psychology_alt' },
    { id: 'workload-overview', label: language === 'vi' ? 'Cây việc' : 'Plan', icon: 'potted_plant' },
    { id: 'one-next-action-focus', label: language === 'vi' ? 'Tập trung' : 'Focus', icon: 'timer' },
    { id: 'break-soothing-rest', label: language === 'vi' ? 'Nghỉ' : 'Rest', icon: 'spa' },
    { id: 'reflection-study-mirror', label: language === 'vi' ? 'Soi chiếu' : 'Mirror', icon: 'auto_stories' },
  ];

  const activeIdx = steps.findIndex((s) => s.id === currentScreen);

  return (
    <div
      id="flow-step-tracker"
      aria-label="Tiến trình các bước"
      className="w-full bg-[#f3ede1]/90 rounded-2xl border border-[#c4c8c1]/30 p-1 shadow-xs select-none pointer-events-none cursor-default"
    >
      <div className="flex items-center justify-between gap-1 overflow-x-auto">
        {steps.map((step, idx) => {
          const isActive = currentScreen === step.id;
          const isCompleted = activeIdx > idx;

          return (
            <div
              key={step.id}
              className={`flex-1 min-w-[48px] sm:min-w-[70px] md:min-w-[90px] py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                isActive
                  ? 'bg-[#2e3b30] text-white shadow-xs font-semibold'
                  : isCompleted
                  ? 'text-[#2e3b30] bg-[#e8dfcf]/60 font-medium'
                  : 'text-[#747872] opacity-60'
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[15px] sm:text-[17px]"
                  style={{ fontVariationSettings: isActive || isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isCompleted ? 'check_circle' : step.icon}
                </span>
                <span className={`text-[9.5px] sm:text-[11px] font-bold ${isActive ? 'text-[#c6e8c9]' : ''}`}>
                  {idx + 1}
                </span>
              </div>
              <span className="text-[9.5px] sm:text-[11px] md:text-[12px] leading-tight truncate max-w-[54px] sm:max-w-none text-center">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
