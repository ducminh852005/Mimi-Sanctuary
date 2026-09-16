import React, { useState, useEffect } from 'react';
import { ScreenId, Language, SmartWatchBiometrics, Task, TaskMethodology, TaskResource } from '../types';
import { IMAGES } from '../data/content';
import { ambientSound } from '../utils/audio';
import {
  TASK_METHODOLOGIES,
  TASK_RESOURCES,
  getTaskKnowledgeKey,
  INITIAL_POPUP_QUESTIONS,
} from '../data/focusKnowledge';
import { FocusChatPopup } from './FocusChatPopup';
import {
  Sparkles,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Bot,
  Paperclip,
  Lightbulb,
  GraduationCap,
  Globe,
  FileText,
  Check,
  Compass,
  MessageCircle,
  Play,
  Pause,
  Plus,
  PlayCircle,
  PauseCircle,
  ArrowRight,
  Heart,
  Edit3,
  Layers,
  Clock,
} from 'lucide-react';

interface FocusTimerScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  biometrics: SmartWatchBiometrics;
  tasks?: Task[];
  activeTask?: Task;
  onCompleteBranch?: (branchIndex: number) => void;
  onSaveAndReturnHome?: () => void;
}

export const FocusTimerScreen: React.FC<FocusTimerScreenProps> = ({
  onNavigate,
  language,
  biometrics,
  tasks = [],
  activeTask,
  onCompleteBranch,
  onSaveAndReturnHome,
}) => {
  // Select active task (prefer activeTask from App.tsx)
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    activeTask ? activeTask.id : (tasks.length > 0 ? tasks[0].id : 't1')
  );

  const currentTask = activeTask || tasks.find((t) => t.id === selectedTaskId) || tasks[0];
  const currentBranchIndex = currentTask?.currentBranchIndex ?? 0;
  const currentBranch =
    currentTask?.workTree?.branches[currentBranchIndex] ||
    currentTask?.workTree?.branches[0];

  const knowledgeKey = getTaskKnowledgeKey(currentTask);
  const taskMethodologies: TaskMethodology[] =
    TASK_METHODOLOGIES[knowledgeKey] ||
    TASK_METHODOLOGIES['default'] ||
    [];
  const taskResources: TaskResource[] =
    TASK_RESOURCES[knowledgeKey] ||
    TASK_RESOURCES['PSYC101'] ||
    [];

  // Active methodology applied
  const [appliedMethodology, setAppliedMethodology] = useState<TaskMethodology | null>(
    taskMethodologies.length > 0 ? taskMethodologies[0] : null
  );
  const [expandedMethodologyId, setExpandedMethodologyId] = useState<string | null>(
    taskMethodologies.length > 0 ? taskMethodologies[0].id : null
  );

  // Resource preview modal / excerpt expansion
  const [expandedResourceId, setExpandedResourceId] = useState<string | null>(null);
  const [resourceFilter, setResourceFilter] = useState<'all' | 'lms' | 'attachment' | 'web'>('all');

  // AI Chat Popup state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Timer & Audio states
  const [secondsRemaining, setSecondsRemaining] = useState(24 * 60 + 15);
  const [isPaused, setIsPaused] = useState(false);
  const [isInhale, setIsInhale] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isDoneSubmitting, setIsDoneSubmitting] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Update knowledge when task changes
  useEffect(() => {
    const key = getTaskKnowledgeKey(currentTask);
    const methods = TASK_METHODOLOGIES[key] || TASK_METHODOLOGIES['default'];
    if (methods && methods.length > 0) {
      setAppliedMethodology(methods[0]);
      setExpandedMethodologyId(methods[0].id);
    }
  }, [selectedTaskId]);

  // Timer Tick
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Organic Breathing Rhythm Cycle (4s Inhale / 4s Exhale)
  useEffect(() => {
    const breathCycle = setInterval(() => {
      if (!isPaused) {
        setIsInhale((prev) => !prev);
      }
    }, 4000);

    return () => clearInterval(breathCycle);
  }, [isPaused]);

  const toggleAudio = () => {
    const playing = ambientSound.toggleAmbient();
    setIsAudioPlaying(playing);
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const handleAddFiveMin = () => {
    setSecondsRemaining((prev) => prev + 5 * 60);
  };

  const handleMarkDone = () => {
    setIsDoneSubmitting(true);
    if (onCompleteBranch) {
      onCompleteBranch(currentBranchIndex);
    }
    setTimeout(() => {
      onNavigate('break-soothing-rest');
    }, 350);
  };

  const handleReturnHomeMidway = () => {
    if (onSaveAndReturnHome) {
      onSaveAndReturnHome();
    }
    onNavigate('dump-ambient-home');
  };

  const handleApplyMethod = (method: TaskMethodology) => {
    setAppliedMethodology(method);
    setCopiedNotification(
      language === 'vi'
        ? `Đã kích hoạt phương pháp: ${method.name.vi}`
        : `Activated method: ${method.name.en}`
    );
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const filteredResources = taskResources.filter((res) => {
    if (resourceFilter === 'all') return true;
    if (resourceFilter === 'lms') return res.sourceType === 'lms';
    if (resourceFilter === 'attachment') return res.sourceType === 'attachment';
    if (resourceFilter === 'web') return res.sourceType === 'web' || res.sourceType === 'brain_dump';
    return true;
  });

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLMS = currentTask?.source === 'lms';

  return (
    <div className="w-full flex flex-col gap-3.5 pb-20 relative">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2e3b30] text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-[#c6e8c9]/40 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#c6e8c9]" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Top Monotask Focus Bar with Source & Task Switcher */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Column: Monotask Focus, Timer, Audio & Completion */}
        <div className="w-full lg:col-span-5 flex flex-col gap-3.5 lg:sticky lg:top-20">
          <div className="bg-[#f3ede1] p-3 rounded-2xl border border-[#c4c8c1]/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isLMS ? 'bg-[#c6e8c9] text-[#04210e]' : 'bg-[#ffdad2] text-[#823925]'
              }`}
            >
              {isLMS ? (
                <GraduationCap className="w-4 h-4 text-[#47654d]" />
              ) : (
                <Edit3 className="w-4 h-4 text-[#823925]" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[13px] font-bold text-[#2e3b30] truncate">
                  {currentTask?.title[language] || 'Mobile UX Wireframing'}
                </span>
                {isLMS ? (
                  <span className="text-[9px] font-bold bg-[#c6e8c9] text-[#04210e] px-1.5 py-0.2 rounded">
                    Canvas LMS {currentTask?.courseCode}
                  </span>
                ) : (
                  <span className="text-[9px] font-bold bg-[#ffdad2] text-[#823925] px-1.5 py-0.2 rounded">
                    Brain Dump
                  </span>
                )}
                {currentTask?.attachmentName && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#e8f3ea] text-[#04210e] px-1.5 py-0.2 rounded border border-[#c6e8c9]">
                    <Paperclip className="w-2.5 h-2.5 text-[#47654d]" />
                    {currentTask.attachmentName}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#747872] flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-[#47654d]" />
                {isLMS
                  ? language === 'vi'
                    ? `Hạn nộp: ${typeof currentTask?.deadline === 'object' ? currentTask.deadline[language] : currentTask?.deadline || '23:59'}`
                    : `Due: ${typeof currentTask?.deadline === 'object' ? currentTask.deadline[language] : currentTask?.deadline || '23:59'}`
                  : language === 'vi'
                  ? 'Ý tưởng từ suy nghĩ tự do'
                  : 'Extracted freeform note'}
              </span>
            </div>
          </div>

          {/* Live Watch Biometrics Pill */}
          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-[#c4c8c1]/25 shadow-xs shrink-0">
            <span className="text-[11px] text-[#b34033] flex items-center gap-0.5 font-bold">
              <Heart className="w-3 h-3 text-[#b34033] fill-[#b34033]/20" />
              {biometrics.heartRate}
            </span>
            <span className="text-[#c4c8c1]">•</span>
            <span className="text-[10px] text-[#47654d] font-semibold">
              Stress {biometrics.stressScore}
            </span>
          </div>
        </div>

        {/* Task Switcher (if multiple tasks exist) */}
        {tasks.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto pt-1 border-t border-[#c4c8c1]/20">
            <span className="text-[10px] font-bold text-[#747872] shrink-0">
              {language === 'vi' ? 'Đổi tác vụ:' : 'Switch task:'}
            </span>
            {tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-all font-medium border ${
                  t.id === selectedTaskId
                    ? 'bg-[#2e3b30] text-white border-[#2e3b30]'
                    : 'bg-white text-[#555b55] hover:bg-[#ede8dc] border-[#c4c8c1]/30'
                }`}
              >
                {t.title[language]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Applied Methodology Banner (If selected) */}
      {appliedMethodology && (
        <div className="px-3 py-2 bg-[#e8f3ea] rounded-xl border border-[#c6e8c9] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#47654d] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#c6e8c9]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-[#04210e] truncate">
                {language === 'vi' ? 'Đang áp dụng: ' : 'Active Method: '}
                {appliedMethodology.name[language]}
              </span>
              <span className="text-[9px] text-[#47654d] truncate">
                {appliedMethodology.badge[language]}
              </span>
            </div>
          </div>
          <button
            onClick={() => setExpandedMethodologyId(appliedMethodology.id)}
            className="text-[10px] font-bold text-[#47654d] underline shrink-0 hover:text-[#04210e]"
          >
            {language === 'vi' ? 'Xem các bước' : 'View steps'}
          </button>
        </div>
      )}

      {/* Central Breathing Circle & Timer */}
      <div className="relative flex flex-col items-center justify-center bg-[#f9f3e7] rounded-2xl px-4 py-5 shadow-xs border border-[#c4c8c1]/30 overflow-hidden">
        {/* Soft Breathing Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c6e8c9]/35 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#d8e6d6]/40 blur-2xl pointer-events-none"></div>

        {/* Breathing Rhythm State Pill */}
        <div className="flex items-center gap-1.5 px-3 py-0.8 bg-white rounded-full shadow-xs mb-2 border border-[#c4c8c1]/20">
          <span className="text-[12px]">{isInhale ? '🫁' : '💨'}</span>
          <span className="text-[11px] font-semibold text-[#47654d]">
            {isPaused
              ? language === 'vi' ? 'Đang tạm dừng' : 'Paused'
              : isInhale
              ? language === 'vi' ? 'Hít vào chậm rãi' : 'Inhale gently'
              : language === 'vi' ? 'Thở ra buông lỏng' : 'Exhale softly'}
          </span>
        </div>

        {/* Circular Breathing Timer Core */}
        <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 my-1">
          {/* Outer Pulsing Halo */}
          <div
            className={`absolute inset-0 rounded-full bg-[#c6e8c9]/40 transition-transform duration-[4000ms] ease-in-out ${
              isInhale ? 'scale-110' : 'scale-95'
            }`}
          ></div>
          {/* Middle Ring */}
          <div
            className={`absolute inset-3 rounded-full bg-[#c6e8c9]/60 transition-transform duration-[4000ms] ease-in-out shadow-xs ${
              isInhale ? 'scale-105' : 'scale-90'
            }`}
          ></div>

          {/* Inner Core */}
          <div className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#ffffff] shadow-md flex flex-col items-center justify-center text-center p-2 border border-[#c4c8c1]/30">
            <span className="text-[28px] sm:text-[32px] font-bold text-[#2e3b30] leading-none tracking-tight">
              {timeFormatted}
            </span>
            <span className="text-[10px] text-[#747872] mt-1 font-medium">
              {isPaused
                ? language === 'vi' ? 'tạm dừng' : 'paused'
                : language === 'vi' ? 'an tĩnh' : 'calm time'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons (Pause/Resume & +5m) */}
        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePauseToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#ede8dc] text-[#2e3b30] rounded-full border border-[#c4c8c1]/40 text-[12px] font-semibold shadow-2xs transition-all active:scale-95"
            title={isPaused ? (language === 'vi' ? 'Tiếp tục' : 'Resume') : (language === 'vi' ? 'Tạm dừng' : 'Pause')}
          >
            {isPaused ? (
              <PlayCircle className="w-4 h-4 text-[#47654d]" />
            ) : (
              <PauseCircle className="w-4 h-4 text-[#47654d]" />
            )}
            <span>
              {isPaused
                ? language === 'vi' ? 'Tiếp tục' : 'Resume'
                : language === 'vi' ? 'Tạm dừng' : 'Pause'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleAddFiveMin}
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#ede8dc] text-[#2e3b30] rounded-full border border-[#c4c8c1]/40 text-[12px] font-semibold shadow-2xs transition-all active:scale-95"
            title={language === 'vi' ? 'Thêm 5 phút' : 'Add 5 minutes'}
          >
            <Clock className="w-3.5 h-3.5 text-[#47654d]" />
            <span>+5m</span>
          </button>
        </div>

        {/* Audio Player Dock */}
        <div className="mt-2 flex items-center justify-between w-full max-w-xs bg-[#ffffff] px-3.5 py-1.5 rounded-full shadow-xs border border-[#c4c8c1]/30">
          <div className="flex items-center gap-2">
            <span className="text-[14px]">{isAudioPlaying ? '🌧️' : '🎧'}</span>
            <span className="text-[11px] font-semibold text-[#2e3b30]">
              {language === 'vi' ? 'Mưa Vườn kính 432Hz' : 'Conservatory Rain 432Hz'}
            </span>
          </div>
          <button
            onClick={toggleAudio}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isAudioPlaying ? 'bg-[#47654d] text-white' : 'bg-[#f3ede1] text-[#2e3b30]'
            }`}
            title="Toggle Audio"
          >
            {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Current Branch and Micro-actions */}
      {currentBranch && (
        <div className="p-3 bg-white rounded-xl border border-[#c4c8c1]/30 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#47654d] flex items-center gap-1">
              <span>🌱</span>
              <span>
                {language === 'vi'
                  ? `Nhánh ${(currentBranchIndex || 0) + 1}/${currentTask?.workTree?.branches.length || 3}`
                  : `Branch ${(currentBranchIndex || 0) + 1}/${currentTask?.workTree?.branches.length || 3}`}
              </span>
            </span>
            <span className="text-[10px] text-[#747872] font-semibold">
              ⏱️ {currentBranch.estimatedMin}m
            </span>
          </div>

          <h4 className="text-[13px] font-bold text-[#2e3b30]">
            {currentBranch.title[language]}
          </h4>

          {/* Leaves / Micro-actions Checklist */}
          {currentBranch.leaves && currentBranch.leaves.length > 0 && (
            <div className="mt-1 pt-1.5 border-t border-[#c4c8c1]/20 flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-[#747872]">
                {language === 'vi' ? 'Hành động nhỏ của nhánh này:' : 'Micro-actions for this branch:'}
              </span>
              {currentBranch.leaves.map((leaf) => (
                <label
                  key={leaf.id}
                  className="flex items-start gap-2 text-[11px] text-[#434843] cursor-pointer hover:text-[#2e3b30] select-none"
                >
                  <input
                    type="checkbox"
                    defaultChecked={leaf.completed}
                    className="mt-0.5 rounded text-[#47654d] focus:ring-0 cursor-pointer accent-[#47654d]"
                  />
                  <span>{leaf.title[language]}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Action - Mark Done and Save Progress (Desktop) */}
      <div className="hidden lg:flex flex-col gap-2 pt-1">
        <button
          onClick={handleMarkDone}
          disabled={isDoneSubmitting}
          className="w-full py-3.5 px-4 bg-[#2e3b30] hover:bg-[#455246] text-[#ffffff] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
        >
          <CheckCircle2 className="w-5 h-5 text-[#c6e8c9]" />
          <span>
            {isDoneSubmitting
              ? language === 'vi' ? 'Chuyển sang nghỉ ngơi...' : 'Opening Break...'
              : language === 'vi'
              ? `Xong nhánh ${(currentBranchIndex || 0) + 1} & Nghỉ ngơi`
              : `Done Branch ${(currentBranchIndex || 0) + 1} & Take Break`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleReturnHomeMidway}
          className="w-full py-2.5 px-4 bg-[#f3ede1] hover:bg-[#ede8dc] text-[#2e3b30] rounded-xl font-semibold text-[12px] flex items-center justify-center gap-1.5 border border-[#c4c8c1]/30 active:scale-95 transition-all"
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

    {/* Right Column: AI Recommendations, Resources, and Pacing Assistant */}
    <div className="w-full lg:col-span-7 flex flex-col gap-3.5">
      {/* SECTION 1: AI GỢI Ý PHƯƠNG PHÁP LÀM (AI METHODOLOGY SUGGESTIONS) */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#c4c8c1]/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#c6e8c9] text-[#04210e] flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-[#47654d]" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#2e3b30] leading-tight">
                {language === 'vi' ? 'AI Gợi ý phương pháp làm' : 'AI Recommended Methods'}
              </h3>
              <p className="text-[10px] text-[#747872]">
                {language === 'vi'
                  ? 'Phương pháp khoa học tối ưu riêng cho tác vụ này'
                  : 'Cognitive techniques tailored to this monotask'}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold bg-[#f3ede1] text-[#47654d] px-2 py-0.5 rounded-full border border-[#c4c8c1]/20">
            {taskMethodologies.length} {language === 'vi' ? 'phương pháp' : 'methods'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {taskMethodologies.map((method) => {
            const isExpanded = expandedMethodologyId === method.id;
            const isApplied = appliedMethodology?.id === method.id;

            return (
              <div
                key={method.id}
                className={`rounded-xl border transition-all ${
                  isApplied
                    ? 'border-[#47654d] bg-[#f9fcf9]'
                    : 'border-[#c4c8c1]/30 bg-[#fbf7ee]/60 hover:bg-[#fbf7ee]'
                }`}
              >
                {/* Method Header */}
                <div
                  onClick={() => setExpandedMethodologyId(isExpanded ? null : method.id)}
                  className="p-3 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] font-bold text-[#2e3b30]">
                        {method.name[language]}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#c6e8c9] text-[#04210e]">
                        {method.badge[language]}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#555b55] line-clamp-1 mt-0.5">
                      {method.howToApply[language]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {isApplied && (
                      <span className="text-[9px] font-bold bg-[#47654d] text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        {language === 'vi' ? 'Đang dùng' : 'Active'}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#747872]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#747872]" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#c4c8c1]/20 flex flex-col gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-white border border-[#c4c8c1]/20">
                      <span className="font-bold text-[#47654d] block mb-0.5">
                        {language === 'vi' ? '💡 Cách áp dụng ngay:' : '💡 Immediate Application:'}
                      </span>
                      <p className="text-[#2e3b30] leading-relaxed">
                        {method.howToApply[language]}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-[#f3ede1]/60">
                      <span className="font-bold text-[#823925] block mb-0.5">
                        {language === 'vi' ? '🧠 Lợi ích nhận thức:' : '🧠 Cognitive Science Benefit:'}
                      </span>
                      <p className="text-[#555b55] leading-relaxed">
                        {method.scientificBenefit[language]}
                      </p>
                    </div>

                    {/* Step Checklist */}
                    <div>
                      <span className="font-bold text-[#2e3b30] text-[10px] uppercase tracking-wider block mb-1">
                        {language === 'vi' ? '3 Bước thực hiện:' : '3 Execution Steps:'}
                      </span>
                      <div className="flex flex-col gap-1">
                        {method.steps[language].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[#2e3b30]">
                            <span className="w-4 h-4 rounded-full bg-[#c6e8c9] text-[#04210e] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      type="button"
                      onClick={() => handleApplyMethod(method)}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs ${
                        isApplied
                          ? 'bg-[#c6e8c9] text-[#04210e]'
                          : 'bg-[#2e3b30] hover:bg-[#47654d] text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isApplied
                          ? language === 'vi' ? 'Đang kích hoạt phương pháp này' : 'Currently Applied'
                          : language === 'vi' ? 'Áp dụng phương pháp này' : 'Apply This Method'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CÁC TRANG WEB, NGUỒN CÓ THỂ GIÚP USER HOÀN THÀNH TASK */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#c4c8c1]/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#c6e8c9] text-[#04210e] flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-[#47654d]" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#2e3b30] leading-tight">
                {language === 'vi' ? 'Trang web & Tài nguyên hỗ trợ' : 'Curated Sources & Sites'}
              </h3>
              <p className="text-[10px] text-[#747872]">
                {language === 'vi'
                  ? 'Tổng hợp từ Canvas LMS, tệp đính kèm và web uy tín'
                  : 'Grounded in Canvas LMS, attachments & academic web'}
              </p>
            </div>
          </div>
        </div>

        {/* Source Filter Tags */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {(['all', 'lms', 'attachment', 'web'] as const).map((filter) => {
            const labels = {
              all: { vi: 'Tất cả nguồn', en: 'All' },
              lms: { vi: 'Canvas LMS', en: 'Canvas LMS' },
              attachment: { vi: 'Tài liệu đính kèm', en: 'Attached' },
              web: { vi: 'Web & Ghi chép', en: 'Web & Notes' },
            };
            return (
              <button
                key={filter}
                onClick={() => setResourceFilter(filter)}
                className={`text-[10px] px-2.5 py-0.8 rounded-full whitespace-nowrap transition-all font-medium border ${
                  resourceFilter === filter
                    ? 'bg-[#47654d] text-white border-[#47654d]'
                    : 'bg-[#f3ede1] text-[#555b55] hover:bg-[#ede8dc] border-[#c4c8c1]/30'
                }`}
              >
                {labels[filter][language]}
              </button>
            );
          })}
        </div>

        {/* Resource Cards */}
        <div className="flex flex-col gap-2">
          {filteredResources.map((res) => {
            const isExcerptOpen = expandedResourceId === res.id;
            return (
              <div
                key={res.id}
                className="p-3 rounded-xl bg-[#fbf7ee]/80 border border-[#c4c8c1]/30 flex flex-col gap-1.5 hover:bg-[#fbf7ee] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-white border border-[#c4c8c1]/30 flex items-center justify-center shrink-0 mt-0.5">
                      {res.sourceType === 'lms' && <BookOpen className="w-3.5 h-3.5 text-[#47654d]" />}
                      {res.sourceType === 'attachment' && <Paperclip className="w-3.5 h-3.5 text-[#823925]" />}
                      {res.sourceType === 'web' && <Globe className="w-3.5 h-3.5 text-[#2e3b30]" />}
                      {res.sourceType === 'brain_dump' && <Sparkles className="w-3.5 h-3.5 text-[#d97d64]" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-bold text-[#2e3b30] leading-snug">
                        {res.title[language]}
                      </span>
                      <span className="text-[9px] font-semibold text-[#47654d]">
                        {res.sourceTag[language]}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/30 text-[#747872] shrink-0">
                    {res.sourceType.toUpperCase()}
                  </span>
                </div>

                <p className="text-[11px] text-[#555b55] leading-relaxed">
                  {res.description[language]}
                </p>

                {/* Excerpt toggle if available */}
                {res.keyExcerpt && (
                  <div className="mt-1 pt-1.5 border-t border-[#c4c8c1]/20">
                    <button
                      type="button"
                      onClick={() => setExpandedResourceId(isExcerptOpen ? null : res.id)}
                      className="text-[10px] font-bold text-[#47654d] hover:underline flex items-center gap-1"
                    >
                      <span>
                        {isExcerptOpen
                          ? language === 'vi' ? 'Ẩn trích dẫn' : 'Hide excerpt'
                          : language === 'vi' ? 'Xem đoạn trích dẫn quan trọng' : 'View key excerpt'}
                      </span>
                      {isExcerptOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {isExcerptOpen && (
                      <div className="mt-1 p-2 rounded-lg bg-white border border-[#47654d]/20 text-[10px] text-[#2e3b30] italic">
                        "{res.keyExcerpt[language]}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: IN-PAGE TRIGGER FOR GROUNDED AI POPUP CHAT */}
      <div className="bg-gradient-to-br from-[#f3ede1] to-[#e8f3ea] p-3.5 rounded-2xl border border-[#c6e8c9] shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2e3b30] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#c6e8c9]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#2e3b30]">
                {language === 'vi' ? 'Hỏi Mimi về bài học này' : 'Ask Mimi about this task'}
              </h4>
              <p className="text-[10px] text-[#47654d] font-medium">
                {language === 'vi'
                  ? 'Trả lời dựa trên Canvas LMS, tài liệu & ghi chép Brain Dump'
                  : 'Answers grounded in Canvas LMS, attachments & Brain Dump'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick sample prompt chips */}
        <div className="grid grid-cols-1 gap-1.5 mt-1">
          {(INITIAL_POPUP_QUESTIONS[knowledgeKey]?.[language] || INITIAL_POPUP_QUESTIONS['PSYC101'][language])
            .slice(0, 2)
            .map((question, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="text-left p-2 rounded-xl bg-white hover:bg-[#e8f3ea] text-[11px] font-medium text-[#2e3b30] border border-[#c4c8c1]/30 transition-all flex items-center justify-between gap-1 shadow-2xs"
              >
                <span className="truncate">{question}</span>
                <ArrowRight className="w-3 h-3 text-[#47654d] shrink-0" />
              </button>
            ))}
        </div>

        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="w-full mt-1 py-2 px-3 bg-[#2e3b30] hover:bg-[#47654d] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4 text-[#c6e8c9]" />
          <span>
            {language === 'vi'
              ? 'Mở khung chat popup đặt câu hỏi'
              : 'Open Popup Chat Enclave'}
          </span>
        </button>
      </div>

      {/* Main Action - Mark Done and Save Progress (Mobile/Tablet) */}
      <div className="flex flex-col gap-2 pt-2 block lg:hidden">
        <button
          onClick={handleMarkDone}
          disabled={isDoneSubmitting}
          className="w-full py-3.5 px-4 bg-[#2e3b30] hover:bg-[#455246] text-[#ffffff] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
        >
          <CheckCircle2 className="w-5 h-5 text-[#c6e8c9]" />
          <span>
            {isDoneSubmitting
              ? language === 'vi' ? 'Chuyển sang nghỉ ngơi...' : 'Opening Break...'
              : language === 'vi'
              ? `Xong nhánh ${(currentBranchIndex || 0) + 1} & Nghỉ ngơi`
              : `Done Branch ${(currentBranchIndex || 0) + 1} & Take Break`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleReturnHomeMidway}
          className="w-full py-2.5 px-4 bg-[#f3ede1] hover:bg-[#ede8dc] text-[#2e3b30] rounded-xl font-semibold text-[12px] flex items-center justify-center gap-1.5 border border-[#c4c8c1]/30 active:scale-95 transition-all"
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

      {/* FLOATING ACTION BUTTON (POPUP CHAT TRIGGER) */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 right-4 sm:right-8 z-40 bg-[#2e3b30] hover:bg-[#47654d] text-white px-3.5 py-2.5 rounded-full shadow-xl border border-[#c6e8c9]/40 flex items-center gap-2 transition-all active:scale-95 group"
        title={language === 'vi' ? 'Hỏi Mimi về bài học (Popup Chat)' : 'Ask Mimi about this task'}
      >
        <div className="relative">
          <Bot className="w-4 h-4 text-[#c6e8c9]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#d97d64] animate-pulse"></span>
        </div>
        <span className="text-[12px] font-bold">
          {language === 'vi' ? 'Hỏi Mimi' : 'Ask Mimi'}
        </span>
      </button>

      {/* MODAL POPUP CHAT */}
      <FocusChatPopup
        task={currentTask}
        language={language}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
