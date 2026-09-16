import React, { useState, useEffect } from 'react';
import { ScreenId, Language, SmartWatchBiometrics, Task } from '../types';
import { IMAGES } from '../data/content';
import { ambientSound } from '../utils/audio';

interface BreakRestScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  biometrics: SmartWatchBiometrics;
  activeTask?: Task;
  onSaveAndReturnHome?: () => void;
}

export const BreakRestScreen: React.FC<BreakRestScreenProps> = ({
  onNavigate,
  language,
  biometrics,
  activeTask,
  onSaveAndReturnHome,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(270);
  const [initialSeconds] = useState(300);
  const [isPaused, setIsPaused] = useState(false);
  const [boxPhase, setBoxPhase] = useState<0 | 1 | 2>(0);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    tea: true,
    gaze: false,
    stretch: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onNavigate('reflection-study-mirror');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onNavigate]);

  useEffect(() => {
    const breathCycle = setInterval(() => {
      setBoxPhase((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 4000);

    return () => clearInterval(breathCycle);
  }, []);

  const toggleSound = () => {
    const active = ambientSound.toggleAmbient();
    setIsSoundOn(active);
  };

  const handleToggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.round(((initialSeconds - secondsRemaining) / initialSeconds) * 100);

  return (
    <div className="w-full flex flex-col gap-3 pb-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
        {/* Left Column: Guidance & Central Timer */}
        <div className="flex flex-col gap-3.5">
          {/* Top Banner: Mimi Guidance & Smart Watch Stress Recovery */}
      <div className="flex items-center justify-between bg-[#f3ede1] px-3.5 py-2 rounded-xl border border-[#c4c8c1]/30 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#c6e8c9] text-[#47654d] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[16px]">self_improvement</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#2e3b30] truncate">
              {language === 'vi' ? 'Nghỉ ngơi phục hồi vi mô' : 'Micro-Rest Recovery'}
            </span>
            <span className="text-[10px] text-[#47654d]">
              {language === 'vi' ? 'Hạ nhiệt độ căng thẳng nhận thức' : 'Cooling cognitive strain'}
            </span>
          </div>
        </div>

        {/* Watch Recovery Badge */}
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#c4c8c1]/20 shadow-xs shrink-0">
          <span className="text-[11px] text-[#b34033] flex items-center gap-0.5 font-bold">
            <span className="material-symbols-outlined text-[12px]">favorite</span>
            {Math.max(62, biometrics.heartRate - 6)} bpm
          </span>
          <span className="text-[#c4c8c1]">•</span>
          <span className="text-[10px] text-[#47654d] font-bold">
            Stress ⬇️
          </span>
        </div>
      </div>

      {/* Central Circular Break Timer & Box 4·4·4 */}
      <div className="relative flex flex-col items-center justify-center bg-[#f9f3e7] rounded-2xl px-4 py-5 shadow-xs border border-[#c4c8c1]/30 overflow-hidden">
        {/* Breathing Phase Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-xs mb-3 border border-[#c4c8c1]/20">
          <span className="text-[13px]">
            {boxPhase === 0 ? '🫁' : boxPhase === 1 ? '⏸️' : '💨'}
          </span>
          <span className="text-[11px] font-semibold text-[#47654d]">
            {boxPhase === 0
              ? language === 'vi' ? 'Hít vào 4s' : 'Inhale 4s'
              : boxPhase === 1
              ? language === 'vi' ? 'Giữ tĩnh 4s' : 'Hold 4s'
              : language === 'vi' ? 'Thở ra chậm 4s' : 'Exhale 4s'}
          </span>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-44 h-44 my-1 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="66" fill="transparent" stroke="#ede8dc" strokeWidth="6" />
            <circle
              cx="80"
              cy="80"
              r="66"
              fill="transparent"
              stroke="#47654d"
              strokeWidth="6"
              strokeDasharray={414.69}
              strokeDashoffset={414.69 - (414.69 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Inner Core */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[32px] font-bold text-[#2e3b30] leading-none tracking-tight">
              {timeFormatted}
            </span>
            <span className="text-[10px] text-[#747872] mt-1 font-medium">
              {language === 'vi' ? 'thời gian nghỉ' : 'rest time'}
            </span>
          </div>
        </div>

        {/* 3 Steps Box Breathing Indicator */}
        <div className="flex items-center gap-1.5 mt-3">
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              boxPhase === 0 ? 'bg-[#47654d] scale-125' : 'bg-[#c4c8c1]/60'
            }`}
          ></span>
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              boxPhase === 1 ? 'bg-[#47654d] scale-125' : 'bg-[#c4c8c1]/60'
            }`}
          ></span>
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              boxPhase === 2 ? 'bg-[#47654d] scale-125' : 'bg-[#c4c8c1]/60'
            }`}
          ></span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          type="button"
          className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2e3b30] text-[11px] font-semibold border border-[#c4c8c1]/20 shadow-xs hover:bg-[#f3ede1] transition-all"
        >
          <span>{isSoundOn ? '🔊' : '🔇'}</span>
          <span>{language === 'vi' ? 'Suối reo 432Hz' : 'Stream 432Hz'}</span>
        </button>
      </div>
    </div>

    {/* Right Column: Micro-Rest Checklist & Actions */}
    <div className="flex flex-col gap-3.5">
      {/* Micro-Rest Interactive Checklist */}
      <div className="rounded-xl bg-[#f9f3e7] p-3 shadow-xs border border-[#c4c8c1]/30 flex flex-col gap-2">
        <span className="text-[12px] font-bold text-[#2e3b30] flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#47654d]">task_alt</span>
          {language === 'vi' ? 'Gợi ý phục hồi vi mô' : 'Micro-Rest Checklist'}
        </span>

        <div className="flex flex-col gap-1.5">
          {/* Item 1: Tea */}
          <button
            onClick={() => handleToggleCheck('tea')}
            className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all active:scale-[0.99] border ${
              checkedItems.tea
                ? 'bg-[#c6e8c9]/40 border-[#47654d]/30 text-[#04210e]'
                : 'bg-white border-[#c4c8c1]/20 text-[#2e3b30]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🍵</span>
              <span className="text-[12px] font-medium">
                {language === 'vi' ? 'Uống một ngụm trà ấm' : 'Sip warm herbal tea'}
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[18px] ${
                checkedItems.tea ? 'text-[#47654d]' : 'text-[#c4c8c1]'
              }`}
            >
              {checkedItems.tea ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </button>

          {/* Item 2: Gaze */}
          <button
            onClick={() => handleToggleCheck('gaze')}
            className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all active:scale-[0.99] border ${
              checkedItems.gaze
                ? 'bg-[#c6e8c9]/40 border-[#47654d]/30 text-[#04210e]'
                : 'bg-white border-[#c4c8c1]/20 text-[#2e3b30]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[16px]">👀</span>
              <span className="text-[12px] font-medium">
                {language === 'vi' ? 'Phóng tầm mắt ra xa 6m' : 'Look 20ft away (Rule 20-20-20)'}
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[18px] ${
                checkedItems.gaze ? 'text-[#47654d]' : 'text-[#c4c8c1]'
              }`}
            >
              {checkedItems.gaze ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </button>

          {/* Item 3: Stretch */}
          <button
            onClick={() => handleToggleCheck('stretch')}
            className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all active:scale-[0.99] border ${
              checkedItems.stretch
                ? 'bg-[#c6e8c9]/40 border-[#47654d]/30 text-[#04210e]'
                : 'bg-white border-[#c4c8c1]/20 text-[#2e3b30]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🧘</span>
              <span className="text-[12px] font-medium">
                {language === 'vi' ? 'Thả lỏng vai và xoay cổ' : 'Release shoulders & rotate neck'}
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[18px] ${
                checkedItems.stretch ? 'text-[#47654d]' : 'text-[#c4c8c1]'
              }`}
            >
              {checkedItems.stretch ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </button>
        </div>
      </div>

      {/* Atmospheric Image Banner */}
      <div className="relative h-18 rounded-xl overflow-hidden shadow-xs border border-[#c4c8c1]/30">
        <img src={IMAGES.canopySlumber} alt="Canopy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2e3b30]/85 via-[#2e3b30]/40 to-transparent flex items-center px-3">
          <span className="text-[11px] text-white font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">nightlight</span>
            {language === 'vi' ? 'Tán lá tĩnh lặng chờ đợi' : 'Slumber canopy awaiting you'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={() => onNavigate('reflection-study-mirror')}
          className="w-full py-3 px-4 rounded-xl bg-[#2e3b30] hover:bg-[#455246] text-[#ffffff] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[18px] text-[#c6e8c9]">
            auto_stories
          </span>
          <span>{language === 'vi' ? 'Đi tới Gương Soi chiếu' : 'Go to Reflection Mirror'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="w-full py-2 px-4 rounded-xl bg-[#f3ede1] text-[#2e3b30] font-semibold text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#ede8dc] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPaused ? 'play_arrow' : 'pause'}
          </span>
          <span>{isPaused ? (language === 'vi' ? 'Tiếp tục đếm' : 'Resume countdown') : (language === 'vi' ? 'Tạm dừng đồng hồ' : 'Pause countdown')}</span>
        </button>

        <button
          onClick={() => {
            if (onSaveAndReturnHome) onSaveAndReturnHome();
            onNavigate('dump-ambient-home');
          }}
          className="w-full py-2 px-4 rounded-xl bg-white text-[#747872] hover:text-[#2e3b30] font-semibold text-[12px] flex items-center justify-center gap-1.5 border border-[#c4c8c1]/30 hover:bg-[#ede8dc] transition-all"
        >
          <span className="material-symbols-outlined text-[16px] text-[#47654d]">bookmark</span>
          <span>
            {language === 'vi'
              ? 'Lưu tiến trình & Về Trang chủ'
              : 'Save Progress & Return Home'}
          </span>
        </button>
      </div>
    </div>
  </div>
</div>
  );
};
