import React, { useState, useRef } from 'react';
import { ScreenId, Language, Task, SmartWatchBiometrics, AttachedDocument } from '../types';
import { IMAGES } from '../data/content';
import { SmartWatchWidget } from './SmartWatchWidget';
import { TaskCard } from './TaskCard';
import {
  Paperclip,
  FileText,
  Upload,
  X,
  Sparkles,
  Bot,
  Mic,
  Camera,
  Brain,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  FilePlus2,
  FileCheck2,
} from 'lucide-react';

interface DumpAmbientHomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  tasks: Task[];
  onAddTask: (
    newTask: string,
    attachmentName?: string,
    categoryText?: { en: string; vi: string }
  ) => void;
  onSelectTask?: (task: Task) => void;
  activeTaskId?: string | null;
  biometrics: SmartWatchBiometrics;
  onUpdateBiometrics: (bio: Partial<SmartWatchBiometrics>) => void;
}

const SAMPLE_DOCS = [
  {
    id: 'doc-psyc',
    name: 'De_cuong_Tam_ly_hoc_Ch4.pdf',
    sizeStr: '1.4 MB',
    type: 'pdf' as const,
    tasksFound: 2,
    previewExcerpt: {
      vi: 'Mục tiêu: Đọc Chương 4 - Lý thuyết mã hóa kép & trả lời 5 câu hỏi ôn tập trước 23:59',
      en: 'Goals: Read Chapter 4 - Dual-coding theory & answer 5 review questions before 23:59',
    },
    suggestedTask: {
      vi: 'Đọc & tóm tắt Đề cương Tâm lý học Ch.4',
      en: 'Read & summarize Psychology Ch.4 Syllabus',
    },
  },
  {
    id: 'doc-ger',
    name: 'German_Vocabulary_Unit3.docx',
    sizeStr: '850 KB',
    type: 'doc' as const,
    tasksFound: 1,
    previewExcerpt: {
      vi: 'Chủ đề: 18 cụm từ giao tiếp môi trường & ngữ pháp thì quá khứ Perfekt',
      en: 'Topic: 18 environmental dialogue phrases & Perfekt past tense grammar',
    },
    suggestedTask: {
      vi: 'Luyện tập Flashcards Tiếng Đức Unit 3',
      en: 'Practice German Unit 3 Flashcards',
    },
  },
  {
    id: 'doc-ux',
    name: 'Sprint_Backlog_Wireframes.md',
    sizeStr: '320 KB',
    type: 'text' as const,
    tasksFound: 2,
    previewExcerpt: {
      vi: 'Nhiệm vụ: Thiết kế giao diện thanh toán tối giản, giảm ma sát nhận thức cho người dùng',
      en: 'Task: Design low-friction checkout wireframes minimizing cognitive friction',
    },
    suggestedTask: {
      vi: 'Dựng Wireframe luồng thanh toán tối giản',
      en: 'Draft Minimalist Checkout Flow Wireframes',
    },
  },
];

