import { Task, WorkTreeDraft, WorkTreeBranch, WorkTreeLeaf, Language } from '../types';

export function createInitialWorkTreeDraft(
  task?: Task,
  energyLevel: 'high' | 'medium' | 'low' = 'medium',
  availableMinutes: number = 35,
  intentPreset: string = 'mvp'
): WorkTreeDraft {
  if (task?.workTree) {
    return task.workTree;
  }

  const isPsych =
    task &&
    (task.courseCode === 'PSYC101' ||
      task.title.en.toLowerCase().includes('psych') ||
      task.title.vi.toLowerCase().includes('tâm lý'));

  const isGerman =
    task &&
    (task.courseCode === 'GER101' ||
      task.title.en.toLowerCase().includes('german') ||
      task.title.vi.toLowerCase().includes('đức') ||
      task.title.en.toLowerCase().includes('vocab') ||
      task.title.vi.toLowerCase().includes('từ vựng'));

  const isBotanical =
    task &&
    (task.title.en.toLowerCase().includes('conservatory') ||
      task.title.en.toLowerCase().includes('botanical') ||
      task.title.vi.toLowerCase().includes('vườn kính') ||
      task.title.vi.toLowerCase().includes('thực vật'));

  const isUX =
    task &&
    (task.title.en.toLowerCase().includes('wireframe') ||
      task.title.en.toLowerCase().includes('ux') ||
      task.title.vi.toLowerCase().includes('phác thảo') ||
      task.title.vi.toLowerCase().includes('checkout'));

  if (isPsych) {
    return {
      rootTaskId: task?.id || 't-psych',
      rootTaskTitle: {
        vi: task?.title.vi || 'Đọc & Tóm tắt Chương 4 Tâm lý học (Dual-Coding)',
        en: task?.title.en || 'Read & Synthesize PSYC101 Ch.4 (Dual-Coding)',
      },
      userIntentSummary: {
        vi:
          intentPreset === 'mvp'
            ? 'Đọc lướt trích xuất 3 ý chính và hoàn thành bài nộp 300 từ trước 23:59.'
            : 'Nắm vững lý thuyết mã hóa kép để chuẩn bị cho kỳ thi giữa kỳ.',
        en:
          intentPreset === 'mvp'
            ? 'Skim 3 core takeaways and finalize 300-word submission before 23:59.'
            : 'Master dual-coding theory thoroughly for midterm examination.',
      },
      surveyedState: {
        energyLevel,
        availableMinutes,
        cognitiveReadiness: {
          vi: 'Nhịp tim 72 bpm thư thái • Sẵn sàng tiếp nhận tài liệu học thuật',
          en: 'Resting 72 bpm • Clear cognitive bandwidth for academic concepts',
        },
      },
      isApproved: true,
      branches: [
        {
          id: 'branch-1',
          phase: 1,
          title: {
            vi: 'Nhánh 1: Khảo sát & Định vị mục tiêu',
            en: 'Branch 1: Survey & Locate Target Excerpts',
          },
          estimatedMin: 8,
          energyRequired: 'low',
          leaves: [
            {
              id: 'leaf-1-1',
              title: {
                vi: 'Lướt đề mục Slide 12-22 trên Canvas LMS',
                en: 'Scan subheadings across Slide 12-22 in Canvas LMS',
              },
              durationMin: 4,
              completed: false,
            },
            {
              id: 'leaf-1-2',
              title: {
                vi: 'Ghi lại 3 câu hỏi định hướng theo phương pháp SQ3R',
                en: 'Formulate 3 inquiry questions via SQ3R method',
              },
              durationMin: 4,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-2',
          phase: 2,
          title: {
            vi: 'Nhánh 2: Đọc sâu & Sơ đồ hóa kênh kép',
            en: 'Branch 2: Deep Read & Dual-Channel Mapping',
          },
          estimatedMin: 10,
          energyRequired: energyLevel === 'low' ? 'medium' : 'high',
          leaves: [
            {
              id: 'leaf-2-1',
              title: {
                vi: 'Đọc phần Mô hình Trí nhớ làm việc Baddeley & Hitch',
                en: 'Read Baddeley & Hitch Multi-Component Working Memory',
              },
              durationMin: 5,
              completed: false,
            },
            {
              id: 'leaf-2-2',
              title: {
                vi: 'Phác thảo sơ đồ hộp 2 kênh: Ngôn ngữ & Thị giác',
                en: 'Sketch 2-channel diagram: Phonological Loop & Visuo-Spatial',
              },
              durationMin: 5,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-3',
          phase: 3,
          title: {
            vi: 'Nhánh 3: Soạn tóm tắt & Kiểm tra nộp bài',
            en: 'Branch 3: Draft Synthesis & Rubric Check',
          },
          estimatedMin: 7,
          energyRequired: 'medium',
          leaves: [
            {
              id: 'leaf-3-1',
              title: {
                vi: 'Viết đoạn văn 300 từ so sánh 2 thành phần',
                en: 'Draft 300-word paragraph comparing both components',
              },
              durationMin: 5,
              completed: false,
            },
            {
              id: 'leaf-3-2',
              title: {
                vi: 'Rà soát tiêu chí Canvas LMS & Nộp bài',
                en: 'Verify Canvas LMS rubric checklist & submit',
              },
              durationMin: 2,
              completed: false,
            },
          ],
        },
      ],
    };
  }

  if (isGerman) {
    return {
      rootTaskId: task?.id || 't-german',
      rootTaskTitle: {
        vi: task?.title.vi || 'Ôn tập từ vựng tiếng Đức (B2)',
        en: task?.title.en || 'German lexical review (B2)',
      },
      userIntentSummary: {
        vi: 'Ôn tập nhanh 18 cụm từ vựng chủ đề môi trường bằng phương pháp lặp lại ngắt quãng.',
        en: 'Quick spaced-repetition review of 18 environmental German collocations.',
      },
      surveyedState: {
        energyLevel,
        availableMinutes: 15,
        cognitiveReadiness: {
          vi: 'Nhịp tim 70 bpm thư thái • Trạng thái phản xạ ngôn ngữ nhạy bén',
          en: 'Resting 70 bpm • Keen auditory and lexical recall readiness',
        },
      },
      isApproved: true,
      branches: [
        {
          id: 'branch-1',
          phase: 1,
          title: {
            vi: 'Nhánh 1: Rà soát phát âm & Nghĩa gốc 18 từ',
            en: 'Branch 1: Auditory Scan & Root Meanings',
          },
          estimatedMin: 4,
          energyRequired: 'low',
          leaves: [
            {
              id: 'leaf-1-1',
              title: {
                vi: 'Lắng nghe phát âm chuẩn các danh từ ghép giống Der/Die/Das',
                en: 'Listen to native pronunciation of compound nouns',
              },
              durationMin: 2,
              completed: false,
            },
            {
              id: 'leaf-1-2',
              title: {
                vi: 'Tách tiền tố & hậu tố các từ phức tạp',
                en: 'Dissect grammatical prefixes and suffixes',
              },
              durationMin: 2,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-2',
          phase: 2,
          title: {
            vi: 'Nhánh 2: Sprint Flashcard Spaced Repetition',
            en: 'Branch 2: Spaced Repetition Flashcard Sprint',
          },
          estimatedMin: 7,
          energyRequired: 'medium',
          leaves: [
            {
              id: 'leaf-2-1',
              title: {
                vi: 'Vòng 1: Nhận diện phản xạ Đức -> Việt trong 3 giây',
                en: 'Round 1: German to English 3-second rapid recall',
              },
              durationMin: 4,
              completed: false,
            },
            {
              id: 'leaf-2-2',
              title: {
                vi: 'Vòng 2: Luyện ngược Việt -> Đức cho 5 từ hay quên',
                en: 'Round 2: Reverse prompt for difficult collocations',
              },
              durationMin: 3,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-3',
          phase: 3,
          title: {
            vi: 'Nhánh 3: Ứng dụng đặt 2 câu đàm thoại thực tế',
            en: 'Branch 3: Conversational Sentence Anchoring',
          },
          estimatedMin: 4,
          energyRequired: 'low',
          leaves: [
            {
              id: 'leaf-3-1',
              title: {
                vi: 'Đặt 2 câu biểu đạt quan điểm về bảo vệ khí hậu',
                en: 'Form 2 sentences arguing climate protection viewpoints',
              },
              durationMin: 3,
              completed: false,
            },
            {
              id: 'leaf-3-2',
              title: {
                vi: 'Lưu bộ thẻ vào danh sách đã thành thạo trên LMS',
                en: 'Tag cards mastered in LMS spaced-repetition log',
              },
              durationMin: 1,
              completed: false,
            },
          ],
        },
      ],
    };
  }

  if (isBotanical) {
    return {
      rootTaskId: task?.id || 't-botanical',
      rootTaskTitle: {
        vi: task?.title.vi || 'Phân loại danh mục thực vật vườn kính',
        en: task?.title.en || 'Conservatory botanical index mapping',
      },
      userIntentSummary: {
        vi: 'Hệ thống hóa cấu trúc phân loại thảo mộc & dương xỉ vườn kính thành sơ đồ cây.',
        en: 'Systematize greenhouse fern and herbal categories into a serene tree hierarchy.',
      },
      surveyedState: {
        energyLevel,
        availableMinutes: 20,
        cognitiveReadiness: {
          vi: 'Nhịp tim 68 bpm tĩnh tại • Tối ưu cho công việc phân loại & tư duy hệ thống',
          en: 'Resting 68 bpm • High systematic taxonomy clarity',
        },
      },
      isApproved: true,
      branches: [
        {
          id: 'branch-1',
          phase: 1,
          title: {
            vi: 'Nhánh 1: Khảo sát danh sách loài dương xỉ & rêu',
            en: 'Branch 1: Fern & Moss Species Survey',
          },
          estimatedMin: 5,
          energyRequired: 'low',
          leaves: [
            {
              id: 'leaf-1-1',
              title: {
                vi: 'Xem lại bản ghi âm mô tả 12 mẫu thực vật sáng nay',
                en: 'Listen to voice memo describing 12 specimens from morning',
              },
              durationMin: 3,
              completed: false,
            },
            {
              id: 'leaf-1-2',
              title: {
                vi: 'Ghi nhanh danh sách tên khoa học Latinh tương ứng',
                en: 'Draft list of corresponding botanical binomial Latin names',
              },
              durationMin: 2,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-2',
          phase: 2,
          title: {
            vi: 'Nhánh 2: Thiết kế sơ đồ phân cấp 3 tầng tán lá',
            en: 'Branch 2: 3-Tier Canopy Hierarchy Mapping',
          },
          estimatedMin: 10,
          energyRequired: 'medium',
          leaves: [
            {
              id: 'leaf-2-1',
              title: {
                vi: 'Phân loại theo tầng sinh thái: Tầng thảm, Tầng dưới tán, Tầng tán',
                en: 'Cluster by microclimate: Floor, Understory, Canopy fronds',
              },
              durationMin: 5,
              completed: false,
            },
            {
              id: 'leaf-2-2',
              title: {
                vi: 'Vẽ liên kết nhánh phân cấp trên bảng ý tưởng',
                en: 'Diagram relational branches on index canvas',
              },
              durationMin: 5,
              completed: false,
            },
          ],
        },
        {
          id: 'branch-3',
          phase: 3,
          title: {
            vi: 'Nhánh 3: Đánh chỉ mục thẻ màu & Hoàn thiện bảng tra',
            en: 'Branch 3: Color Indexing & Navigation Tags',
          },
          estimatedMin: 5,
          energyRequired: 'low',
          leaves: [
            {
              id: 'leaf-3-1',
              title: {
                vi: 'Gán mã màu nhận diện theo độ ẩm và ánh sáng yêu cầu',
                en: 'Assign color badges for humidity and light needs',
              },
              durationMin: 3,
              completed: false,
            },
            {
              id: 'leaf-3-2',
              title: {
                vi: 'Xuất bản mục lục tra cứu nhanh định dạng thẻ',
                en: 'Export clean index summary card to notebook',
              },
              durationMin: 2,
              completed: false,
            },
          ],
        },
      ],
    };
  }

  if (isUX || !task) {
    const isDeepSession = (task?.durationMin || availableMinutes) >= 60;
    const taskDuration = task?.durationMin || (isDeepSession ? 80 : 40);

    return {
      rootTaskId: task?.id || 't-ux-wireframe',
      rootTaskTitle: {
        vi: task?.title.vi || 'Thiết kế Wireframe Luồng Checkout Tối giản (Toàn diện)',
        en: task?.title.en || 'Minimalist Mobile Checkout Wireframing (End-to-End)',
      },
      userIntentSummary: {
        vi:
          intentPreset === 'mvp'
            ? 'Phác thảo 3 màn hình cốt lõi (Giỏ hàng -> Điền địa chỉ 1-click -> Xác nhận thanh toán) chia thành các chặng 20-30 phút không ngợp.'
            : 'Xây dựng luồng wireflow hoàn chỉnh có tích hợp Apple Pay & Guest Checkout theo chu kỳ 20-30 phút.',
        en:
          intentPreset === 'mvp'
            ? 'Sketch 3 core low-fidelity wireframes (Cart -> 1-click Express Pay -> Confirmation) in tranquil 20-30m sprints.'
            : 'Build end-to-end checkout wireflow integrating Apple Pay & Guest Checkout in 20-30m sprints.',
      },
      surveyedState: {
        energyLevel,
        availableMinutes: taskDuration,
        cognitiveReadiness: {
          vi: 'Nhịp tim 72 bpm ổn định • Năng lượng sáng tạo trực quan ở mức tối ưu • Phiên sâu 80m chia 3 nhánh 20-30p',
          en: 'Resting 72 bpm • Visual creativity bandwidth optimal • 80m session split into 3 branches (20-30m each)',
        },
      },
      isApproved: true,
      branches: [
        {
          id: 'branch-1',
          phase: 1,
          title: {
            vi: 'Nhánh 1: Tinh lọc kiến trúc luồng & Khung sườn (Framing)',
            en: 'Branch 1: Architecture Flow & Framing',
          },
          estimatedMin: 25,
          energyRequired: 'low',
          leaves: [
            {
              id: 'leaf-1-1',
              title: {
                vi: 'Xem lại ghi chép Brain Dump & xác định rào cản gõ phím trên di động',
                en: 'Audit Brain Dump notes & identify mobile typing friction',
              },
              durationMin: 10,
              completed: false,
            },
            {
              id: 'leaf-1-2',
              title: {
                vi: 'Phác thảo luồng trạng thái 1-Click Checkout & Chế độ khách (Guest)',
                en: 'Map 1-Click Express Pay state flow & frictionless Guest checkout',
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
            vi: 'Nhánh 2: Sprint phác thảo Crazy Eights & Wireframe chi tiết 3 màn hình',
            en: 'Branch 2: Crazy Eights Sprint & Detailed 3-Screen Wireframing',
          },
          estimatedMin: 30,
          energyRequired: energyLevel === 'low' ? 'medium' : 'high',
          leaves: [
            {
              id: 'leaf-2-1',
              title: {
                vi: 'Vẽ bố cục giỏ hàng tối giản & các biến thể nút thanh toán siêu tốc',
                en: 'Wireframe minimalist cart view & express payment button placement',
              },
              durationMin: 15,
              completed: false,
            },
            {
              id: 'leaf-2-2',
              title: {
                vi: 'Thiết kế form địa chỉ thu gọn & màn hình xác nhận FaceID/TouchID',
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
            vi: 'Nhánh 3: Đối chiếu Heuristic NN/g, Tối ưu khoảng thở thị giác & Xuất file',
            en: 'Branch 3: Nielsen Heuristics Audit, Visual Breathing Space & Export',
          },
          estimatedMin: 25,
          energyRequired: 'medium',
          leaves: [
            {
              id: 'leaf-3-1',
              title: {
                vi: 'Rà soát tiêu chuẩn chống phân tâm: Khoảng thở, kích thước chạm & độ tương phản',
                en: 'Zero-distraction audit: Touch targets, breathing margins & contrast ratio',
              },
              durationMin: 15,
              completed: false,
            },
            {
              id: 'leaf-3-2',
              title: {
                vi: 'Xuất file ảnh phác thảo, ghi chú bàn giao & lưu tiến trình',
                en: 'Export wireframe overview, handoff specs & log progress',
              },
              durationMin: 10,
              completed: false,
            },
          ],
        },
      ],
    };
  }

  // Dynamic tailored generation for ANY other task (e.g. Brain Dump / Custom tasks)
  const taskTitleVi = task.title.vi;
  const taskTitleEn = task.title.en;

  const effectiveMins = task?.durationMin || availableMinutes || 35;
  const isOneToTwoHours = effectiveMins >= 60 && effectiveMins <= 120;

  // Calibrate branches for 1-2 hour tasks to strictly fall in 20-30 min
  const b1Min = isOneToTwoHours ? 25 : Math.max(5, Math.round(effectiveMins * 0.25));
  const b2Min = isOneToTwoHours ? 30 : Math.max(12, Math.round(effectiveMins * 0.5));
  const b3Min = isOneToTwoHours
    ? Math.max(20, Math.min(30, effectiveMins - b1Min - b2Min))
    : Math.max(6, Math.round(effectiveMins * 0.25));

  return {
    rootTaskId: task?.id || 'dynamic-task',
    rootTaskTitle: task?.title || { vi: 'Nhiệm vụ tập trung', en: 'Focus Task' },
    userIntentSummary: {
      vi: isOneToTwoHours
        ? `Tác vụ sâu ${effectiveMins} phút được chia nhỏ thành 3 nhánh 20-30 phút giúp duy trì năng lượng tĩnh lặng.`
        : intentPreset === 'mvp'
        ? `Tập trung hoàn thành kết quả cốt lõi cho "${taskTitleVi}" trong thời gian tinh gọn.`
        : `Thực hiện thấu đáo từng giai đoạn của "${taskTitleVi}".`,
      en: isOneToTwoHours
        ? `Deep ${effectiveMins}m session structured into 3 calm 20-30m branches preventing cognitive overload.`
        : intentPreset === 'mvp'
        ? `Focus on core deliverables for "${taskTitleEn}" in streamlined time.`
        : `Thoroughly execute all stages of "${taskTitleEn}".`,
    },
    surveyedState: {
      energyLevel,
      availableMinutes: effectiveMins,
      cognitiveReadiness: {
        vi: isOneToTwoHours
          ? 'Tác vụ 1-2 tiếng: Tự động tách thành các phiên ngắn 20-30p chống kiệt sức'
          : 'Nhịp tim 72 bpm ổn định • Sẵn sàng tập trung cao độ',
        en: isOneToTwoHours
          ? '1-2 hour task: Automatically chunked into 20-30m sprints preventing burnout'
          : 'Resting 72 bpm • Clear cognitive bandwidth for deep focus',
      },
    },
    isApproved: false,
    branches: [
      {
        id: 'branch-1',
        phase: 1,
        title: {
          vi: `Nhánh 1: Khởi động & Khảo sát phạm vi (Giai đoạn 1)`,
          en: `Branch 1: Scoping & Setup (Phase 1)`,
        },
        estimatedMin: b1Min,
        energyRequired: 'low',
        leaves: [
          {
            id: 'leaf-1-1',
            title: {
              vi: `Rà soát mục tiêu & chuẩn bị tài liệu: ${taskTitleVi}`,
              en: `Review scope and setup materials: ${taskTitleEn}`,
            },
            durationMin: Math.max(3, Math.round(b1Min * 0.4)),
            completed: false,
          },
          {
            id: 'leaf-1-2',
            title: {
              vi: 'Xác định kết quả then chốt cần bàn giao',
              en: 'Identify core deliverables and acceptance criteria',
            },
            durationMin: Math.max(4, Math.round(b1Min * 0.6)),
            completed: false,
          },
        ],
      },
      {
        id: 'branch-2',
        phase: 2,
        title: {
          vi: `Nhánh 2: Thực thi trọng tâm & Khối lượng lõi (Giai đoạn 2)`,
          en: `Branch 2: Core Action & Deep Execution (Phase 2)`,
        },
        estimatedMin: b2Min,
        energyRequired: energyLevel === 'low' ? 'medium' : 'high',
        leaves: [
          {
            id: 'leaf-2-1',
            title: {
              vi: `Giải quyết thành phần quan trọng nhất của ${taskTitleVi}`,
              en: `Work through primary component of ${taskTitleEn}`,
            },
            durationMin: Math.max(5, Math.round(b2Min * 0.5)),
            completed: false,
          },
          {
            id: 'leaf-2-2',
            title: {
              vi: 'Hoàn thiện bản nháp đầu tiên',
              en: 'Finalize initial functional draft',
            },
            durationMin: Math.max(5, Math.round(b2Min * 0.5)),
            completed: false,
          },
        ],
      },
      {
        id: 'branch-3',
        phase: 3,
        title: {
          vi: `Nhánh 3: Tinh chỉnh, Kiểm tra & Đúc kết (Giai đoạn 3)`,
          en: `Branch 3: Polish, Verification & Output (Phase 3)`,
        },
        estimatedMin: b3Min,
        energyRequired: 'medium',
        leaves: [
          {
            id: 'leaf-3-1',
            title: {
              vi: 'Đối chiếu tiêu chuẩn chất lượng & chỉnh chu',
              en: 'Verify quality standards & refinement',
            },
            durationMin: Math.max(3, Math.round(b3Min * 0.5)),
            completed: false,
          },
          {
            id: 'leaf-3-2',
            title: {
              vi: 'Lưu trữ tiến trình và đánh dấu hoàn tất',
              en: 'Save artifacts and log task completion',
            },
            durationMin: Math.max(2, Math.round(b3Min * 0.5)),
            completed: false,
          },
        ],
      },
    ],
  };
}
