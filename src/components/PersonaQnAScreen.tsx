import React, { useState, useEffect, useRef } from 'react';
import {
  ScreenId,
  Language,
  Task,
  SmartWatchBiometrics,
  WorkTreeDraft,
  WorkTreeBranch,
  WorkTreeLeaf,
  getLocalizedText,
} from '../types';
import { createInitialWorkTreeDraft } from '../data/workTreeGenerator';
import {
  Send,
  Bot,
  User,
  Heart,
  Watch,
  FolderTree,
  CheckCircle2,
  Sliders,
  Scissors,
  Leaf,
  Zap,
  RotateCcw,
  ArrowRight,
  Clock,
  Sparkles,
  Edit3,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'mimi' | 'user';
  text?: string;
  time: string;
  // Type of special payload
  type?: 'text' | 'intent_prompt' | 'state_prompt' | 'work_tree_draft' | 'approved_card';
  draftPayload?: WorkTreeDraft;
  quickReplies?: {
    id: string;
    label: string;
    action: () => void;
  }[];
}

interface PersonaQnAScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  tasks?: Task[];
  activeTask?: Task;
  biometrics?: SmartWatchBiometrics;
  workTreeDraft?: WorkTreeDraft | null;
  onSaveWorkTreeDraft?: (draft: WorkTreeDraft) => void;
}