export const DumpAmbientHomeScreen: React.FC<DumpAmbientHomeScreenProps> = ({
  onNavigate,
  language,
  tasks,
  onAddTask,
  onSelectTask,
  activeTaskId,
  biometrics,
  onUpdateBiometrics,
}) => {
  const [mindInput, setMindInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeMediaAlert, setActiveMediaAlert] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'lms' | 'brain_dump'>('all');

  // Document Attachment State for AI Reading
  const [attachedDoc, setAttachedDoc] = useState<AttachedDocument | null>(null);
  const [isAiAnalyzingDoc, setIsAiAnalyzingDoc] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDocPicker, setShowDocPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sampleStreams = {
    en: 'Review Human-Centered Design notes; write 2 user personas; organize botanical moodboard.',
    vi: 'Ôn tập môn Thiết kế lấy người dùng làm trung tâm; lập 2 chân dung persona; gom ảnh moodboard.',
  };

  const handleInsertSample = () => {
    setMindInput(sampleStreams[language]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let docType: 'pdf' | 'doc' | 'text' | 'image' = 'doc';
    if (ext === 'pdf') docType = 'pdf';
    else if (['txt', 'md', 'rtf'].includes(ext)) docType = 'text';
    else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) docType = 'image';

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeInMB} MB`;

    setIsAiAnalyzingDoc(true);
    setAttachedDoc({
      id: `doc-${Date.now()}`,
      name: file.name,
      sizeStr,
      type: docType,
      previewExcerpt: {
        vi: `AI đã đọc "${file.name}": Trích xuất được các mục tiêu hành động & tóm tắt trọng tâm.`,
        en: `AI read "${file.name}": Extracted key action items and contextual summary.`,
      },
      tasksFound: 2,
    });

    const alertText =
      language === 'vi'
        ? `📄 Đã đính kèm ${file.name}. AI đang đọc tài liệu...`
        : `📄 Attached ${file.name}. AI is reading document...`;
    setActiveMediaAlert(alertText);

    setTimeout(() => {
      setIsAiAnalyzingDoc(false);
      setActiveMediaAlert(
        language === 'vi'
          ? `✨ AI đã phân tích xong "${file.name}"!`
          : `✨ AI finished analyzing "${file.name}"!`
      );
      setTimeout(() => setActiveMediaAlert(null), 3000);
    }, 600);
  };

  const handleAttachSampleDoc = (sample: typeof SAMPLE_DOCS[0]) => {
    setIsAiAnalyzingDoc(true);
    setAttachedDoc({
      id: sample.id,
      name: sample.name,
      sizeStr: sample.sizeStr,
      type: sample.type,
      previewExcerpt: sample.previewExcerpt,
      tasksFound: sample.tasksFound,
    });
    setShowDocPicker(false);

    if (!mindInput.trim()) {
      setMindInput(sample.suggestedTask[language]);
    }

    setTimeout(() => {
      setIsAiAnalyzingDoc(false);
      setActiveMediaAlert(
        language === 'vi'
          ? `✨ AI đã phân tích tài liệu mẫu: ${sample.name}`
          : `✨ AI parsed sample document: ${sample.name}`
      );
      setTimeout(() => setActiveMediaAlert(null), 3000);
    }, 450);
  };

  const handleRemoveAttachment = () => {
    setAttachedDoc(null);
    setIsAiAnalyzingDoc(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleExtractTasks = () => {
    const textToAdd =
      mindInput.trim() ||
      (attachedDoc
        ? language === 'vi'
          ? `Nghiên cứu tài liệu: ${attachedDoc.name}`
          : `Study document: ${attachedDoc.name}`
        : '');

    if (textToAdd) {
      onAddTask(
        textToAdd,
        attachedDoc?.name,
        attachedDoc
          ? {
              vi: 'Tài liệu học tập',
              en: 'Document Study',
            }
          : undefined
      );
      setMindInput('');
      setAttachedDoc(null);
    } else if (onSelectTask && tasks.length > 0) {
      onSelectTask(tasks[0]);
      return;
    }

    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      onNavigate('persona-qna');
    }, 350);
  };

  const handleQuickMedia = (type: string, icon: string) => {
    const msg =
      language === 'vi'
        ? `${icon} Đã ghi nhận ${type} vào dòng nhận thức`
        : `${icon} ${type} captured into your stream`;
    setActiveMediaAlert(msg);
    setTimeout(() => setActiveMediaAlert(null), 2500);
  };

  const filteredTasks = tasks.filter((task) => {
    if (sourceFilter === 'all') return true;
    return task.source === sourceFilter;
  });

  const lmsCount = tasks.filter((t) => t.source === 'lms').length;
  const brainDumpCount = tasks.filter((t) => t.source === 'brain_dump').length;

  return (
    <div className="w-full flex flex-col gap-3.5 pb-6">
      {/* Hidden File Input for Document Attachment */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.md,.rtf,image/*,.pptx"
        className="hidden"
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Column: Biometrics, Sync status, Mind Dump & Doc Reader */}
        <div className="w-full lg:col-span-5 flex flex-col gap-3.5">
          {/* Smart Watch Biometric Monitoring & Adaptive Mimi Guidance */}
      <SmartWatchWidget
        language={language}
        biometrics={biometrics}
        onUpdateBiometrics={onUpdateBiometrics}
        onNavigate={onNavigate}
      />

      {/* Sync Status Pill: Canvas LMS Connection */}
      <div className="flex items-center justify-between bg-[#f9f3e7] px-3.5 py-2 rounded-xl border border-[#c4c8c1]/30 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47654d] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#47654d]"></span>
          </span>
          <span className="material-symbols-outlined text-[#47654d] text-[16px] shrink-0">school</span>
          <span className="font-semibold text-[#2e3b30] truncate">
            {language === 'vi'
              ? `Canvas LMS: ${lmsCount} bài tập đồng bộ`
              : `Canvas LMS: ${lmsCount} tasks synced`}
          </span>
        </div>
        <button
          onClick={() => handleQuickMedia('Canvas LMS', '🎓')}
          className="flex items-center gap-1 text-[11px] font-bold text-[#47654d] bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/20 active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[13px]">sync</span>
          <span>{language === 'vi' ? 'Đồng bộ' : 'Sync'}</span>
        </button>
      </div>

      {/* Toast Alert */}
      {activeMediaAlert && (
        <div className="px-3 py-1.5 rounded-lg bg-[#c6e8c9] text-[#04210e] text-[12px] font-medium flex items-center gap-1.5 shadow-xs transition-all">
          <span>{activeMediaAlert}</span>
        </div>
      )}

      {/* Sanctuary Vessel (Mind Dump & Document Reader Input) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl bg-[#ffffff] p-3.5 shadow-xs border transition-all flex flex-col gap-2.5 ${
          isDragging
            ? 'border-dashed border-2 border-[#47654d] bg-[#c6e8c9]/20'
            : 'border-[#c4c8c1]/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#2e3b30] font-semibold text-[14px]">
            <span className="material-symbols-outlined text-[#d97d64] text-[18px]">edit_note</span>
            <span>{language === 'vi' ? 'Brain Dump: Trút bỏ suy nghĩ' : 'Brain Dump: Release thoughts'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowDocPicker(!showDocPicker)}
              type="button"
              className="flex items-center gap-1 text-[11px] font-semibold text-[#47654d] bg-[#f3ede1] hover:bg-[#c6e8c9] px-2 py-0.5 rounded-full transition-all"
              title={language === 'vi' ? 'Chọn tài liệu mẫu để AI đọc' : 'Select sample document for AI'}
            >
              <FileCheck2 className="w-3 h-3 text-[#47654d]" />
              <span>{language === 'vi' ? 'Tài liệu mẫu' : 'Sample Docs'}</span>
            </button>

            <button
              onClick={handleInsertSample}
              type="button"
              className="flex items-center gap-1 text-[11px] font-semibold text-[#47654d] bg-[#f3ede1] hover:bg-[#c6e8c9] px-2 py-0.5 rounded-full transition-all"
              title="Thử dòng gợi ý mẫu"
            >
              <span className="material-symbols-outlined text-[13px]">lightbulb</span>
              <span>{language === 'vi' ? 'Gợi ý' : 'Sample'}</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Document Picker Dropdown */}
        {showDocPicker && (
          <div className="p-2.5 bg-[#fbf7ee] rounded-xl border border-[#c4c8c1]/30 flex flex-col gap-1.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[#747872] text-[11px] font-medium pb-1 border-b border-[#c4c8c1]/20">
              <span className="flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-[#47654d]" />
                {language === 'vi' ? 'Chọn tài liệu để Mimi đọc & trích xuất:' : 'Choose a doc for Mimi to read:'}
              </span>
              <button onClick={() => setShowDocPicker(false)} className="text-[#747872] hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {SAMPLE_DOCS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleAttachSampleDoc(doc)}
                  className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-[#e8f3ea] text-left transition-all border border-[#c4c8c1]/20 text-[12px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ffdad2] text-[#823925]">
                      {doc.type.toUpperCase()}
                    </span>
                    <span className="font-semibold text-[#2e3b30]">{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-[#747872]">{doc.sizeStr}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Textarea */}
        <div className="relative rounded-xl bg-[#f9f3e7] p-2.5 transition-all border border-[#c4c8c1]/20 focus-within:border-[#47654d] focus-within:bg-[#ffffff]">
          <textarea
            className="w-full bg-transparent border-0 resize-none outline-none text-[14px] text-[#1d1c14] placeholder:text-[#434843]/45 leading-relaxed"
            rows={2}
            value={mindInput}
            onChange={(e) => setMindInput(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Ghi lại ý nghĩ tự do hoặc đính kèm tài liệu để AI đọc...'
                : 'Dump thoughts or attach documents for AI reading...'
            }
          />

          {/* Attached Document Card (When a doc is attached) */}
          {attachedDoc && (
            <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#47654d]/30 shadow-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#c6e8c9] text-[#47654d] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-[#2e3b30] truncate">
                      {attachedDoc.name}
                    </span>
                    <span className="text-[10px] text-[#747872]">
                      {attachedDoc.sizeStr} • {language === 'vi' ? 'Tài liệu học tập' : 'Study material'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="w-6 h-6 rounded-full hover:bg-[#ede8dc] text-[#747872] flex items-center justify-center transition-all"
                  title={language === 'vi' ? 'Hủy đính kèm' : 'Remove attachment'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* AI Reading Insight / Status */}
              <div className="flex items-start gap-1.5 pt-1.5 border-t border-[#c4c8c1]/20 text-[11px]">
                {isAiAnalyzingDoc ? (
                  <div className="flex items-center gap-1.5 text-[#47654d] font-semibold py-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#47654d] animate-ping"></span>
                    <span>
                      {language === 'vi'
                        ? 'Mimi đang đọc và trích xuất tài liệu...'
                        : 'Mimi is reading and parsing document...'}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5 text-[#2e3b30]">
                    <div className="flex items-center gap-1 text-[#47654d] font-bold">
                      <Sparkles className="w-3 h-3 text-[#d97d64]" />
                      <span>
                        {language === 'vi'
                          ? 'AI đã đọc xong tài liệu & sẵn sàng trích xuất tác vụ:'
                          : 'AI successfully read document & ready to extract tasks:'}
                      </span>
                    </div>
                    {attachedDoc.previewExcerpt && (
                      <p className="text-[10px] text-[#555b55] italic bg-[#f9f3e7] p-1.5 rounded-md">
                        {attachedDoc.previewExcerpt[language]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Media & Attachment Tools Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#c4c8c1]/20 mt-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Main Document Attachment Button for AI Reading */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-xs active:scale-95 border ${
                  attachedDoc
                    ? 'bg-[#c6e8c9] text-[#04210e] border-[#47654d]/40'
                    : 'bg-white hover:bg-[#ede8dc] text-[#47654d] border-[#c4c8c1]/40'
                }`}
                title={language === 'vi' ? 'Tải tệp PDF, DOCX, TXT để AI đọc' : 'Upload PDF, DOCX, TXT for AI'}
              >
                <Paperclip className="w-3.5 h-3.5 text-[#47654d]" />
                <span>
                  {attachedDoc
                    ? language === 'vi' ? 'Đã đính kèm' : 'Attached'
                    : language === 'vi' ? 'Đính kèm tài liệu' : 'Attach Document'}
                </span>
              </button>

              {/* Quick Voice Dump */}
              <button
                type="button"
                onClick={() => handleQuickMedia('Voice', '🎙️')}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#ede8dc] text-[#823925] border border-[#c4c8c1]/30 flex items-center justify-center transition-all shadow-xs active:scale-95"
                title={language === 'vi' ? 'Thu âm giọng nói' : 'Voice dump'}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* Scan Note Camera */}
              <button
                type="button"
                onClick={() => handleQuickMedia('Scan', '📷')}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#ede8dc] text-[#47654d] border border-[#c4c8c1]/30 flex items-center justify-center transition-all shadow-xs active:scale-95"
                title={language === 'vi' ? 'Quét trang sách/ghi chú' : 'Scan book/notes'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Mind flow */}
              <button
                type="button"
                onClick={() => handleQuickMedia('Audio', '🎵')}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#ede8dc] text-[#2e3b30] border border-[#c4c8c1]/30 flex items-center justify-center transition-all shadow-xs active:scale-95"
                title={language === 'vi' ? 'Ghi âm suy nghĩ' : 'Audio memo'}
              >
                <Brain className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[10px] font-bold text-[#823925] bg-[#ffdad2]/70 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <span>💡</span>
              {language === 'vi' ? 'Nguồn: Brain Dump' : 'Source: Brain Dump'}
            </span>
          </div>
        </div>

        {/* Primary CTA: Extract Tasks / Read Document */}
        <button
          onClick={handleExtractTasks}
          disabled={isExtracting}
          className="w-full py-3 px-4 rounded-xl bg-[#2e3b30] hover:bg-[#455246] text-[#ffffff] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
        >
          <Bot className="w-4 h-4 text-[#c6e8c9]" />
          <span>
            {isExtracting
              ? language === 'vi'
                ? 'Đang phân loại cùng Mimi...'
                : 'Sorting with Mimi...'
              : attachedDoc
              ? language === 'vi'
                ? 'AI Đọc tài liệu & Trích xuất tác vụ'
                : 'AI Read Document & Extract Tasks'
              : language === 'vi'
              ? 'Trích xuất tác vụ'
              : 'Extract Tasks'}
          </span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>

    {/* Right Column: Origin Filter Tabs & Task List Header */}
    <div className="w-full lg:col-span-7 flex flex-col gap-2 pt-1 lg:pt-0">
      <div className="flex items-center justify-between px-1">
          <span className="text-[13px] font-bold text-[#2e3b30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#47654d]">checklist</span>
            <span>{language === 'vi' ? 'Danh sách công việc' : 'Task Stream'}</span>
          </span>

          <span className="text-[11px] text-[#747872]">
            {filteredTasks.length} {language === 'vi' ? 'nhiệm vụ' : 'tasks'}
          </span>
        </div>

        {/* Filter Chips by Origin */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 active:scale-95 ${
              sourceFilter === 'all'
                ? 'bg-[#2e3b30] text-white shadow-xs'
                : 'bg-[#ede8dc] text-[#434843] hover:bg-white'
            }`}
          >
            {language === 'vi' ? 'Tất cả' : 'All'} ({tasks.length})
          </button>

          <button
            onClick={() => setSourceFilter('lms')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 active:scale-95 ${
              sourceFilter === 'lms'
                ? 'bg-[#47654d] text-white shadow-xs'
                : 'bg-[#c6e8c9]/60 text-[#04210e] hover:bg-[#c6e8c9]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">school</span>
            <span>Canvas LMS</span> ({lmsCount})
          </button>

          <button
            onClick={() => setSourceFilter('brain_dump')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 active:scale-95 ${
              sourceFilter === 'brain_dump'
                ? 'bg-[#823925] text-white shadow-xs'
                : 'bg-[#ffdad2]/70 text-[#823925] hover:bg-[#ffdad2]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">edit_note</span>
            <span>Brain Dump</span> ({brainDumpCount})
          </button>
        </div>

        {/* Task Cards List with clear origins */}
        <div className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              language={language}
              isActive={task.id === activeTaskId}
              onClick={() => {
                if (onSelectTask) {
                  onSelectTask(task);
                }
                if (task.workTree && task.workTree.branches && task.workTree.branches.length > 0) {
                  onNavigate('workload-overview');
                } else {
                  onNavigate('persona-qna');
                }
              }}
              onResumeBranch={(t) => {
                if (onSelectTask) {
                  onSelectTask(t);
                }
                onNavigate('workload-overview');
              }}
              onOpenQnA={(t) => {
                if (onSelectTask) {
                  onSelectTask(t);
                }
                onNavigate('persona-qna');
              }}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};
