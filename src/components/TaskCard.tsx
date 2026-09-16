import React from 'react';
import { Task, Language, getLocalizedText } from '../types';
import { formatDuration, formatDetailedDuration } from '../utils/formatters';
import {
  GraduationCap,
  Edit3,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Circle,
  BookOpen,
  PenTool,
  Paperclip,
  GitBranch,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  language: Language;
  onClick?: () => void;
  onResumeBranch?: (task: Task) => void;
  onOpenQnA?: (task: Task) => void;
  isActive?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  language,
  onClick,
  onResumeBranch,
  onOpenQnA,
  isActive = false,
}) => {
  const isLMS = task.source === 'lms';

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-2xl transition-all cursor-pointer border flex flex-col gap-2 ${
        isActive
          ? 'bg-[#c6e8c9]/45 border-[#47654d]/60 shadow-xs ring-1 ring-[#47654d]/40'
          : isLMS
          ? 'bg-[#ffffff] border-[#c4c8c1]/30 hover:border-[#47654d]/40 shadow-xs'
          : 'bg-[#fffaf4] border-[#d97d64]/30 hover:border-[#d97d64]/60 shadow-xs'
      }`}
    >
      {/* Top Origin & Category Tag Strip */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Distinct Source Badge */}
          {isLMS ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c6e8c9]/80 text-[#04210e] text-[10px] font-bold tracking-tight">
              <GraduationCap className="w-3 h-3 text-[#47654d]" />
              <span>Canvas LMS</span>
              {task.courseCode && (
                <span className="bg-[#47654d] text-white px-1 py-0.2 rounded text-[9px]">
                  {task.courseCode}
                </span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad2]/70 text-[#823925] text-[10px] font-bold tracking-tight border border-[#ffb4a2]/50">
              <Edit3 className="w-3 h-3 text-[#823925]" />
              <span>{language === 'vi' ? 'Brain Dump tự do' : 'Brain Dump'}</span>
            </span>
          )}

          {/* Category */}
          <span className="text-[10px] text-[#747872] bg-[#f3ede1] px-2 py-0.5 rounded-full">
            {task.category[language]}
          </span>

          {/* Document Attachment Tag if present */}
          {task.attachmentName && (
            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#2e3b30] bg-[#e8f3ea] border border-[#c6e8c9] px-1.5 py-0.5 rounded-full">
              <Paperclip className="w-2.5 h-2.5 text-[#47654d]" />
              <span className="truncate max-w-[120px]">{task.attachmentName}</span>
            </span>
          )}
        </div>

        {/* Duration */}
        <span className="text-[11px] font-bold text-[#47654d] bg-white px-2.5 py-0.5 rounded-full border border-[#c4c8c1]/30 shrink-0 shadow-2xs">
          ⏱️ {formatDuration(task.durationMin, language)}
          {task.durationMin >= 60 && (
            <span className="text-[10px] text-[#747872] font-semibold ml-1">
              ({task.durationMin}m)
            </span>
          )}
        </span>
      </div>

      {/* Special indicator for 1 to 2 hour tasks chunked into 20-30m sprints */}
      {task.durationMin >= 60 && task.durationMin <= 120 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#e8f3ea]/90 border border-[#c6e8c9] text-[10px] text-[#1c3822]">
          <GitBranch className="w-3.5 h-3.5 text-[#47654d] shrink-0" />
          <span className="font-semibold leading-tight">
            {language === 'vi'
              ? `Tác vụ 1-2h (${formatDetailedDuration(task.durationMin, 'vi')}) • Đã tách nhánh 20-30p chống quá tải`
              : `1-2h task (${formatDetailedDuration(task.durationMin, 'en')}) • Split into 20-30m sprints`}
          </span>
        </div>
      )}

      {/* Title & Description */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isLMS ? 'bg-[#c6e8c9]/50 text-[#47654d]' : 'bg-[#ffdad2]/50 text-[#823925]'
            }`}
          >
            {isLMS ? (
              <BookOpen className="w-4 h-4 text-[#47654d]" />
            ) : (
              <PenTool className="w-4 h-4 text-[#823925]" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-[13px] font-bold text-[#2e3b30] leading-snug">
              {task.title[language]}
            </h4>
            <p className="text-[11px] text-[#747872] line-clamp-1 mt-0.5">
              {task.description[language]}
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[#c4c8c1] shrink-0" />
      </div>

      {/* Meta Footer: Deadline or Dump Timestamp */}
      <div className="flex items-center justify-between pt-1 border-t border-[#c4c8c1]/20 text-[10px]">
        {isLMS ? (
          <span className="text-[#47654d] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#47654d]" />
            <span>
              {language === 'vi' ? 'Hạn nộp:' : 'Due:'}{' '}
              {getLocalizedText(task.deadline, language, '23:59')}
            </span>
          </span>
        ) : (
          <span className="text-[#823925] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d97d64]" />
            <span>
              {getLocalizedText(
                task.dumpOrigin,
                language,
                language === 'vi' ? 'Từ suy nghĩ tự do' : 'From mental stream'
              )}
            </span>
          </span>
        )}

        <span className="text-[#747872] font-medium flex items-center gap-1">
          {task.status === 'completed' ? (
            <span className="inline-flex items-center gap-1 text-[#2e3b30] font-bold bg-[#c6e8c9] px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-[#47654d]" />
              <span>{language === 'vi' ? 'Đã nở hoa (100%)' : 'Blossomed (100%)'}</span>
            </span>
          ) : task.workTree ? (
            <span className="inline-flex items-center gap-1 text-[#47654d] font-bold bg-[#e8f3ea] border border-[#c6e8c9] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#47654d] animate-pulse"></span>
              <span>
                {language === 'vi'
                  ? `Đang làm • Nhánh ${(task.currentBranchIndex || 0) + 1}/${task.workTree.branches.length}`
                  : `In progress • Branch ${(task.currentBranchIndex || 0) + 1}/${task.workTree.branches.length}`}
              </span>
            </span>
          ) : (
            <>
              <Circle className="w-2.5 h-2.5 text-[#747872]" />
              <span>{language === 'vi' ? 'Chưa tạo cây' : 'Queued'}</span>
            </>
          )}
        </span>
      </div>

      {/* Branch Sequence Pills */}
      {task.workTree && task.workTree.branches.length > 0 && (
        <div className="w-full flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-[#c4c8c1]/20">
          {task.workTree.branches.map((b, idx) => {
            const isDone = (task.completedBranchIndices || []).includes(idx);
            const isCurrent = idx === (task.currentBranchIndex || 0) && !isDone;
            return (
              <span
                key={b.id || idx}
                className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
                  isDone
                    ? 'bg-[#c6e8c9] text-[#04210e] font-bold'
                    : isCurrent
                    ? 'bg-[#ffdad2] text-[#823925] font-bold ring-1 ring-[#d97d64]/50'
                    : 'bg-[#ede8dc]/80 text-[#546255]'
                }`}
              >
                <span>{isDone ? '✓' : isCurrent ? '🌱' : idx + 1}.</span>
                <span className="truncate max-w-[120px]">
                  {getLocalizedText(b.title, language).split(':')[0]}
                </span>
                <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-white/70 text-[#2e3b30]">
                  ~{b.estimatedMin}m
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Progress Bar for In-Progress Tasks */}
      {task.workTree && task.workTree.branches.length > 0 && task.status !== 'completed' && (
        <div className="w-full pt-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-[#47654d] font-semibold">
            <span className="flex items-center gap-1">
              <span>🌱</span>
              <span>
                {language === 'vi'
                  ? `Đã nở: ${(task.completedBranchIndices || []).length}/${task.workTree.branches.length} nhánh`
                  : `Bloomed: ${(task.completedBranchIndices || []).length}/${task.workTree.branches.length} branches`}
              </span>
            </span>
            <span className="text-[10px] text-[#2e3b30] font-bold">
              {Math.round(((task.completedBranchIndices || []).length / task.workTree.branches.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#e8e2d6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#47654d] rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(
                  6,
                  Math.round(((task.completedBranchIndices || []).length / task.workTree.branches.length) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions Row */}
      <div className="flex items-center gap-2 pt-1">
        {task.status !== 'completed' && task.workTree && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onResumeBranch) {
                onResumeBranch(task);
              } else if (onClick) {
                onClick();
              }
            }}
            className="flex-1 py-1.5 px-3 rounded-lg bg-[#2e3b30] hover:bg-[#455246] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <span>▶</span>
            <span>
              {language === 'vi'
                ? `Vào Nhánh ${(task.currentBranchIndex || 0) + 1}/${task.workTree.branches.length}`
                : `Focus Branch ${(task.currentBranchIndex || 0) + 1}/${task.workTree.branches.length}`}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenQnA) {
              onOpenQnA(task);
            } else if (onClick) {
              onClick();
            }
          }}
          className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-[#ede8dc] text-[#546255] border border-[#c4c8c1]/40 text-[11px] font-medium flex items-center justify-center gap-1 transition-all active:scale-95"
          title={language === 'vi' ? 'Q&A tinh chỉnh Cây với Mimi' : 'Q&A Work Tree with Mimi'}
        >
          <Sparkles className="w-3 h-3 text-[#d97d64]" />
          <span>{language === 'vi' ? 'Q&A Cây' : 'Q&A'}</span>
        </button>
      </div>
    </div>
  );
};
