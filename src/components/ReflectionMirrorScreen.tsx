import React, { useState } from 'react';
import { ScreenId, Language, Mood, Task } from '../types';
import { REFLECTION_QUOTES } from '../data/content';

interface ReflectionMirrorScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  activeTask?: Task;
  onAdvanceToNextBranch?: () => void;
  onCompleteAllBranches?: () => void;
  onSaveAndReturnHome?: () => void;
}

export const ReflectionMirrorScreen: React.FC<ReflectionMirrorScreenProps> = ({
  onNavigate,
  language,
  activeTask,
  onAdvanceToNextBranch,
  onCompleteAllBranches,
  onSaveAndReturnHome,
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood>('grounded');
  const [showRestToast, setShowRestToast] = useState(false);

  const branches = activeTask?.workTree?.branches || [];
  const totalBranches = branches.length > 0 ? branches.length : 3;
  const currentBranchIndex = activeTask?.currentBranchIndex ?? 0;
  const completedIndices = activeTask?.completedBranchIndices || [currentBranchIndex];

  // Loop condition: is there a subsequent branch to execute?
  const hasMoreBranches = currentBranchIndex + 1 < totalBranches;
  const nextBranchIndex = currentBranchIndex + 1;
  const currentBranch = branches[currentBranchIndex];

  const handleRestMore = () => {
    setShowRestToast(true);
    setTimeout(() => {
      setShowRestToast(false);
    }, 3500);
  };

  const quote = REFLECTION_QUOTES[selectedMood][language];

  return (
    <div className="w-full flex flex-col gap-3 pb-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
        {/* Left Column: Status, Blossomed Tree, Metrics */}
        <div className="flex flex-col gap-3">
          {/* Mimi Status Header */}
          <div className="flex items-center justify-between bg-[#f9f3e7] p-3 rounded-xl border border-[#c4c8c1]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#c6e8c9] flex items-center justify-center text-[#4b6a51]">
                <span className="material-symbols-outlined text-[18px]">spa</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#2e3b30]">
                  {language === 'vi' ? 'Mimi cùng bạn soi chiếu' : 'Mimi Study Mirror'}
                </span>
                <span className="text-[11px] text-[#47654d]">
                  {language === 'vi'
                    ? `Đã hoàn thành Nhánh ${currentBranchIndex + 1}/${totalBranches}`
                    : `Completed Branch ${currentBranchIndex + 1}/${totalBranches}`}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-bold text-[#04210e] bg-[#c6e8c9] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <span>🎉</span>
              <span>{currentBranch?.estimatedMin || 25}m</span>
            </span>
          </div>

          {/* Botanical Tree Card - Blossomed Leaf */}
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-[#c4c8c1]/30 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-1">
              <span className="text-[12px] font-bold text-[#47654d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">potted_plant</span>
                {language === 'vi' ? 'Cây tri thức' : 'Botanical Arbor'}
              </span>
              <span className="text-[10px] font-semibold text-[#2e3b30] bg-[#f3ede1] px-2 py-0.5 rounded-full">
                {language === 'vi'
                  ? `🌸 ${completedIndices.length} nở • ${Math.max(0, totalBranches - completedIndices.length)} mầm ngủ`
                  : `🌸 ${completedIndices.length} bloomed • ${Math.max(0, totalBranches - completedIndices.length)} buds`}
              </span>
            </div>

            {/* Tree Vector */}
            <div className="relative w-full max-w-[240px] h-36 my-1 flex items-center justify-center">
              <svg className="w-full h-full" fill="none" viewBox="0 0 240 180">
                <path d="M120 170 C120 130, 118 105, 120 70" stroke="#455246" strokeLinecap="round" strokeWidth="4" />
                <path d="M120 115 C100 102, 75 96, 60 92" stroke="#455246" strokeLinecap="round" strokeWidth="3" />
                <path d="M120 90 C140 80, 168 76, 182 72" stroke="#455246" strokeLinecap="round" strokeWidth="3" />
                <path d="M120 70 C112 50, 104 36, 96 24" stroke="#455246" strokeLinecap="round" strokeWidth="2" />

                {/* Blossomed Leaf Node */}
                <g className="cursor-pointer">
                  <circle cx="60" cy="92" fill="#c6e8c9" r="14" />
                  <path d="M60 80 C68 86 68 98 60 104 C52 98 52 86 60 80 Z" fill="#47654d" />
                  <circle cx="60" cy="92" fill="#fff9ed" r="3" />
                  <circle cx="67" cy="86" fill="#ffb5a1" r="2.5" />
                </g>

                {/* Resting Concept Buds */}
                <g opacity={completedIndices.includes(1) ? 1 : 0.6}>
                  <circle cx="182" cy="72" fill={completedIndices.includes(1) ? '#c6e8c9' : '#f3ede1'} r={completedIndices.includes(1) ? 12 : 8} />
                </g>

                <g opacity={completedIndices.includes(2) ? 1 : 0.6}>
                  <circle cx="96" cy="24" fill={completedIndices.includes(2) ? '#c6e8c9' : '#f3ede1'} r={completedIndices.includes(2) ? 12 : 7} />
                </g>

                <ellipse cx="120" cy="172" fill="#e8e2d6" opacity="0.7" rx="36" ry="4" />
              </svg>
            </div>

            <span className="text-[14px] font-bold text-[#2e3b30]">
              {currentBranch
                ? `${currentBranch.title[language]} ${language === 'vi' ? 'đã nảy mầm tươi tốt' : 'blossomed'}`
                : language === 'vi'
                ? 'Nhánh công việc đã nảy mầm tươi tốt'
                : 'Session blossomed'}
            </span>
          </div>

          {/* 2 Crisp Metric Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[#f9f3e7] p-3 shadow-xs border border-[#c4c8c1]/30 flex flex-col">
              <span className="text-[11px] font-bold text-[#47654d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                {language === 'vi' ? 'Thời gian tập trung' : 'Focus Flow'}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[26px] font-bold text-[#2e3b30] leading-none">
                  {currentBranch?.estimatedMin || 25}
                </span>
                <span className="text-[12px] text-[#747872]">phút</span>
              </div>
              <span className="text-[10px] text-[#747872] mt-0.5">
                {language === 'vi' ? 'Tĩnh lặng liên tục' : 'Mindful flow'}
              </span>
            </div>

            <div className="rounded-xl bg-[#f9f3e7] p-3 shadow-xs border border-[#c4c8c1]/30 flex flex-col">
              <span className="text-[11px] font-bold text-[#47654d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">task_alt</span>
                {language === 'vi' ? 'Cột mốc' : 'Milestone'}
              </span>
              <span className="text-[13px] font-bold text-[#2e3b30] truncate mt-1">
                {currentBranch?.title[language] || 'Branch completed'}
              </span>
              <span className="text-[10px] font-bold text-[#04210e] bg-[#c6e8c9] px-1.5 py-0.2 rounded mt-0.5 self-start">
                {language === 'vi' ? `Nhánh ${currentBranchIndex + 1} xong` : `Branch ${currentBranchIndex + 1} done`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Mood, Quote & Actions */}
        <div className="flex flex-col gap-3">
          {/* Mood Selector - 3 Expressive Icon Chips */}
          <div className="rounded-xl bg-[#f9f3e7] p-3 shadow-xs border border-[#c4c8c1]/30 flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#2e3b30] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#47654d]">mood</span>
              {language === 'vi' ? 'Cảm xúc của bạn?' : 'How do you feel?'}
            </span>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedMood('grounded')}
                className={`py-2 px-1 rounded-xl text-[12px] font-semibold flex flex-col items-center gap-0.5 transition-all active:scale-95 shadow-xs border ${
                  selectedMood === 'grounded'
                    ? 'bg-[#47654d] text-white border-[#47654d]'
                    : 'bg-white text-[#2e3b30] border-[#c4c8c1]/30 hover:bg-[#f3ede1]'
                }`}
              >
                <span className="text-[16px]">🌿</span>
                <span>{language === 'vi' ? 'Vững vàng' : 'Grounded'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMood('light')}
                className={`py-2 px-1 rounded-xl text-[12px] font-semibold flex flex-col items-center gap-0.5 transition-all active:scale-95 shadow-xs border ${
                  selectedMood === 'light'
                    ? 'bg-[#47654d] text-white border-[#47654d]'
                    : 'bg-white text-[#2e3b30] border-[#c4c8c1]/30 hover:bg-[#f3ede1]'
                }`}
              >
                <span className="text-[16px]">☀️</span>
                <span>{language === 'vi' ? 'Nhẹ nhõm' : 'Light'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMood('tired')}
                className={`py-2 px-1 rounded-xl text-[12px] font-semibold flex flex-col items-center gap-0.5 transition-all active:scale-95 shadow-xs border ${
                  selectedMood === 'tired'
                    ? 'bg-[#47654d] text-white border-[#47654d]'
                    : 'bg-white text-[#2e3b30] border-[#c4c8c1]/30 hover:bg-[#f3ede1]'
                }`}
              >
                <span className="text-[16px]">🌙</span>
                <span>{language === 'vi' ? 'Hơi mỏi' : 'Tired'}</span>
              </button>
            </div>
          </div>

          {/* Mimi Observation Quote Card */}
          <div className="rounded-xl bg-[#f3ede1] p-3 shadow-xs border border-[#c4c8c1]/30 flex items-start gap-2">
            <span className="material-symbols-outlined text-[#47654d] text-[20px] shrink-0">
              format_quote
            </span>
            <div className="flex flex-col">
              <p className="text-[13px] text-[#2e3b30] italic leading-relaxed">
                {quote}
              </p>
              <span className="text-[10px] text-[#747872] mt-1">
                — {language === 'vi' ? 'Mimi' : 'Mimi'}
              </span>
            </div>
          </div>

          {/* Core Loop Action Buttons: Focus -> Rest -> Mirror Loop until branches complete */}
          <div className="flex flex-col gap-2 pt-1">
            {hasMoreBranches ? (
              <>
                <button
                  onClick={() => {
                    if (onAdvanceToNextBranch) {
                      onAdvanceToNextBranch();
                    } else {
                      onNavigate('one-next-action-focus');
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#2e3b30] hover:bg-[#455246] text-[#ffffff] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#c6e8c9]">play_arrow</span>
                  <span>
                    {language === 'vi'
                      ? `Tiếp tục Nhánh tiếp theo (Nhánh ${nextBranchIndex + 1}/${totalBranches})`
                      : `Continue to Next Branch (Branch ${nextBranchIndex + 1}/${totalBranches})`}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => {
                    if (onSaveAndReturnHome) {
                      onSaveAndReturnHome();
                    }
                    onNavigate('dump-ambient-home');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#f9f3e7] text-[#2e3b30] hover:bg-[#ede8dc] font-semibold text-[13px] flex items-center justify-center gap-2 border border-[#c4c8c1]/40 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#47654d]">bookmark</span>
                  <span>
                    {language === 'vi'
                      ? 'Lưu tiến trình & Về Trang chủ'
                      : 'Save Progress & Return Home'}
                  </span>
                </button>
              </>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-[#c6e8c9]/40 border border-[#47654d]/30 text-center">
                  <span className="text-[13px] font-bold text-[#04210e] flex items-center justify-center gap-1.5">
                    <span>🎉</span>
                    <span>
                      {language === 'vi'
                        ? 'Tất cả các nhánh công việc đã hoàn thành trọn vẹn!'
                        : 'All branches of this task are fully blossomed!'}
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (onCompleteAllBranches) {
                      onCompleteAllBranches();
                    }
                    onNavigate('dump-ambient-home');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#2e3b30] hover:bg-[#455246] text-[#ffffff] font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
                >
                  <span>🌸</span>
                  <span>
                    {language === 'vi'
                      ? 'Hoàn tất toàn bộ công việc → Về Trang chủ'
                      : 'Complete Whole Task → Return Home'}
                  </span>
                </button>
              </>
            )}

            <button
              onClick={handleRestMore}
              type="button"
              className="w-full py-2 px-4 rounded-xl bg-white text-[#747872] hover:text-[#2e3b30] font-semibold text-[12px] flex items-center justify-center gap-1.5 border border-[#c4c8c1]/30 hover:bg-[#ede8dc] active:scale-95 transition-all"
            >
              <span>☕</span>
              <span>{language === 'vi' ? 'Nghỉ ngơi thêm chút nữa' : 'Rest a bit more'}</span>
            </button>
          </div>

          {/* Toast Alert */}
          {showRestToast && (
            <div className="p-2.5 rounded-xl bg-[#c6e8c9] text-[#04210e] text-center text-[12px] font-medium shadow-xs border border-[#47654d]/30 animate-fade-in">
              {language === 'vi'
                ? '🌿 Hãy hít thở sâu, khu vườn ươm luôn chờ đợi bạn.'
                : '🌿 Take a deep breath; the conservatory will wait for you.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
