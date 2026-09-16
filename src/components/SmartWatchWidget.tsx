import React, { useState, useEffect } from 'react';
import { SmartWatchBiometrics, Language, ScreenId } from '../types';

interface SmartWatchWidgetProps {
  language: Language;
  biometrics: SmartWatchBiometrics;
  onUpdateBiometrics: (bio: Partial<SmartWatchBiometrics>) => void;
  onNavigate?: (screen: ScreenId) => void;
  compact?: boolean;
}

export const SmartWatchWidget: React.FC<SmartWatchWidgetProps> = ({
  language,
  biometrics,
  onUpdateBiometrics,
  onNavigate,
  compact = false,
}) => {
  const [pulse, setPulse] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Periodic heartbeat animation & slight HR variation simulation
  useEffect(() => {
    const beatInterval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 900);
    return () => clearInterval(beatInterval);
  }, []);

  const handleSimulateStress = (level: 'low' | 'moderate' | 'high') => {
    if (level === 'low') {
      onUpdateBiometrics({
        stressScore: 28,
        stressLevel: 'low',
        heartRate: 68,
        lastSync: 'Vừa xong',
      });
    } else if (level === 'moderate') {
      onUpdateBiometrics({
        stressScore: 54,
        stressLevel: 'moderate',
        heartRate: 78,
        lastSync: 'Vừa xong',
      });
    } else {
      onUpdateBiometrics({
        stressScore: 82,
        stressLevel: 'high',
        heartRate: 94,
        lastSync: 'Vừa xong',
      });
    }
  };

  const getStressDetails = () => {
    switch (biometrics.stressLevel) {
      case 'high':
        return {
          label: language === 'vi' ? 'Căng thẳng nhận thức' : 'High Cognitive Stress',
          color: 'text-[#823925]',
          bg: 'bg-[#ffdad2]/70',
          border: 'border-[#ffb4a2]',
          badge: '⚠️ ' + (language === 'vi' ? 'Cao' : 'High'),
          suggestion:
            language === 'vi'
              ? 'Nhịp tim 94 bpm & stress tăng cao (82/100)! Mimi khuyên bạn giảm phiên học xuống 15m, tạm hoãn bài khó và thực hiện ngay nhịp thở Box 4·4·4.'
              : 'HR 94 bpm & elevated stress (82/100)! Mimi suggests shortening sessions to 15m and practicing Box 4·4·4 breathing first.',
          actionText: language === 'vi' ? 'Hạ stress ngay' : 'Calm Stress Now',
          actionScreen: 'break-soothing-rest' as ScreenId,
        };
      case 'moderate':
        return {
          label: language === 'vi' ? 'Cân bằng điều hòa' : 'Moderate Balance',
          color: 'text-[#546255]',
          bg: 'bg-[#ede8dc]/80',
          border: 'border-[#c4c8c1]/40',
          badge: '🌤️ ' + (language === 'vi' ? 'Vừa' : 'Med'),
          suggestion:
            language === 'vi'
              ? 'Chỉ số nhịp tim & độ stress ở mức ổn định (54/100). Thích hợp cho các việc sáng tạo thị giác (như Wireframing).'
              : 'Heart rate & stress are in steady balance (54/100). Well suited for creative visual work (such as Wireframing).',
          actionText: language === 'vi' ? 'Bắt đầu việc sáng tạo' : 'Start Creative Flow',
          actionScreen: 'one-next-action-focus' as ScreenId,
        };
      case 'low':
      default:
        return {
          label: language === 'vi' ? 'Thư thái & Tập trung' : 'Calm & Receptive',
          color: 'text-[#04210e]',
          bg: 'bg-[#c6e8c9]/50',
          border: 'border-[#47654d]/30',
          badge: '🌿 ' + (language === 'vi' ? 'Tối ưu' : 'Optimal'),
          suggestion:
            language === 'vi'
              ? 'Nhịp tim 68 bpm & độ stress rất thấp (28/100). Đây là “khung giờ vàng” để giải quyết bài tập LMS khó nhất [Tâm lý học Ch.4]!'
              : 'HR 68 bpm & low stress (28/100). Prime cognitive window for demanding LMS coursework [Psychology Ch.4]!',
          actionText: language === 'vi' ? 'Giải quyết bài LMS' : 'Tackle LMS Task',
          actionScreen: 'workload-overview' as ScreenId,
        };
    }
  };

  const details = getStressDetails();

  return (
    <div
      className={`w-full rounded-2xl transition-all shadow-xs border ${details.border} ${
        biometrics.stressLevel === 'high' ? 'bg-[#fff5f2]' : 'bg-[#fbf7ee]'
      } p-3.5`}
    >
      {/* Top Header: Watch Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-lg bg-[#2e3b30] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[16px]">watch</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#47654d] ring-1 ring-white"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-[#2e3b30]">
                {biometrics.deviceName}
              </span>
              <span className="text-[9px] font-bold text-[#04210e] bg-[#c6e8c9] px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#47654d] animate-ping"></span>
                {language === 'vi' ? 'Trực tiếp' : 'Live'}
              </span>
            </div>
            <span className="text-[10px] text-[#747872]">
              {language === 'vi' ? 'Theo dõi sức khỏe & Stress' : 'Biometrics & Stress Tracking'}
            </span>
          </div>
        </div>

        {/* Battery & Quick Toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-[#747872] flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/20">
            <span className="material-symbols-outlined text-[13px] text-[#47654d]">battery_charging_full</span>
            {biometrics.battery}%
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 rounded-full bg-white text-[#434843] flex items-center justify-center hover:bg-[#ede8dc] text-[14px]"
            title="Toggle Details"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      </div>

      {/* Biometric Vital Metrics Bar */}
      <div className="grid grid-cols-2 gap-2 mt-2.5">
        {/* Heart Rate */}
        <div className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 border border-[#c4c8c1]/20 shadow-xs">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
              pulse ? 'scale-110' : 'scale-100'
            } ${biometrics.stressLevel === 'high' ? 'bg-[#ffdad2] text-[#823925]' : 'bg-[#f3ede1] text-[#b34033]'}`}
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#747872] uppercase tracking-wider font-semibold">
              {language === 'vi' ? 'Nhịp tim' : 'Heart Rate'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-bold text-[#2e3b30] leading-none">
                {biometrics.heartRate}
              </span>
              <span className="text-[10px] text-[#747872]">bpm</span>
            </div>
          </div>
        </div>

        {/* Stress Score */}
        <div className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 border border-[#c4c8c1]/20 shadow-xs">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              biometrics.stressLevel === 'high'
                ? 'bg-[#ffdad2] text-[#823925]'
                : biometrics.stressLevel === 'moderate'
                ? 'bg-[#ede8dc] text-[#546255]'
                : 'bg-[#c6e8c9] text-[#04210e]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {biometrics.stressLevel === 'high' ? 'bolt' : 'self_improvement'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#747872] uppercase tracking-wider font-semibold">
                {language === 'vi' ? 'Mức Stress' : 'Stress'}
              </span>
              <span className="text-[9px] font-bold">{details.badge}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-[18px] font-bold leading-none ${
                  biometrics.stressLevel === 'high' ? 'text-[#823925]' : 'text-[#2e3b30]'
                }`}
              >
                {biometrics.stressScore}
              </span>
              <span className="text-[10px] text-[#747872]">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Interactive Simulation & Adaptive Mimi Suggestion */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-[#c4c8c1]/25 flex flex-col gap-2">
          {/* Stress Level Simulation Selector */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#747872] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">tune</span>
              {language === 'vi' ? 'Mô phỏng nhịp sinh học' : 'Simulate Bio-state'}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSimulateStress('low')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                  biometrics.stressLevel === 'low'
                    ? 'bg-[#47654d] text-white shadow-xs'
                    : 'bg-white text-[#434843] hover:bg-[#ede8dc]'
                }`}
              >
                🌿 28
              </button>
              <button
                type="button"
                onClick={() => handleSimulateStress('moderate')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                  biometrics.stressLevel === 'moderate'
                    ? 'bg-[#47654d] text-white shadow-xs'
                    : 'bg-white text-[#434843] hover:bg-[#ede8dc]'
                }`}
              >
                🌤️ 54
              </button>
              <button
                type="button"
                onClick={() => handleSimulateStress('high')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                  biometrics.stressLevel === 'high'
                    ? 'bg-[#823925] text-white shadow-xs'
                    : 'bg-white text-[#434843] hover:bg-[#ede8dc]'
                }`}
              >
                ⚠️ 82
              </button>
            </div>
          </div>

          {/* Adaptive Mimi Guidance Box */}
          <div
            className={`rounded-xl p-2.5 ${details.bg} border ${details.border} flex flex-col gap-1.5 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[12px] text-[#2e3b30]">
                <span className="material-symbols-outlined text-[15px] text-[#47654d]">
                  psychology_alt
                </span>
                <span>
                  {language === 'vi' ? 'Đề xuất thích ứng từ Mimi' : "Mimi's Adaptive Recommendation"}
                </span>
              </div>
              <span className={`text-[10px] font-semibold ${details.color}`}>
                {details.label}
              </span>
            </div>

            <p className="text-[12px] text-[#2e3b30] leading-relaxed">
              {details.suggestion}
            </p>

            {/* Quick Smart Action */}
            {onNavigate && (
              <button
                onClick={() => onNavigate(details.actionScreen)}
                className={`self-start mt-0.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shadow-xs active:scale-95 ${
                  biometrics.stressLevel === 'high'
                    ? 'bg-[#823925] text-white'
                    : 'bg-[#2e3b30] text-white'
                }`}
              >
                <span>{details.actionText}</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
