import React, { useState, useRef, useEffect } from 'react';
import { Task, Language, FocusChatMessage } from '../types';
import {
  generateGroundedAnswer,
  INITIAL_POPUP_QUESTIONS,
  getTaskKnowledgeKey,
} from '../data/focusKnowledge';
import {
  Bot,
  X,
  Send,
  Sparkles,
  BookOpen,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface FocusChatPopupProps {
  task: Task | undefined;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const FocusChatPopup: React.FC<FocusChatPopupProps> = ({
  task,
  language,
  isOpen,
  onClose,
}) => {
  const knowledgeKey = getTaskKnowledgeKey(task);
  const sampleQuestions =
    INITIAL_POPUP_QUESTIONS[knowledgeKey]?.[language] ||
    INITIAL_POPUP_QUESTIONS['PSYC101'][language];

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<FocusChatMessage[]>([
    {
      id: 'init-1',
      sender: 'mimi',
      text:
        language === 'vi'
          ? `Chào bạn! Mình là Mimi. Mình đã kết nối với tài nguyên Canvas LMS, ghi chép Brain Dump và tài liệu học tập của bạn. Bạn muốn tra cứu nhanh điều gì về tác vụ "${
              task?.title[language] || 'này'
            }"?`
          : `Hello! I'm Mimi. I am connected to your Canvas LMS syllabus, Brain Dump notes, and attachments. What would you like to verify about "${
              task?.title[language] || 'this task'
            }"?`,
      timestamp: 'Vừa xong',
      groundedSource: {
        vi: 'Kho dữ liệu Canvas LMS & Brain Dump của bạn',
        en: 'Connected to your Canvas LMS & Brain Dump data',
      },
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: FocusChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const response = generateGroundedAnswer(query, task, language);
      const aiMsg: FocusChatMessage = {
        id: `mimi-${Date.now()}`,
        sender: 'mimi',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedSource: response.source,
        suggestedFollowUps: response.followUps,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbf7ee] w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#c4c8c1]/40 flex flex-col max-h-[85vh] h-[580px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2e3b30] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#c6e8c9] text-[#04210e] flex items-center justify-center font-bold shrink-0">
              <Bot className="w-4 h-4 text-[#04210e]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[13px] truncate">
                  {language === 'vi' ? 'Trợ lý học tập Mimi' : 'Mimi Study Assistant'}
                </span>
                <span className="bg-[#c6e8c9] text-[#04210e] text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  Grounded AI
                </span>
              </div>
              <span className="text-[10px] text-[#c6e8c9]/90 truncate">
                {language === 'vi'
                  ? 'Tra cứu từ Canvas LMS & Brain Dump'
                  : 'Retrieving from Canvas LMS & Brain Dump'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            title={language === 'vi' ? 'Đóng cửa sổ chat' : 'Close chat'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Connected Sources Grounding Banner */}
        <div className="bg-[#e8f3ea] px-3.5 py-1.5 border-b border-[#c6e8c9] flex items-center gap-2 text-[11px] text-[#2e3b30] shrink-0 overflow-x-auto">
          <span className="font-bold text-[#47654d] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d97d64]" />
            {language === 'vi' ? 'Nguồn sẵn sàng:' : 'Connected:'}
          </span>
          <span className="bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/30 font-medium shrink-0 flex items-center gap-1 text-[10px]">
            <BookOpen className="w-2.5 h-2.5 text-[#47654d]" />
            Canvas LMS
          </span>
          <span className="bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/30 font-medium shrink-0 flex items-center gap-1 text-[10px]">
            <Paperclip className="w-2.5 h-2.5 text-[#823925]" />
            {task?.attachmentName || 'De_cuong_Tam_ly_hoc_Ch4.pdf'}
          </span>
          <span className="bg-white px-2 py-0.5 rounded-full border border-[#c4c8c1]/30 font-medium shrink-0 flex items-center gap-1 text-[10px]">
            💡 Brain Dump
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-[12px] leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2e3b30] text-white rounded-br-xs'
                    : 'bg-white text-[#2e3b30] border border-[#c4c8c1]/30 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Grounded Citation Badge */}
                {msg.groundedSource && (
                  <div className="mt-2 pt-1.5 border-t border-[#c4c8c1]/20 flex items-center gap-1 text-[10px] font-bold text-[#47654d]">
                    <CheckCircle2 className="w-3 h-3 text-[#47654d]" />
                    <span>
                      {language === 'vi' ? 'Căn cứ theo: ' : 'Grounded on: '}
                      {msg.groundedSource[language]}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-[#747872] px-1 mt-0.5">{msg.timestamp}</span>

              {/* Follow-up Question Chips if available */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {msg.suggestedFollowUps.map((fu, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(fu)}
                      className="text-[10px] bg-[#c6e8c9]/60 hover:bg-[#c6e8c9] text-[#04210e] font-medium px-2 py-1 rounded-full transition-all border border-[#47654d]/20 text-left"
                    >
                      {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="self-start flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border border-[#c4c8c1]/30 text-[11px] text-[#47654d]">
              <span className="w-2 h-2 rounded-full bg-[#47654d] animate-ping"></span>
              <span>
                {language === 'vi'
                  ? 'Mimi đang tra cứu LMS & Ghi chép...'
                  : 'Mimi is searching LMS & notes...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#f3ede1]/60 border-t border-[#c4c8c1]/20 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold text-[#747872] shrink-0">
            {language === 'vi' ? 'Hỏi nhanh:' : 'Quick:'}
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-white hover:bg-[#c6e8c9] text-[#2e3b30] px-2.5 py-1 rounded-full border border-[#c4c8c1]/30 whitespace-nowrap transition-all shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 bg-white border-t border-[#c4c8c1]/30 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Đặt câu hỏi về bài giảng, hạn nộp, đề cương...'
                : 'Ask about course modules, deadlines, notes...'
            }
            className="flex-1 bg-[#f9f3e7] text-[#2e3b30] text-[12px] px-3 py-2 rounded-xl border border-[#c4c8c1]/30 focus:outline-hidden focus:border-[#47654d] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="w-9 h-9 rounded-xl bg-[#2e3b30] hover:bg-[#47654d] disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
            title={language === 'vi' ? 'Gửi câu hỏi' : 'Send question'}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
