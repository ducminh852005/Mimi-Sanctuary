import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScreenId,
  Language,
  EnergyRhythm,
  SmartWatchBiometrics,
  WorkTreeDraft,
  WorkTreeBranch,
  Task,
  getLocalizedText,
} from '../types';
import { formatDuration, formatDetailedDuration } from '../utils/formatters';
import { IMAGES } from '../data/content';
import {
  Sprout,
  RotateCcw,
  Sparkles,
  FolderTree,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Heart,
  Watch,
  Flame,
  Leaf,
  Layers,
  Check,
} from 'lucide-react';

interface WorkloadOverviewScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  biometrics: SmartWatchBiometrics;
  workTreeDraft?: WorkTreeDraft | null;
  activeTask?: Task;
  tasks?: Task[];
  onSelectTask?: (task: Task) => void;
  onSaveAndReturnHome?: () => void;
}

export const WorkloadOverviewScreen: React.FC<WorkloadOverviewScreenProps> = ({
  onNavigate,
  language,
  biometrics,
  workTreeDraft: passedDraft,
  activeTask,
  tasks = [],
  onSelectTask,
  onSaveAndReturnHome,
}) => {
  const workTreeDraft = activeTask?.workTree || passedDraft;
  const currentBranchIdx = activeTask?.currentBranchIndex ?? 0;
  const [activeBranch, setActiveBranch] = useState<'wireframes' | 'reading' | 'vocab'>('wireframes');
  const [selectedBranchIdx, setSelectedBranchIdx] = useState<number>(currentBranchIdx);
  const [energyRhythm, setEnergyRhythm] = useState<EnergyRhythm>('morning');
  const [sproutKey, setSproutKey] = useState<number>(1);
  const [isSprouting, setIsSprouting] = useState<boolean>(true);

  // Sync selectedBranchIdx when activeTask changes
  useEffect(() => {
    if (activeTask?.currentBranchIndex !== undefined) {
      setSelectedBranchIdx(activeTask.currentBranchIndex);
    }
  }, [activeTask?.currentBranchIndex]);

  // Trigger sprout animation when arriving from approved draft
  useEffect(() => {
    setIsSprouting(true);
    const timer = setTimeout(() => setIsSprouting(false), 2600);
    return () => clearTimeout(timer);
  }, [sproutKey, workTreeDraft?.isApproved]);

  const handleReplaySprout = () => {
    setSproutKey((k) => k + 1);
  };

  const isTreeApproved = Boolean(workTreeDraft && workTreeDraft.isApproved);
  const draftBranches = workTreeDraft?.branches || [];

  // Total duration calculation
  const approvedTotalMin = draftBranches.reduce((s, b) => s + b.estimatedMin, 0);
  const totalArborMin = isTreeApproved ? 25 + 15 + approvedTotalMin : 80;

  // Selected branch in approved work tree
  const currentBranch: WorkTreeBranch | undefined =
    draftBranches[selectedBranchIdx] || draftBranches[0];

  // Particle sparkle specs
  const particles = [
    { x: 130, y: 150, r: 2.2, delay: 0.2 },
    { x: 220, y: 140, r: 2.5, delay: 0.5 },
    { x: 100, y: 90, r: 1.8, delay: 0.8 },
    { x: 250, y: 80, r: 2.0, delay: 1.0 },
    { x: 180, y: 60, r: 2.6, delay: 0.4 },
    { x: 150, y: 110, r: 1.9, delay: 0.9 },
  ];

  return (
    <div className="w-full flex flex-col gap-3 pb-8">
      {/* Top Routing & Stats Bar */}
      <div className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={() => onNavigate('persona-qna')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3ede1] text-[#47654d] hover:bg-[#ede8dc] text-[12px] font-semibold transition-all active:scale-95 shadow-2xs"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{language === 'vi' ? 'Hỏi đáp Q&A' : 'Q&A Chat'}</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f9f3e7] text-[#2e3b30] text-[12px] font-semibold border border-[#c4c8c1]/30 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#47654d]" />
          <span>
            {formatDuration(totalArborMin, language)} ({totalArborMin}m) {language === 'vi' ? 'tổng phiên' : 'total'}
          </span>
        </div>
      </div>

      {/* Sprouted Success Banner if newly approved */}
      {isTreeApproved && (
        <motion.div
          key={`sprout-banner-${sproutKey}`}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="bg-gradient-to-r from-[#c6e8c9]/90 via-[#f0f8f1] to-[#ffdad2]/75 p-3 rounded-2xl border border-[#47654d]/35 shadow-2xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="w-8 h-8 rounded-xl bg-[#47654d] text-white flex items-center justify-center shrink-0 shadow-2xs"
            >
              <Sprout className="w-5 h-5 text-[#c6e8c9]" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-bold text-[#1d1c14] truncate flex items-center gap-1.5">
                <span>{language === 'vi' ? 'Cây Việc Đã Nảy Mầm Từ Q&A!' : 'Work Tree Newly Sprouted!'}</span>
                <span className="text-[10px] bg-[#47654d] text-white px-1.5 py-0.2 rounded-full font-bold">
                  {draftBranches.length} {language === 'vi' ? 'nhánh (20-30p/nhánh)' : 'branches (20-30m each)'}
                </span>
              </span>
              <span className="text-[11px] text-[#434843] truncate">
                {getLocalizedText(workTreeDraft?.rootTaskTitle, language)} • {formatDuration(approvedTotalMin, language)} ({approvedTotalMin}m)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReplaySprout}
            className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-[#47654d] text-[11px] font-bold border border-[#47654d]/25 flex items-center gap-1 shadow-2xs shrink-0 active:scale-95 transition-all"
            title={language === 'vi' ? 'Xem lại hiệu ứng nảy mầm' : 'Replay sprouting animation'}
          >
            <RotateCcw className={`w-3 h-3 ${isSprouting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {language === 'vi' ? 'Nảy mầm lại' : 'Replay'}
            </span>
          </button>
        </motion.div>
      )}

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Column: Biometrics, Arbor Tree & Inspection, Visuals */}
        <div className="w-full lg:col-span-7 flex flex-col gap-3.5">
          {/* Smart Watch Biometrics Status Banner */}
      <div className="flex items-center justify-between bg-[#fbf7ee] px-3 py-2 rounded-xl border border-[#c4c8c1]/30 text-xs shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-[#2e3b30] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[14px]">watch</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-[#2e3b30] truncate">{biometrics.deviceName}</span>
            <span className="text-[#b34033] font-bold flex items-center gap-0.5">
              <Heart className="w-3 h-3 fill-current inline" />
              {biometrics.heartRate} bpm
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
                biometrics.stressLevel === 'high'
                  ? 'bg-[#ffdad2] text-[#823925]'
                  : biometrics.stressLevel === 'moderate'
                  ? 'bg-[#ede8dc] text-[#546255]'
                  : 'bg-[#c6e8c9] text-[#04210e]'
              }`}
            >
              Stress {biometrics.stressScore}/100
            </span>
          </div>
        </div>

        <span className="text-[10px] text-[#47654d] font-bold shrink-0 bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/20">
          {biometrics.stressLevel === 'low'
            ? language === 'vi'
              ? '🌿 Ưu tiên LMS & Brain Dump'
              : '🌿 Ready for Deep Focus'
            : language === 'vi'
            ? '🌤️ Nhịp độ vừa sức'
            : '🌤️ Moderate rhythm'}
        </span>
      </div>

      {/* Interactive Botanical Arbor Tree Card with Sprouting Animation */}
      <div className="rounded-2xl bg-[#f9f3e7] p-3.5 shadow-xs border border-[#c4c8c1]/30 flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#47654d] text-[18px]">
              potted_plant
            </span>
            <span className="text-[13px] font-bold text-[#2e3b30]">
              {isTreeApproved
                ? language === 'vi'
                  ? 'Cây Công Việc Đã Ươm Mầm'
                  : 'Approved Task Arbor'
                : language === 'vi'
                ? 'Cây phân loại nhiệm vụ'
                : 'Task Arbor Map'}
            </span>
          </div>

          {/* Legend & Sprout indicator */}
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-[#823925] bg-[#ffdad2]/70 px-2 py-0.5 rounded-full border border-[#d97d64]/20">
              <span className="w-2 h-2 rounded-full bg-[#d97d64]"></span>
              {language === 'vi' ? 'Brain Dump (Đã duyệt)' : 'Approved Draft'}
            </span>
            <span className="flex items-center gap-1 text-[#04210e] bg-[#c6e8c9]/50 px-2 py-0.5 rounded-full border border-[#47654d]/20">
              <span className="w-2 h-2 rounded-full bg-[#47654d]"></span>
              Canvas LMS
            </span>
          </div>
        </div>

        {/* Tree Vector Container with Motion Key */}
        <div className="relative w-full h-56 sm:h-64 lg:h-72 rounded-xl bg-gradient-to-b from-[#f3ede1] to-[#e8dfcf] flex items-center justify-center overflow-hidden border border-[#c4c8c1]/20 select-none">
          <svg
            key={`svg-tree-${sproutKey}`}
            className="w-full h-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px]"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 340 220"
          >
            <defs>
              <linearGradient id="trunkGrad" x1="0%" x2="0%" y1="100%" y2="0%">
                <stop offset="0%" stopColor="#2e3b30" />
                <stop offset="60%" stopColor="#455246" />
                <stop offset="100%" stopColor="#627565" />
              </linearGradient>

              <radialGradient id="soilGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c6e8c9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c6e8c9" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Soil / Root Base with Sprouting Pulse */}
            <motion.ellipse
              cx="170"
              cy="208"
              rx="55"
              ry="9"
              fill="#dcd4c3"
              initial={{ scaleX: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Glowing Sprout Aura around base */}
            <motion.circle
              cx="170"
              cy="206"
              r="22"
              fill="url(#soilGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: [0, 0.7, 0.3] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />

            {/* Soil Mound */}
            <motion.path
              d="M135 210 Q170 198 205 210"
              fill="none"
              stroke="#3a483c"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Animated Tree Trunk Growing Upward */}
            <motion.path
              d="M170 208 C170 175 171 142 170 112"
              fill="none"
              stroke="url(#trunkGrad)"
              strokeLinecap="round"
              strokeWidth="8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85, ease: 'easeInOut' }}
            />

            {/* Wood Grain Texture Accent */}
            <motion.path
              d="M169 198 C169 175 170 150 169 125"
              fill="none"
              stroke="#778c79"
              strokeLinecap="round"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            />

            {/* DYNAMIC BRANCHES FROM APPROVED WORK TREE DRAFT */}
            {draftBranches.length > 0 ? (
              draftBranches.map((branch, idx) => {
                // Coordinate positioning for 2, 3, or more branches
                let startX = 170;
                let startY = 145 - idx * 8;
                let targetX = 85;
                let targetY = 82;
                let ctrlX = 135;
                let ctrlY = 110;

                if (draftBranches.length === 2) {
                  if (idx === 0) {
                    targetX = 90;
                    targetY = 75;
                    ctrlX = 130;
                    ctrlY = 115;
                  } else {
                    targetX = 250;
                    targetY = 75;
                    ctrlX = 210;
                    ctrlY = 115;
                  }
                } else if (draftBranches.length >= 3) {
                  if (idx === 0) {
                    // Branch 1: Left
                    targetX = 75;
                    targetY = 90;
                    ctrlX = 120;
                    ctrlY = 125;
                  } else if (idx === 1) {
                    // Branch 2: Center Top (Core Execution)
                    startY = 125;
                    targetX = 170;
                    targetY = 38;
                    ctrlX = 170;
                    ctrlY = 75;
                  } else {
                    // Branch 3: Right
                    targetX = 265;
                    targetY = 90;
                    ctrlX = 220;
                    ctrlY = 125;
                  }
                }

                const isCompleted = (activeTask?.completedBranchIndices || []).includes(idx);
                const isCurrent = idx === (activeTask?.currentBranchIndex ?? 0);
                const isSelected = selectedBranchIdx === idx;

                const colorBg = isCompleted ? '#c6e8c9' : isCurrent ? '#ffdad2' : '#f3ede1';
                const colorPrimary = isCompleted ? '#47654d' : isCurrent ? '#d97d64' : '#747872';
                const iconChar = isCompleted ? '🌸' : isCurrent ? '🌱' : String(idx + 1);

                const pathD = `M${startX} ${startY} Q${ctrlX} ${ctrlY} ${targetX} ${targetY}`;

                return (
                  <g key={`branch-group-${branch.id}-${sproutKey}`}>
                    {/* Animated Sprouting Stem */}
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke={isCompleted ? '#47654d' : isCurrent ? '#d97d64' : '#546255'}
                      strokeWidth={isSelected ? '4.5' : '3.5'}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.75, delay: 0.5 + idx * 0.2, ease: 'easeOut' }}
                    />

                    {/* Sprouted Branch Leaves & Canopy Node */}
                    <motion.g
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedBranchIdx(idx);
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 18,
                        delay: 0.9 + idx * 0.25,
                      }}
                    >
                      {/* Active Ring Glow */}
                      {isSelected && (
                        <motion.circle
                          cx={targetX}
                          cy={targetY}
                          r="26"
                          fill="none"
                          stroke={isCurrent ? '#d97d64' : '#47654d'}
                          strokeWidth="2.2"
                          strokeDasharray="4 3"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
                        />
                      )}

                      {/* Leaf Canopy */}
                      <circle
                        cx={targetX}
                        cy={targetY}
                        fill={colorBg}
                        r={isSelected ? '24' : '19'}
                        opacity="0.95"
                      />
                      <circle cx={targetX} cy={targetY} fill={colorPrimary} r="12" />

                      {/* Icon */}
                      <text
                        textAnchor="middle"
                        x={targetX}
                        y={targetY + 4}
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {iconChar}
                      </text>

                      {/* Branch Label Badge */}
                      <text
                        textAnchor="middle"
                        x={targetX}
                        y={targetY + (targetY < 60 ? -16 : 28)}
                        fill={isCompleted ? '#2e3b30' : isCurrent ? '#823925' : '#434843'}
                        fontSize="9.5"
                        fontWeight="700"
                      >
                        {getLocalizedText(branch.title, language).split(':')[0] || `Nhánh ${idx + 1}`}
                      </text>
                      <text
                        textAnchor="middle"
                        x={targetX}
                        y={targetY + (targetY < 60 ? -6 : 39)}
                        fill="#546255"
                        fontSize="8.5"
                        fontWeight="bold"
                      >
                        ~{branch.estimatedMin}m {isCompleted ? '✓' : ''}
                      </text>
                    </motion.g>
                  </g>
                );
              })
            ) : null}

            {/* Shimmering Pollen & Leaf Sprout Particles */}
            {particles.map((p, i) => (
              <motion.circle
                key={`p-${i}-${sproutKey}`}
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill="#c6e8c9"
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [-5, -24],
                  scale: [0.6, 1.3, 0.4],
                }}
                transition={{
                  duration: 2.3,
                  delay: 1.3 + p.delay,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: 'easeOut',
                }}
              />
            ))}
          </svg>
        </div>

        {/* Sprouted Branch Leaf Inspector Card */}
        {isTreeApproved && currentBranch && (
          <div className="bg-white rounded-xl p-3 border border-[#c4c8c1]/35 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#d97d64] text-white text-[11px] font-bold flex items-center justify-center">
                  {currentBranch.phase}
                </span>
                <span className="text-[12.5px] font-bold text-[#1d1c14]">
                  {getLocalizedText(currentBranch.title, language)}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#823925] bg-[#ffdad2] px-2 py-0.5 rounded-full">
                ⏱️ ~{currentBranch.estimatedMin}m
              </span>
            </div>

            {/* Leaves in this branch */}
            <div className="pl-6 space-y-1.5 border-l-2 border-[#d97d64]/30 ml-2">
              {currentBranch.leaves.map((leaf, lIdx) => (
                <div
                  key={leaf.id}
                  className="flex items-center justify-between text-[11.5px] text-[#434843] bg-[#fcfaf5] px-2 py-1.5 rounded-lg border border-[#c4c8c1]/20"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#47654d]"></span>
                    <span className="truncate">{getLocalizedText(leaf.title, language)}</span>
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#747872] shrink-0 ml-2">
                    {leaf.durationMin}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visual Snippets */}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative h-20 rounded-xl overflow-hidden shadow-xs border border-[#c4c8c1]/30">
          <img src={IMAGES.stillLibrary} alt="Library" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2e3b30]/80 via-transparent to-transparent flex items-end p-2">
            <span className="text-[10px] text-white font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">local_library</span>
              {language === 'vi' ? 'Thư viện tĩnh' : 'Still Library'}
            </span>
          </div>
        </div>

        <div className="relative h-20 rounded-xl overflow-hidden shadow-xs border border-[#c4c8c1]/30">
          <img src={IMAGES.sproutSoil} alt="Sprout" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2e3b30]/80 via-transparent to-transparent flex items-end p-2">
            <span className="text-[10px] text-white font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">spa</span>
              {language === 'vi'
                ? `Mục tiêu: ${draftBranches.length || 3} Nhánh`
                : `Target: ${draftBranches.length || 3} Branches`}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Right Column: Energy Rhythm, Structured Workload & Primary CTA */}
    <div className="w-full lg:col-span-5 flex flex-col gap-3.5">
      {/* Energy Rhythm Selector */}
      <div className="rounded-xl bg-[#f3ede1] p-2.5 border border-[#c4c8c1]/30">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[12px] font-bold text-[#2e3b30] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#47654d]">routine</span>
            {language === 'vi' ? 'Khung năng lượng sinh học' : 'Bio-Energy Rhythm'}
          </span>
          <span className="text-[10px] font-semibold text-[#47654d] bg-white px-2 py-0.5 rounded-full">
            {energyRhythm === 'morning'
              ? language === 'vi'
                ? 'Tối ưu cho LMS & Deep Work'
                : 'Best for Deep Work'
              : energyRhythm === 'afternoon'
              ? language === 'vi'
                ? 'Hợp Brain Dump Wireframe'
                : 'Brain Dump flow'
              : language === 'vi'
              ? 'Thư thả'
              : 'Gentle'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setEnergyRhythm('morning')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
              energyRhythm === 'morning'
                ? 'bg-[#2e3b30] text-white shadow-xs font-semibold'
                : 'bg-white/80 text-[#434843] hover:bg-white'
            }`}
          >
            <span className="text-[16px]">☀️</span>
            <span className="text-[11px] leading-tight">
              {language === 'vi' ? 'Sáng' : 'Morning'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setEnergyRhythm('afternoon')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
              energyRhythm === 'afternoon'
                ? 'bg-[#2e3b30] text-white shadow-xs font-semibold'
                : 'bg-white/80 text-[#434843] hover:bg-white'
            }`}
          >
            <span className="text-[16px]">🌤️</span>
            <span className="text-[11px] leading-tight">
              {language === 'vi' ? 'Chiều' : 'Midday'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setEnergyRhythm('dusk')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
              energyRhythm === 'dusk'
                ? 'bg-[#2e3b30] text-white shadow-xs font-semibold'
                : 'bg-white/80 text-[#434843] hover:bg-white'
            }`}
          >
            <span className="text-[16px]">🌙</span>
            <span className="text-[11px] leading-tight">
              {language === 'vi' ? 'Tối' : 'Dusk'}
            </span>
          </button>
        </div>
      </div>

      {/* Structured Task & Branches List */}
      <div className="flex flex-col gap-3">
        {/* Active Task Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#c4c8c1]/40 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeTask?.source === 'lms' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c6e8c9] text-[#04210e] text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">school</span>
                  <span>Canvas LMS</span>
                  {activeTask.courseCode && (
                    <span className="bg-[#47654d] text-white px-1 py-0.2 rounded text-[9px]">
                      {activeTask.courseCode}
                    </span>
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdad2] text-[#823925] text-[10px] font-bold border border-[#ffb4a2]/50">
                  <span className="material-symbols-outlined text-[13px]">edit_note</span>
                  <span>{language === 'vi' ? 'Brain Dump Tự do' : 'Brain Dump'}</span>
                </span>
              )}

              {activeTask?.attachmentName && (
                <span className="text-[10px] text-[#47654d] bg-[#e8f3ea] px-2 py-0.5 rounded-full border border-[#c6e8c9]">
                  📎 {activeTask.attachmentName}
                </span>
              )}
            </div>

            <span className="text-[11px] font-bold text-[#2e3b30] bg-[#f3ede1] px-2.5 py-0.5 rounded-full border border-[#c4c8c1]/30">
              ⏱️ {formatDuration(approvedTotalMin, language)} ({approvedTotalMin}m)
            </span>
          </div>

          {/* 1-2 Hour Task Highlight */}
          {approvedTotalMin >= 60 && approvedTotalMin <= 120 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e8f3ea] border border-[#c6e8c9] text-[11px] text-[#1c3822]">
              <span className="material-symbols-outlined text-[15px] text-[#47654d]">call_split</span>
              <span className="font-semibold">
                {language === 'vi'
                  ? `Tác vụ 1-2 tiếng (${formatDetailedDuration(approvedTotalMin, 'vi')}) đã được chẻ thành ${draftBranches.length} nhánh nhỏ 20-30 phút để duy trì sự tập trung tĩnh lặng.`
                  : `1-2 hour task (${formatDetailedDuration(approvedTotalMin, 'en')}) split into ${draftBranches.length} calm 20-30m branches.`}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h3 className="text-[14px] font-bold text-[#2e3b30] leading-snug">
              {workTreeDraft
                ? getLocalizedText(workTreeDraft.rootTaskTitle, language)
                : activeTask
                ? getLocalizedText(activeTask.title, language)
                : 'Task'}
            </h3>
            <p className="text-[11.5px] text-[#546255] italic leading-relaxed">
              “{workTreeDraft
                ? getLocalizedText(workTreeDraft.userIntentSummary, language)
                : language === 'vi'
                ? 'Đã tối ưu hóa theo nhịp năng lượng của bạn'
                : 'Optimized for your energy rhythm'}”
            </p>
          </div>

          {/* Progress Bar */}
          {draftBranches.length > 0 && (
            <div className="pt-2 border-t border-[#c4c8c1]/20 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold">
                <span className="text-[#47654d] flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-[#47654d]" />
                  <span>
                    {language === 'vi'
                      ? `Tiến độ: ${(activeTask?.completedBranchIndices || []).length}/${draftBranches.length} nhánh đã nở hoa`
                      : `Progress: ${(activeTask?.completedBranchIndices || []).length}/${draftBranches.length} branches bloomed`}
                  </span>
                </span>
                <span className="text-[#2e3b30]">
                  {Math.round(
                    (((activeTask?.completedBranchIndices || []).length) /
                      (draftBranches.length || 1)) *
                      100
                  )}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#ede8dc] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#47654d] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      8,
                      Math.round(
                        (((activeTask?.completedBranchIndices || []).length) /
                          (draftBranches.length || 1)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Branch List */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-bold text-[#2e3b30] flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-[#47654d]" />
              <span>{language === 'vi' ? 'Các Nhánh Hành Động' : 'Action Branches'}</span>
            </span>
            <span className="text-[11px] text-[#747872]">
              {draftBranches.length} {language === 'vi' ? 'nhánh' : 'branches'}
            </span>
          </div>

          {draftBranches.map((branch, bIdx) => {
            const isCompleted = (activeTask?.completedBranchIndices || []).includes(bIdx);
            const isCurrent = bIdx === currentBranchIdx;
            const isSelected = bIdx === selectedBranchIdx;

            return (
              <div
                key={branch.id}
                onClick={() => setSelectedBranchIdx(bIdx)}
                className={`p-3 rounded-2xl transition-all cursor-pointer border flex flex-col gap-2 ${
                  isCurrent
                    ? 'bg-[#ffdad2]/35 border-[#d97d64] shadow-xs ring-1 ring-[#d97d64]/40'
                    : isCompleted
                    ? 'bg-[#c6e8c9]/30 border-[#47654d]/40'
                    : isSelected
                    ? 'bg-white border-[#2e3b30] shadow-xs'
                    : 'bg-white/80 border-[#c4c8c1]/30 hover:border-[#c4c8c1]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-[#47654d] text-white'
                          : isCurrent
                          ? 'bg-[#d97d64] text-white'
                          : 'bg-[#e8e2d6] text-[#2e3b30]'
                      }`}
                    >
                      {isCompleted ? '✓' : bIdx + 1}
                    </span>
                    <span className="text-[13px] font-bold text-[#2e3b30] truncate">
                      {getLocalizedText(branch.title, language)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-bold text-[#546255] bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/30 flex items-center gap-1 shadow-2xs">
                      <span>⏱️ {branch.estimatedMin}m</span>
                      {branch.estimatedMin >= 20 && branch.estimatedMin <= 30 && (
                        <span className="text-[9px] font-bold text-[#1c3822] bg-[#c6e8c9] px-1 py-0.2 rounded">
                          20-30p
                        </span>
                      )}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-[#04210e] bg-[#c6e8c9] px-2 py-0.5 rounded-full">
                        {language === 'vi' ? 'Đã xong' : 'Done'}
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[10px] font-bold text-[#823925] bg-[#ffdad2] px-2 py-0.5 rounded-full animate-pulse">
                        {language === 'vi' ? 'Đang làm' : 'Current'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#747872] bg-[#f3ede1] px-2 py-0.5 rounded-full">
                        {language === 'vi' ? 'Chờ' : 'Queued'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-actions (Leaves) breakdown when selected */}
                {isSelected && branch.leaves && branch.leaves.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-1 pt-2 border-t border-[#c4c8c1]/25 flex flex-col gap-1.5"
                  >
                    <span className="text-[10.5px] font-semibold text-[#546255] flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-[#47654d]" />
                      <span>{language === 'vi' ? 'Hành động vi mô (Lá việc):' : 'Micro-actions (Leaves):'}</span>
                    </span>
                    <div className="flex flex-col gap-1 pl-1">
                      {branch.leaves.map((leaf, lIdx) => (
                        <div
                          key={leaf.id || lIdx}
                          className="flex items-center justify-between text-[11px] py-0.5 px-1.5 rounded bg-[#fbf7ee] border border-[#c4c8c1]/20"
                        >
                          <span className="text-[#2e3b30] truncate pr-1">
                            • {getLocalizedText(leaf.title, language)}
                          </span>
                          <span className="text-[10px] text-[#747872] shrink-0 font-medium">
                            {leaf.durationMin}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Other Tasks Quick Switcher (if user has other tasks) */}
        {tasks.length > 1 && (
          <div className="mt-1 p-2 rounded-xl bg-[#ede8dc]/50 border border-[#c4c8c1]/30 flex flex-col gap-1.5">
            <span className="text-[10.5px] font-bold text-[#546255]">
              {language === 'vi' ? 'Chuyển sang tác vụ khác trong danh sách:' : 'Switch to another task:'}
            </span>
            <div className="flex flex-wrap gap-1">
              {tasks.map((t) => {
                const isThisActive = t.id === activeTask?.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (onSelectTask) {
                        onSelectTask(t);
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-[10.5px] font-medium transition-all truncate max-w-[180px] ${
                      isThisActive
                        ? 'bg-[#2e3b30] text-white shadow-xs'
                        : 'bg-white text-[#434843] hover:bg-[#c6e8c9]/40 border border-[#c4c8c1]/30'
                    }`}
                  >
                    {t.source === 'lms' ? '🎓 ' : '💡 '}
                    {getLocalizedText(t.title, language)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Primary CTA */}
        {activeTask &&
        (activeTask.completedBranchIndices || []).length >= draftBranches.length &&
        draftBranches.length > 0 ? (
          <button
            type="button"
            onClick={() => onNavigate('reflection-study-mirror')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#47654d] hover:bg-[#38513d] text-white text-[14.5px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#c6e8c9]" />
            <span>
              {language === 'vi'
                ? '🎉 Tất cả nhánh đã hoàn tất! Xem Soi Chiếu Gương'
                : '🎉 All Branches Bloomed! View Reflection Mirror'}
            </span>
            <ArrowRight className="w-4 h-4 text-[#c6e8c9]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('one-next-action-focus')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#2e3b30] hover:bg-[#455246] text-white text-[14.5px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#c6e8c9]">play_circle</span>
            <span>
              {currentBranchIdx > 0
                ? language === 'vi'
                  ? `Tiếp tục Nhánh ${currentBranchIdx + 1}/${draftBranches.length || 3}: ${getLocalizedText(currentBranch?.title, language).split(':')[0]}`
                  : `Continue Branch ${currentBranchIdx + 1}/${draftBranches.length || 3}`
                : language === 'vi'
                ? `Bắt đầu Nhánh 1: ${getLocalizedText(draftBranches[0]?.title, language).split(':')[0]}`
                : 'Begin First Action (Branch 1)'}
            </span>
            <ArrowRight className="w-4 h-4 text-[#c6e8c9]" />
          </button>
        )}

        {/* Secondary Buttons Row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onSaveAndReturnHome) {
                onSaveAndReturnHome();
              } else {
                onNavigate('dump-ambient-home');
              }
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-[#ede8dc] text-[#2e3b30] border border-[#c4c8c1]/40 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#47654d]" />
            <span>
              {language === 'vi' ? 'Lưu tiến trình & Về Trang chủ' : 'Save & Return Home'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('persona-qna')}
            className="py-2.5 px-3 rounded-xl bg-[#f3ede1] hover:bg-[#ede8dc] text-[#546255] border border-[#c4c8c1]/30 text-[12px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
            title={language === 'vi' ? 'Chỉnh sửa Cây với Mimi' : 'Re-tune Tree with Mimi'}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d97d64]" />
            <span>{language === 'vi' ? 'Q&A Cây' : 'Q&A'}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};