export const PersonaQnAScreen: React.FC<PersonaQnAScreenProps> = ({
  onNavigate,
  language,
  tasks = [],
  activeTask,
  biometrics = {
    connected: true,
    deviceName: 'Apple Watch Series 9',
    heartRate: 72,
    stressScore: 28,
    stressLevel: 'low',
    battery: 88,
    lastSync: 'Vừa xong',
  },
  workTreeDraft: initialSavedDraft,
  onSaveWorkTreeDraft,
}) => {
  // Target task (prefer activeTask passed from App.tsx)
  const brainDumpTasks = tasks.filter((t) => t.source === 'brain_dump');
  const [selectedTaskId] = useState<string>(() => {
    if (activeTask) return activeTask.id;
    if (brainDumpTasks.length > 0) return brainDumpTasks[0].id;
    if (tasks.length > 0) return tasks[0].id;
    return 'default-task';
  });

  const currentTask =
    activeTask ||
    tasks.find((t) => t.id === selectedTaskId) ||
    brainDumpTasks[0] ||
    tasks[0] || {
      id: 'default-task',
      title: {
        vi: 'Thiết kế Wireframe Luồng Checkout Tối giản',
        en: 'Minimalist Mobile Checkout Wireframing',
      },
      durationMin: 35,
      category: { vi: 'Ý tưởng tự do', en: 'Brain Dump Idea' },
      source: 'brain_dump' as const,
      description: {
        vi: 'Ghi chép tự do từ lúc 08:30: tránh bắt khách gõ nhiều thông tin trên điện thoại.',
        en: 'Freeform notes from 08:30: avoid tedious mobile checkout forms.',
      },
      status: 'pending' as const,
    };

  // Work Tree State
  const [currentDraft, setCurrentDraft] = useState<WorkTreeDraft>(() => {
    if (initialSavedDraft) return initialSavedDraft;
    return createInitialWorkTreeDraft(currentTask, 'medium', 35, 'mvp');
  });

  // Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState<
    'intent' | 'survey' | 'draft_review' | 'approved'
  >('intent');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial greeting from Mimi to clarify intent for the current task
  useEffect(() => {
    const draft = initialSavedDraft || createInitialWorkTreeDraft(currentTask, 'medium', 35, 'mvp');
    setCurrentDraft(draft);
    setConversationStep('intent');

    const taskName = getLocalizedText(currentTask.title, language);
    const taskDesc = getLocalizedText(currentTask.description, language);

    const initialMimiMsg: ChatMessage = {
      id: `msg-init-${currentTask.id}-${Date.now()}`,
      sender: 'mimi',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text:
        language === 'vi'
          ? `Chào bạn! Mình thấy bạn đang chuẩn bị cho tác vụ: "${taskName}".${
              taskDesc ? ` ("${taskDesc}")` : ''
            }\n\nĐể phiên làm việc không bị quá tải hay lan man, mục đích trọng tâm nhất bạn muốn đạt được sau buổi này là gì?`
          : `Hello! I noticed you are focusing on: "${taskName}".\n\nTo ensure this session stays manageable and crisp, what is the single most important intent or concrete outcome you want to achieve?`,
      type: 'intent_prompt',
      quickReplies: [
        {
          id: 'intent-mvp',
          label: language === 'vi' ? '🎯 Bản phác thảo MVP (Gọn gàng, cốt lõi)' : '🎯 MVP Prototype (Clean, core output)',
          action: () => handleSelectIntent('mvp', language === 'vi' ? 'Bản phác thảo MVP (Gọn gàng, cốt lõi)' : 'MVP Prototype (Clean, core output)'),
        },
        {
          id: 'intent-deep',
          label: language === 'vi' ? '🚀 Hoàn thiện trọn vẹn từng bước' : '🚀 Full step-by-step completion',
          action: () => handleSelectIntent('deep', language === 'vi' ? 'Hoàn thiện trọn vẹn từng bước' : 'Full step-by-step completion'),
        },
        {
          id: 'intent-unblock',
          label: language === 'vi' ? '🔍 Gỡ rối & Khởi động nhanh' : '🔍 Clarify & Quick launch',
          action: () => handleSelectIntent('unblock', language === 'vi' ? 'Gỡ rối & Khởi động nhanh' : 'Clarify & Quick launch'),
        },
      ],
    };

    setMessages([initialMimiMsg]);
  }, [currentTask.id, language]);

  // Step 1 -> Step 2: Handle Clarified Intent
  const handleSelectIntent = (intentType: 'mvp' | 'deep' | 'unblock', userReplyText: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userReplyText,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Update draft intent
    const summaryVi =
      intentType === 'mvp'
        ? 'Phác thảo 3 màn hình cốt lõi (MVP) mà không sa đà chi tiết.'
        : intentType === 'deep'
        ? 'Hoàn thiện trọn vẹn toàn bộ luồng với đầy đủ trường hợp ngoại lệ.'
        : 'Gỡ rối và định hình rõ nguyên lý cốt lõi trước khi thực thi.';
    const summaryEn =
      intentType === 'mvp'
        ? 'Sketch 3 core screens (MVP) without visual distraction.'
        : intentType === 'deep'
        ? 'Build comprehensive end-to-end flow.'
        : 'Clarify mental model and core interaction principles.';

    setCurrentDraft((prev) => ({
      ...prev,
      userIntentSummary: { vi: summaryVi, en: summaryEn },
    }));

    setTimeout(() => {
      setIsTyping(false);
      setConversationStep('survey');

      // Mimi surveys current biological state & time
      const surveyMsg: ChatMessage = {
        id: `msg-survey-${Date.now()}`,
        sender: 'mimi',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text:
          language === 'vi'
            ? `Tuyệt, mình đã khóa ý định trọng tâm này lại! 🌿\n\nDữ liệu từ Apple Watch cho thấy nhịp tim bạn đang ở mức ${biometrics.heartRate} bpm rất ổn định. Năng lượng và thời gian bạn có thể dành ra ngay lúc này thế nào?`
            : `Got it, locked in this target outcome! 🌿\n\nApple Watch biometrics show your heart rate is at ${biometrics.heartRate} bpm (rested). How is your energy level and available time right now?`,
        type: 'state_prompt',
        quickReplies: [
          {
            id: 'state-deep',
            label: language === 'vi' ? '🌳 Tác vụ sâu 1-2h (~80p) • Tách nhánh 20-30p' : '🌳 Deep 1-2h task (~80m) • 20-30m branches',
            action: () => handleSelectState('high', 80, language === 'vi' ? 'Dự án dài 1-2 tiếng (~80 phút), nhờ Mimi chia thành các nhánh 20-30 phút không ngợp' : 'Deep 1-2h project (~80m), split into 20-30m branches'),
          },
          {
            id: 'state-high',
            label: language === 'vi' ? '⚡ Năng lượng tốt • ~35 phút' : '⚡ High Energy • ~35 mins',
            action: () => handleSelectState('high', 35, language === 'vi' ? 'Năng lượng dồi dào, có 35 phút tập trung' : 'High energy, ready for 35 mins'),
          },
          {
            id: 'state-med',
            label: language === 'vi' ? '🌿 Ổn định, vừa sức • ~25 phút' : '🌿 Steady Pace • ~25 mins',
            action: () => handleSelectState('medium', 25, language === 'vi' ? 'Nhịp độ vừa sức, khoảng 25 phút' : 'Moderate pace, around 25 mins'),
          },
          {
            id: 'state-low',
            label: language === 'vi' ? '🍵 Hơi mệt, làm nhẹ thôi • ~15 phút' : '🍵 Low Stamina • ~15 mins micro-sprint',
            action: () => handleSelectState('low', 15, language === 'vi' ? 'Hơi thiếu cảm hứng, chỉ làm nhẹ 15 phút' : 'Slight fatigue, keep it to 15 mins'),
          },
        ],
      };

      setMessages((prev) => [...prev, surveyMsg]);
    }, 700);
  };

  // Step 2 -> Step 3: Handle Survey & Output Work Tree Draft
  const handleSelectState = (
    energy: 'high' | 'medium' | 'low',
    availableMins: number,
    userReplyText: string
  ) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userReplyText,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Build the specific draft based on survey & intent
    const generatedDraft = createInitialWorkTreeDraft(
      currentTask,
      energy,
      availableMins,
      currentDraft.userIntentSummary.vi.includes('MVP') ? 'mvp' : 'deep'
    );

    // If availableMins is short (15m), prune down
    if (availableMins <= 20) {
      generatedDraft.branches = generatedDraft.branches.map((b) => ({
        ...b,
        estimatedMin: Math.max(4, Math.round(b.estimatedMin * 0.6)),
        leaves: b.leaves.slice(0, 1),
      }));
    }

    setCurrentDraft(generatedDraft);

    setTimeout(() => {
      setIsTyping(false);
      setConversationStep('draft_review');

      const draftMsg: ChatMessage = {
        id: `msg-draft-${Date.now()}`,
        sender: 'mimi',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text:
          language === 'vi'
            ? `Dựa trên ý định và năng lượng của bạn, mình đã phác thảo **Cây Công Việc Dự Thảo (Work Tree Draft)** bên dưới.\n\nBạn hãy xem thử: Bạn có thể bấm **Duyệt Cây** để bắt đầu ngay, chọn nút chỉnh nhanh, hoặc gõ tin nhắn để yêu cầu mình thêm/bớt/sửa các nhánh nhé!`
            : `Synthesizing your intent and energy, here is your **Work Tree Draft** below.\n\nReview it: You can tap **Approve Tree** to dive in, use quick-revise buttons, or type any changes into the chat!`,
        type: 'work_tree_draft',
        draftPayload: generatedDraft,
      };

      setMessages((prev) => [...prev, draftMsg]);
    }, 900);
  };

  // Revise Presets inside chat
  const handleApplyPreset = (preset: 'shorten' | 'break_first' | 'expand' | 'branch_20_30') => {
    setIsTyping(true);
    let userText = '';
    let updatedDraft: WorkTreeDraft = { ...currentDraft };

    if (preset === 'branch_20_30') {
      userText =
        language === 'vi'
          ? '🌳 Tách thành các nhánh 20-30 phút (cho tác vụ 1-2 tiếng)'
          : '🌳 Split into 20-30m branches (for 1-2h deep work)';
      updatedDraft.branches = [
        {
          id: 'branch-1',
          phase: 1,
          title: {
            vi: 'Nhánh 1: Tinh lọc kiến trúc & Khung sườn (Framing)',
            en: 'Branch 1: Architecture Flow & Framing',
          },
          estimatedMin: 25,
          energyRequired: 'low',
          leaves: [
            {
              id: 'leaf-1-1',
              title: {
                vi: 'Xem lại ghi chép Brain Dump & xác định rào cản thao tác',
                en: 'Audit Brain Dump notes & identify core friction',
              },
              durationMin: 10,
              completed: false,
            },
            {
              id: 'leaf-1-2',
              title: {
                vi: 'Phác thảo luồng trạng thái 1-Click & Chế độ khách',
                en: 'Map 1-Click Express Pay & Guest mode pathway',
              },
              durationMin: 15,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-2',
          phase: 2,
          title: {
            vi: 'Nhánh 2: Sprint phác thảo Crazy Eights & Wireframe chi tiết',
            en: 'Branch 2: Crazy Eights Sprint & Detailed Wireframing',
          },
          estimatedMin: 30,
          energyRequired: 'high',
          leaves: [
            {
              id: 'leaf-2-1',
              title: {
                vi: 'Vẽ bố cục giỏ hàng tối giản & các biến thể nút thanh toán',
                en: 'Wireframe minimalist cart view & payment button options',
              },
              durationMin: 15,
              completed: false,
            },
            {
              id: 'leaf-2-2',
              title: {
                vi: 'Thiết kế form địa chỉ thu gọn & màn hình xác nhận FaceID',
                en: 'Design compact address form & biometric confirmation sheet',
              },
              durationMin: 15,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-3',
          phase: 3,
          title: {
            vi: 'Nhánh 3: Đối chiếu Heuristic NN/g, Khoảng thở & Xuất file',
            en: 'Branch 3: Nielsen Heuristics, Visual Breathing & Export',
          },
          estimatedMin: 25,
          energyRequired: 'medium',
          leaves: [
            {
              id: 'leaf-3-1',
              title: {
                vi: 'Rà soát tiêu chuẩn chống phân tâm & độ tương phản',
                en: 'Zero-distraction audit: Touch targets & contrast ratio',
              },
              durationMin: 15,
              completed: false,
            },
            {
              id: 'leaf-3-2',
              title: {
                vi: 'Xuất file bàn giao & đánh dấu ghi chú tiến trình',
                en: 'Export wireframe specs & log progress',
              },
              durationMin: 10,
              completed: false,
            },
          ],
        },
      ];
    } else if (preset === 'shorten') {
      userText = language === 'vi' ? '✂️ Nhờ Mimi rút ngắn cây còn phiên nhanh ~15-20m' : '✂️ Trim tree to quick ~15-20m sprint';
      updatedDraft.branches = updatedDraft.branches.map((b) => ({
        ...b,
        estimatedMin: Math.max(4, Math.round(b.estimatedMin * 0.7)),
        leaves: b.leaves.slice(0, 1),
      }));
    } else if (preset === 'break_first') {
      userText = language === 'vi' ? '🧩 Chẻ nhỏ bước 1 thành hành động siêu dễ' : '🧩 Break step 1 into effortless micro-actions';
      if (updatedDraft.branches.length > 0) {
        const b0 = { ...updatedDraft.branches[0] };
        b0.leaves = [
          {
            id: `leaf-micro-1`,
            title: {
              vi: 'Mở sổ nháp & ghi đúng 1 gạch đầu dòng mục tiêu (1 phút)',
              en: 'Open draft & jot 1 single bullet goal (1 min)',
            },
            durationMin: 2,
            completed: false,
          },
          {
            id: `leaf-micro-2`,
            title: {
              vi: 'Lướt qua 2 ý chính từ ghi chép Brain Dump (2 phút)',
              en: 'Skim 2 key points from the brain dump note (2 mins)',
            },
            durationMin: 3,
            completed: false,
          },
        ];
        b0.estimatedMin = 5;
        updatedDraft.branches[0] = b0;
      }
    } else if (preset === 'expand') {
      userText = language === 'vi' ? '⚡ Tăng thêm thời gian cho phiên làm việc sâu (+5m)' : '⚡ Extend duration for deeper focus (+5m)';
      updatedDraft.branches = updatedDraft.branches.map((b) => ({
        ...b,
        estimatedMin: b.estimatedMin + 5,
      }));
    }

    updatedDraft.isApproved = false;
    setCurrentDraft(updatedDraft);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user request to chat
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text: userText,
        time: now,
      },
    ]);

    setTimeout(() => {
      setIsTyping(false);
      // Mimi responds with updated draft
      const replyMsg: ChatMessage = {
        id: `msg-revised-${Date.now()}`,
        sender: 'mimi',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text:
          preset === 'branch_20_30'
            ? language === 'vi'
              ? 'Mimi đã chia tác vụ dài (~80 phút) thành 3 nhánh 20-30 phút vừa vặn (25m • 30m • 25m) để bạn duy trì nhịp năng lượng không bị quá tải!'
              : 'Split this deep session (~80m) into 3 calm 20-30m branches (25m • 30m • 25m) preventing cognitive overload!'
            : preset === 'shorten'
            ? language === 'vi'
              ? 'Mimi đã tinh gọn các nhánh và giữ lại hành động trọng tâm nhất!'
              : 'Trimmed down the peripheral steps to keep it razor-sharp!'
            : preset === 'break_first'
            ? language === 'vi'
              ? 'Bước 1 đã được chẻ nhỏ ra chỉ còn 1-2 phút cực kỳ dễ bắt đầu!'
              : 'Step 1 is now split into low-resistance 1-2 min micro-steps!'
            : language === 'vi'
            ? 'Đã mở rộng thêm thời lượng để bạn tập trung thấu đáo!'
            : 'Extended time blocks for deep immersion!',
        type: 'work_tree_draft',
        draftPayload: updatedDraft,
      };

      setMessages((prev) => [...prev, replyMsg]);
    }, 600);
  };

  // Handle Freeform Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();

      // Check intent if in early phase
      if (conversationStep === 'intent') {
        handleSelectIntent('mvp', userText);
        return;
      }

      // Check state if in survey phase
      if (conversationStep === 'survey') {
        handleSelectState('medium', 25, userText);
        return;
      }

      // Dynamic revision in draft_review phase
      let updatedDraft = { ...currentDraft };
      let replyText = '';

      if (lower.includes('bỏ') || lower.includes('xóa') || lower.includes('cut') || lower.includes('remove') || lower.includes('rút')) {
        updatedDraft.branches = updatedDraft.branches.slice(0, 2);
        replyText =
          language === 'vi'
            ? `Mimi đã bỏ bớt nhánh cuối và rút gọn lại cây công việc theo yêu cầu "${userText}" của bạn.`
            : `Removed the branch as requested: "${userText}".`;
      } else if (lower.includes('thêm') || lower.includes('add')) {
        const newBranch: WorkTreeBranch = {
          id: `b-custom-${Date.now()}`,
          phase: updatedDraft.branches.length + 1,
          title: {
            vi: `Nhánh bổ sung: ${userText}`,
            en: `Custom Branch: ${userText}`,
          },
          estimatedMin: 8,
          energyRequired: 'medium',
          leaves: [
            {
              id: `l-custom-1`,
              title: {
                vi: 'Thực hiện chi tiết theo ghi chú',
                en: 'Execute per custom notes',
              },
              durationMin: 8,
            },
          ],
        };
        updatedDraft.branches = [...updatedDraft.branches, newBranch];
        replyText =
          language === 'vi'
            ? `Mimi đã thêm nhánh mới vào Cây Công Việc: "${userText}".`
            : `Added the new branch to the Work Tree: "${userText}".`;
      } else if (lower.includes('ok') || lower.includes('duyệt') || lower.includes('approve') || lower.includes('được rồi') || lower.includes('bắt đầu')) {
        handleApproveDraft();
        return;
      } else {
        replyText =
          language === 'vi'
            ? `Mimi đã ghi nhận: "${userText}". Mình đã cân chỉnh lại cấu trúc Cây Công Việc cho phù hợp!`
            : `Noted: "${userText}". I refined the Work Tree draft accordingly!`;
      }

      setCurrentDraft(updatedDraft);

      const mimiReply: ChatMessage = {
        id: `msg-mimi-${Date.now()}`,
        sender: 'mimi',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        type: 'work_tree_draft',
        draftPayload: updatedDraft,
      };

      setMessages((prev) => [...prev, mimiReply]);
    }, 700);
  };

  // Approve Draft & Transition to Step 3 (Workload Tree Arbor)
  const [isApproving, setIsApproving] = useState(false);

  const handleApproveDraft = () => {
    if (isApproving) return;
    setIsApproving(true);

    const approved = { ...currentDraft, isApproved: true };
    setCurrentDraft(approved);
    if (onSaveWorkTreeDraft) {
      onSaveWorkTreeDraft(approved);
    }
    setConversationStep('approved');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const approveMsg: ChatMessage = {
      id: `msg-approved-${Date.now()}`,
      sender: 'mimi',
      time: now,
      text:
        language === 'vi'
          ? '🎉 **Cây Công Việc đã được duyệt!**\n\nMimi đang chuyển bạn sang màn hình **Cây Việc** để bắt đầu hiệu ứng ươm mầm các nhánh công việc...'
          : '🎉 **Work Tree Approved!**\n\nTransitioning to the **Task Arbor** screen to sprout your newly approved work tree...',
      type: 'approved_card',
      draftPayload: approved,
    };

    setMessages((prev) => [...prev, approveMsg]);

    // Automatically transition to step 3 (workload-overview) after a brief celebration
    setTimeout(() => {
      onNavigate('workload-overview');
    }, 700);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] max-h-[860px] bg-[#fbf7ee] rounded-3xl border border-[#c4c8c1]/35 shadow-sm overflow-hidden">
      {/* Top Chat Header */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-3 border-b border-[#c4c8c1]/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#c6e8c9] text-[#2e3b30] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-[#47654d]" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#47654d] ring-2 ring-white"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[14px] font-bold text-[#1d1c14]">Mimi</h2>
              <span className="text-[10px] bg-[#f3ede1] text-[#47654d] font-semibold px-1.5 py-0.2 rounded-full border border-[#c4c8c1]/30">
                {language === 'vi' ? 'Làm rõ & Soạn Cây' : 'Q&A Assistant'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#747872]">
              <span className="flex items-center gap-1 text-[#b34033] font-medium">
                <Heart className="w-3 h-3 fill-current" />
                {biometrics.heartRate} bpm
              </span>
              <span>•</span>
              <span className="truncate max-w-[150px]">
                {getLocalizedText(currentTask.title, language)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('workload-overview')}
          className="px-2.5 py-1 rounded-full bg-[#f3ede1] hover:bg-[#ede8dc] text-[#47654d] text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95"
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Xem Lộ Trình' : 'Arbor'}</span>
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMimi = msg.sender === 'mimi';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMimi ? 'items-start' : 'items-end'}`}
            >
              <div className={`flex items-start gap-2 max-w-[92%] sm:max-w-[85%]`}>
                {isMimi && (
                  <div className="w-7 h-7 rounded-full bg-[#c6e8c9] text-[#47654d] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  {/* Bubble content */}
                  <div
                    className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-2xs ${
                      isMimi
                        ? 'bg-white text-[#1d1c14] border border-[#c4c8c1]/30 rounded-tl-xs'
                        : 'bg-[#2e3b30] text-white rounded-tr-xs'
                    }`}
                  >
                    {msg.text && (
                      <div className="whitespace-pre-line space-y-2">
                        {msg.text.split('\n\n').map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>
                    )}

                    {/* INTERACTIVE WORK TREE DRAFT CARD INSIDE CHAT */}
                    {msg.type === 'work_tree_draft' && msg.draftPayload && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#fcfaf5] border border-[#47654d]/25 flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-[#c4c8c1]/30 pb-2">
                          <div className="flex items-center gap-1.5">
                            <FolderTree className="w-4 h-4 text-[#47654d]" />
                            <span className="font-bold text-[#2e3b30] text-[13px]">
                              {language === 'vi' ? 'Cây Công Việc Dự Thảo' : 'Work Tree Draft'}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#823925]">
                            {language === 'vi' ? 'Chờ Duyệt / Revise' : 'Draft / Revising'}
                          </span>
                        </div>

                        {/* Intent line */}
                        <div className="text-[11.5px] text-[#546255] bg-white p-2 rounded-lg border border-[#c4c8c1]/20">
                          <strong className="text-[#2e3b30]">
                            {language === 'vi' ? 'Ý định: ' : 'Intent: '}
                          </strong>
                          {getLocalizedText(msg.draftPayload.userIntentSummary, language)}
                        </div>

                        {/* Tree Branches */}
                        <div className="space-y-2">
                          {msg.draftPayload.branches.map((branch) => (
                            <div
                              key={branch.id}
                              className="bg-white rounded-lg p-2.5 border border-[#c4c8c1]/30 flex flex-col gap-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-[#47654d] text-white text-[10px] font-bold flex items-center justify-center">
                                    {branch.phase}
                                  </span>
                                  <span className="font-bold text-[12px] text-[#1d1c14]">
                                    {getLocalizedText(branch.title, language)}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-[#47654d] bg-[#c6e8c9]/40 px-2 py-0.2 rounded-full">
                                  ~{branch.estimatedMin}m
                                </span>
                              </div>

                              <div className="pl-5 space-y-1 border-l border-[#47654d]/20 ml-2">
                                {branch.leaves.map((leaf) => (
                                  <div
                                    key={leaf.id}
                                    className="flex items-center justify-between text-[11px] text-[#434843]"
                                  >
                                    <span className="truncate">
                                      • {getLocalizedText(leaf.title, language)}
                                    </span>
                                    <span className="text-[10px] text-[#747872] shrink-0">
                                      {leaf.durationMin}m
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Quick Revise Action Row */}
                        <div className="flex flex-col gap-1 pt-1 border-t border-[#c4c8c1]/25">
                          <span className="text-[10.5px] font-semibold text-[#747872]">
                            {language === 'vi' ? 'Chỉnh sửa nhanh bằng 1 bấm:' : '1-Tap quick revise:'}
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApplyPreset('branch_20_30')}
                              className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#ede8dc] border border-[#47654d]/30 text-[#1c3822] text-[10.5px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-2xs"
                              title={language === 'vi' ? 'Tách tác vụ dài 1-2 tiếng thành các nhánh 20-30 phút' : 'Split 1-2h task into 20-30m branches'}
                            >
                              <FolderTree className="w-3 h-3 text-[#47654d]" />
                              <span>{language === 'vi' ? 'Tách 20-30p' : '20-30m Branch'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset('shorten')}
                              className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#ede8dc] border border-[#c4c8c1]/40 text-[#2e3b30] text-[10.5px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-2xs"
                            >
                              <Scissors className="w-3 h-3 text-[#d97d64]" />
                              <span>{language === 'vi' ? 'Rút ngắn' : 'Trim'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset('break_first')}
                              className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#ede8dc] border border-[#c4c8c1]/40 text-[#2e3b30] text-[10.5px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-2xs"
                            >
                              <Leaf className="w-3 h-3 text-[#47654d]" />
                              <span>{language === 'vi' ? 'Chẻ bước 1' : 'Micro 1'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset('expand')}
                              className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#ede8dc] border border-[#c4c8c1]/40 text-[#2e3b30] text-[10.5px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-2xs"
                            >
                              <Zap className="w-3 h-3 text-[#e8a338]" />
                              <span>{language === 'vi' ? 'Thêm giờ' : 'Extend'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Direct Approval Button */}
                        <button
                          type="button"
                          onClick={handleApproveDraft}
                          disabled={isApproving}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#47654d] hover:bg-[#3b5540] text-white text-[12.5px] font-bold flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] transition-all mt-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {isApproving
                              ? (language === 'vi' ? 'Đang chuyển sang Cây Việc...' : 'Transferring to Arbor...')
                              : (language === 'vi' ? '✓ Duyệt Cây Này & Sang Bước Cây Việc' : '✓ Approve & Sprout Work Tree')}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* APPROVED CELEBRATION CARD */}
                    {msg.type === 'approved_card' && (
                      <div className="mt-2 p-3 bg-[#c6e8c9]/60 rounded-xl border border-[#47654d]/30 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#04210e]">
                          <CheckCircle2 className="w-4 h-4 text-[#47654d]" />
                          <span>
                            {language === 'vi' ? 'Trạng thái: Đã duyệt Cây Công Việc' : 'Status: Work Tree Approved'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate('workload-overview')}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#2e3b30] hover:bg-[#435245] text-white text-[12px] font-bold flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-all"
                        >
                          <span>{language === 'vi' ? 'Sang Cây Việc & Xem Nảy Mầm' : 'Go to Arbor & Watch Sprout'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className={`text-[10px] text-[#747872] px-1 ${isMimi ? 'text-left' : 'text-right'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>

              {/* CONTEXTUAL QUICK-REPLY CHIPS (BELOW MESSAGE) */}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-9 max-w-[90%]">
                  {msg.quickReplies.map((qr) => (
                    <button
                      key={qr.id}
                      type="button"
                      onClick={qr.action}
                      className="px-3 py-1.5 bg-white hover:bg-[#ede8dc] text-[#2e3b30] border border-[#c4c8c1]/50 rounded-full text-[12px] font-semibold shadow-2xs transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>{qr.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-[#747872] text-[12px] pl-1">
            <div className="w-7 h-7 rounded-full bg-[#c6e8c9] text-[#47654d] flex items-center justify-center shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white px-3 py-2 rounded-2xl border border-[#c4c8c1]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#47654d] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#47654d] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#47654d] animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-white border-t border-[#c4c8c1]/30 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Nhắn tin trả lời Mimi hoặc yêu cầu sửa cây (ví dụ: "Bỏ bước 3", "Duyệt cây")...'
                : 'Reply to Mimi or revise the tree (e.g., "Remove step 3", "Approve")...'
            }
            className="flex-1 bg-[#fcfaf5] border border-[#c4c8c1]/40 rounded-full px-4 py-2 text-[13px] text-[#1d1c14] placeholder:text-[#747872] focus:outline-none focus:border-[#47654d] transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
              inputValue.trim()
                ? 'bg-[#47654d] hover:bg-[#3b5540] text-white active:scale-95 shadow-2xs'
                : 'bg-[#ede8dc] text-[#747872] cursor-not-allowed opacity-60'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
