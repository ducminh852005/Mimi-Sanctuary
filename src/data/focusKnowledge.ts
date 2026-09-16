import { TaskMethodology, TaskResource, Task, Language } from '../types';

export const TASK_METHODOLOGIES: Record<string, TaskMethodology[]> = {
  default: [
    {
      id: 'pomodoro-recall',
      name: {
        vi: 'Kỹ thuật Pomodoro & Active Recall',
        en: 'Pomodoro with Active Recall',
      },
      badge: {
        vi: 'Khuyến nghị cho phiên 25m',
        en: 'Recommended for 25m session',
      },
      howToApply: {
        vi: 'Dành 18 phút đầu tập trung xử lý nội dung, 7 phút cuối nhắm mắt tự tóm tắt lại 3 ý quan trọng nhất mà không nhìn tài liệu.',
        en: 'Spend the first 18m processing content, and the last 7m recalling and jotting down 3 core takeaways without looking back.',
      },
      scientificBenefit: {
        vi: 'Kích hoạt vùng hồi hải mã (hippocampus), củng cố trí nhớ dài hạn gấp 2.4 lần so với đọc thụ động.',
        en: 'Stimulates the hippocampus and boosts long-term retention 2.4x compared to passive reading.',
      },
      steps: {
        vi: [
          'Tắt mọi thông báo ngoài màn hình focus',
          'Đọc/thực hiện mục tiêu đầu tiên trong 18 phút',
          'Dành 7 phút ghi lại tóm tắt tự thân (Self-testing)',
        ],
        en: [
          'Mute non-essential notifications outside the focus enclave',
          'Tackle the primary milestone for 18 minutes',
          'Dedicate 7 minutes to self-testing summaries',
        ],
      },
    },
    {
      id: 'feynman-technique',
      name: {
        vi: 'Phương pháp Feynman (Giảng cho học sinh lớp 5)',
        en: 'Feynman Technique (Explain like I’m 5)',
      },
      badge: {
        vi: 'Hiệu quả hiểu sâu',
        en: 'Deep Comprehension',
      },
      howToApply: {
        vi: 'Sau mỗi đoạn kiến thức, diễn giải lại bằng từ ngữ đời thường, ngắn gọn như đang giải thích cho một người bạn chưa từng học qua môn này.',
        en: 'After each section, restate the core concept using plain, everyday language as if explaining it to a curious beginner.',
      },
      scientificBenefit: {
        vi: 'Bộc lộ ngay lập tức các "lỗ hổng tri thức" (Knowledge gaps) mà bạn ngộ nhận là mình đã hiểu.',
        en: 'Instantly surfaces illusions of competence and pinpoint specific knowledge gaps.',
      },
      steps: {
        vi: [
          'Xác định 1 thuật ngữ/ý niệm khó hiểu',
          'Viết giải thích bằng 2-3 câu bình dân nhất',
          'Tra cứu lại nếu bị khựng hoặc phải dùng biệt ngữ khó hiểu',
        ],
        en: [
          'Identify 1 challenging term or concept',
          'Draft a 2-3 sentence explanation without jargon',
          'Re-consult materials where your explanation falters',
        ],
      },
    },
  ],
  PSYC101: [
    {
      id: 'dual-coding',
      name: {
        vi: 'Phương pháp Mã hóa kép (Dual-Coding Paivio)',
        en: 'Dual-Coding Method (Paivio Theory)',
      },
      badge: {
        vi: 'Khớp 100% tài liệu Chương 4',
        en: '100% Match for Chapter 4',
      },
      howToApply: {
        vi: 'Vẽ sơ đồ 2 luồng: 1 bên là Nhánh Ngôn ngữ (Phonological loop: từ khóa, định nghĩa), 1 bên là Nhánh Thị giác (Visuo-spatial sketchpad: hình phác, biểu đồ hộp bộ nhớ).',
        en: 'Draft a dual-channel diagram: one Verbal stream (Phonological Loop: keywords, definitions) paired with a Visual stream (Visuo-spatial Sketchpad: quick memory flowcharts).',
      },
      scientificBenefit: {
        vi: 'Giảm tải nhận thức cho bộ nhớ làm việc (Working Memory), cho phép lưu trữ 2 kênh độc lập mà không gây nghẽn nhận thức.',
        en: 'Minimizes cognitive load in working memory by leveraging independent verbal and visual cognitive channels.',
      },
      steps: {
        vi: [
          'Mở mục 4.2 trong tài liệu LMS',
          'Phác thảo sơ đồ hộp: Bộ nhớ cảm giác -> Bộ nhớ làm việc -> Trí nhớ dài hạn',
          'Gắn 3 ví dụ đời sống thực tế bên cạnh mỗi hộp',
        ],
        en: [
          'Open Section 4.2 in the LMS material',
          'Sketch a 3-box pipeline: Sensory -> Working Memory -> Long-term Memory',
          'Annotate each box with one real-world sensory example',
        ],
      },
    },
    {
      id: 'sq3r-psych',
      name: {
        vi: 'Phương pháp SQ3R (Khảo sát, Đặt câu hỏi, Đọc, Thuật lại, Ôn tập)',
        en: 'SQ3R Reading System (Survey, Question, Read, Recite, Review)',
      },
      badge: {
        vi: 'Đọc sâu giáo trình học thuật',
        en: 'Academic Deep Reading',
      },
      howToApply: {
        vi: 'Lướt các tiêu đề phụ của Chương 4 -> Đổi tiêu đề thành câu hỏi "Tại sao giới hạn nhớ lại là 7±2?" -> Đọc để tìm lời giải.',
        en: 'Skim subheadings of Chapter 4 -> Turn headings into questions like "Why is working memory constrained to 7±2?" -> Read intentionally for answers.',
      },
      scientificBenefit: {
        vi: 'Chuyển trạng thái từ tiếp thu thụ động sang chế độ săn tìm thông tin (Active Inquiry).',
        en: 'Transforms passive textbook scrolling into active investigative problem solving.',
      },
      steps: {
        vi: [
          'Khảo sát nhanh hình vẽ & đề mục trong 3 phút',
          'Biến 3 đề mục thành 3 câu hỏi vào ô ghi chú',
          'Đọc sâu 15 phút để tìm lời giải',
        ],
        en: [
          'Survey figures and headings for 3 minutes',
          'Convert 3 headings into 3 focus questions',
          'Read deeply for 15 minutes to extract answers',
        ],
      },
    },
  ],
  UX_DESIGN: [
    {
      id: 'crazy-eights',
      name: {
        vi: 'Kỹ thuật Crazy Eights (8 Phác thảo trong 8 Phút)',
        en: 'Crazy Eights Sprint (8 Sketches in 8 Min)',
      },
      badge: {
        vi: 'Tối ưu cho Brain Dump wireframe',
        en: 'Ideal for Wireframe Flow',
      },
      howToApply: {
        vi: 'Gấp đôi tờ giấy 3 lần để chia thành 8 ô. Dành đúng 60 giây cho mỗi ô để vẽ nhanh 1 cách bố cục màn hình thanh toán tối giản.',
        en: 'Fold paper into 8 boxes. Spend exactly 60 seconds per box sketching 1 minimalist checkout layout variation.',
      },
      scientificBenefit: {
        vi: 'Vượt qua sức ỳ của "ý tưởng đầu tiên hiển nhiên", thúc đẩy bán cầu não phải tìm ra luồng thanh toán ít thao tác nhất.',
        en: 'Overcomes first-idea fixation and forces exploration of ultra-low-friction micro-interactions.',
      },
      steps: {
        vi: [
          'Vẽ 4 màn hình đầu: cách gom địa chỉ & thông tin thẻ',
          'Vẽ 4 màn hình sau: trải nghiệm 1-click checkout với Apple/Google Pay',
          'Chọn 1 biến thể tốt nhất để số hóa',
        ],
        en: [
          'First 4 boxes: compacting shipping & payment forms',
          'Next 4 boxes: 1-click Express Pay experiences',
          'Pick the cleanest variant to finalize',
        ],
      },
    },
    {
      id: 'nngroup-minimalism',
      name: {
        vi: 'Heuristic Nielsen: Triệt tiêu phân tâm giỏ hàng',
        en: 'Nielsen Norman Heuristic: Distraction-Free Cart',
      },
      badge: {
        vi: 'Chuẩn UX E-commerce',
        en: 'E-commerce UX Benchmark',
      },
      howToApply: {
        vi: 'Ẩn hoàn toàn thanh menu điều hướng phụ (header navigation, footer link) khi người dùng ở bước thanh toán cuối.',
        en: 'Strip secondary header menus and footer links completely at checkout to create a focused conversion tunnel.',
      },
      scientificBenefit: {
        vi: 'Giảm 37% tỷ lệ bỏ rơi giỏ hàng do phân tâm thị giác (Cart abandonment rate).',
        en: 'Reduces cart abandonment by up to 37% by eliminating visual escape routes.',
      },
      steps: {
        vi: [
          'Chỉ giữ: Nút quay lại, Tóm tắt giỏ hàng, Nút CTA thanh toán',
          'Tối đa 3 trường thông tin hiển thị trên 1 màn hình',
        ],
        en: [
          'Keep only: Back button, Order summary, Primary CTA',
          'Cap at 3 primary form groups per screen view',
        ],
      },
    },
  ],
  GER101: [
    {
      id: 'leitner-box',
      name: {
        vi: 'Hệ thống Leitner 3 Ngăn (Spaced Repetition)',
        en: 'Leitner 3-Box Spaced Repetition',
      },
      badge: {
        vi: 'Ôn tập 18 từ vựng B2',
        en: '18 B2 German Vocab Cards',
      },
      howToApply: {
        vi: 'Chia 18 từ vựng môi trường thành 3 nhóm: Từ đã nhớ chắc (ôn sau 3 ngày), Từ chập chờn (ôn ngày mai), Từ hay quên (ôn ngay hôm nay).',
        en: 'Sort the 18 environmental terms into 3 boxes: Mastered (review in 3d), Hesitant (tomorrow), Stumbled (review today).',
      },
      scientificBenefit: {
        vi: 'Đánh bại đường cong quên lãng Ebbinghaus mà không mất công học lại toàn bộ danh sách.',
        en: 'Flattens the Ebbinghaus forgetting curve with minimal repetition overhead.',
      },
      steps: {
        vi: [
          'Ôn 18 từ trong 8 phút đầu',
          'Chuyển từ sai về Hộp 1 để đặt câu ngữ cảnh',
        ],
        en: [
          'Review all 18 cards in the first 8 minutes',
          'Move stumbled cards to Box 1 and construct full sentences',
        ],
      },
    },
  ],
};

export const TASK_RESOURCES: Record<string, TaskResource[]> = {
  PSYC101: [
    {
      id: 'res-lms-psyc',
      title: {
        vi: 'Canvas LMS: Mô-đun Chương 4 - Tâm lý học nhận thức',
        en: 'Canvas LMS: Module Ch.4 - Cognitive Psychology',
      },
      sourceType: 'lms',
      sourceTag: {
        vi: 'Canvas LMS [PSYC101]',
        en: 'Canvas LMS [PSYC101]',
      },
      urlOrPath: 'https://canvas.edu/courses/psyc101/modules/chapter-4',
      description: {
        vi: 'Bài giảng Slide 12-34 & yêu cầu tóm tắt nộp bài trước 23:59 hôm nay của Giáo sư Miller.',
        en: 'Lecture slides 12-34 & 23:59 submission rubric by Prof. Miller.',
      },
      keyExcerpt: {
        vi: 'Yêu cầu nộp bài: 1 đoạn tóm tắt 300 từ so sánh Phonological Loop & Visuo-Spatial Sketchpad.',
        en: 'Submission Rubric: 300-word excerpt comparing Phonological Loop & Visuo-Spatial Sketchpad.',
      },
    },
    {
      id: 'res-doc-psyc',
      title: {
        vi: 'Tài liệu đính kèm: De_cuong_Tam_ly_hoc_Ch4.pdf',
        en: 'Attached Document: De_cuong_Tam_ly_hoc_Ch4.pdf',
      },
      sourceType: 'attachment',
      sourceTag: {
        vi: 'Tệp đính kèm [PDF 1.4 MB]',
        en: 'Attached Doc [PDF 1.4 MB]',
      },
      urlOrPath: 'local://attachments/De_cuong_Tam_ly_hoc_Ch4.pdf',
      description: {
        vi: 'Đề cương chi tiết có đánh dấu highlight các định nghĩa và ví dụ thi giữa kỳ.',
        en: 'Highlighted course syllabus with midterm definitions and diagram exhibits.',
      },
      keyExcerpt: {
        vi: 'Trang 22: Thí nghiệm Baddeley & Hitch (1974) chứng minh trí nhớ làm việc là đa thành phần.',
        en: 'Page 22: Baddeley & Hitch (1974) experiment demonstrating multi-component working memory.',
      },
    },
    {
      id: 'res-web-stanford',
      title: {
        vi: 'Stanford Encyclopedia: Dual-Coding & Working Memory',
        en: 'Stanford Encyclopedia: Dual-Coding & Working Memory',
      },
      sourceType: 'web',
      sourceTag: {
        vi: 'Nguồn học thuật mở',
        en: 'Academic Open Web',
      },
      urlOrPath: 'https://plato.stanford.edu/entries/cognitive-science/',
      description: {
        vi: 'Tài liệu tra cứu học thuật uy tín giải thích cặn kẽ học thuyết Allan Paivio và John Sweller.',
        en: 'Peer-reviewed academic reference detailing Allan Paivio and John Sweller’s cognitive load models.',
      },
      keyExcerpt: {
        vi: 'Các kênh tri giác thị giác và thính giác có dung lượng độc lập nhưng bổ trợ lẫn nhau khi xử lý thông tin.',
        en: 'Visual and verbal channels operate with separate bandwidths yet synergize during complex recall.',
      },
    },
    {
      id: 'res-web-quizlet',
      title: {
        vi: 'Bộ thẻ Quizlet: PSYC101 Chapter 4 Key Terms',
        en: 'Quizlet Deck: PSYC101 Chapter 4 Key Terms',
      },
      sourceType: 'web',
      sourceTag: {
        vi: 'Công cụ ôn tập',
        en: 'Study Tool',
      },
      urlOrPath: 'https://quizlet.com/cards/psyc101-ch4-dual-coding',
      description: {
        vi: '24 flashcards chứa định nghĩa: Sensory Buffer, Central Executive, Episodic Buffer.',
        en: '24 digital flashcards for Sensory Buffer, Central Executive, and Episodic Buffer.',
      },
    },
  ],
  UX_DESIGN: [
    {
      id: 'res-dump-notes',
      title: {
        vi: 'Ghi chép Brain Dump lúc 08:30: Luồng Checkout tối giản',
        en: 'Brain Dump Notes (08:30): Minimal Checkout Flow',
      },
      sourceType: 'brain_dump',
      sourceTag: {
        vi: 'Ghi chép tự do [08:30]',
        en: 'Freeform Dump [08:30]',
      },
      urlOrPath: 'local://braindump/notes-0830',
      description: {
        vi: 'Ý tưởng ban đầu: Giữ bảng màu pastel ấm sồi, nút CTA to rõ, tự động điền địa chỉ qua GPS.',
        en: 'Initial spark: Warm oak pastel palette, spacious primary CTA, automatic address autofill.',
      },
      keyExcerpt: {
        vi: '"Cần giảm tối đa việc bắt người dùng gõ phím trên màn hình mobile nhỏ."',
        en: '"Eliminate redundant mobile typing; collapse billing into 1 clean progressive sheet."',
      },
    },
    {
      id: 'res-web-nngroup',
      title: {
        vi: 'Nielsen Norman Group: Checkout UX Best Practices',
        en: 'Nielsen Norman Group: Checkout UX Best Practices',
      },
      sourceType: 'web',
      sourceTag: {
        vi: 'Tiêu chuẩn ngành UX',
        en: 'Industry UX Standard',
      },
      urlOrPath: 'https://nngroup.com/articles/checkout-ux-guidelines/',
      description: {
        vi: 'Hướng dẫn thiết kế luồng thanh toán giảm 40% ma sát nhận thức từ nhóm chuyên gia Jakob Nielsen.',
        en: 'Evidence-based design guidelines for eliminating friction in mobile payment tunnels.',
      },
      keyExcerpt: {
        vi: 'Không ép người dùng đăng ký tài khoản trước khi mua (Guest Checkout is mandatory).',
        en: 'Always provide a prominent Guest Checkout option before asking for credentials.',
      },
    },
    {
      id: 'res-web-mobbin',
      title: {
        vi: 'Mobbin Design Patterns: Minimalist Mobile Checkouts',
        en: 'Mobbin Design Patterns: Minimalist Mobile Checkouts',
      },
      sourceType: 'web',
      sourceTag: {
        vi: 'Thư viện UI/UX thực tế',
        en: 'Real-world UI Library',
      },
      urlOrPath: 'https://mobbin.com/browse/ios/flows/checkout',
      description: {
        vi: 'Hơn 40 mẫu wireframe checkout thực tế từ các ứng dụng Apple Design Award.',
        en: 'Over 40 verified checkout wireflows from Apple Design Award winning apps.',
      },
    },
  ],
  GER101: [
    {
      id: 'res-lms-ger',
      title: {
        vi: 'Canvas LMS: GER101 Unit 3 - Vocab List & Audio',
        en: 'Canvas LMS: GER101 Unit 3 - Vocab List & Audio',
      },
      sourceType: 'lms',
      sourceTag: {
        vi: 'Canvas LMS [GER101]',
        en: 'Canvas LMS [GER101]',
      },
      urlOrPath: 'https://canvas.edu/courses/ger101/assignments/unit3',
      description: {
        vi: '18 từ vựng chủ đề môi trường (Umweltschutz, Erneuerbare Energien) và file audio phát âm chuẩn.',
        en: '18 environmental vocabulary terms (Umweltschutz, Renewable Energy) with native audio files.',
      },
      keyExcerpt: {
        vi: 'Hạn nộp bài kiểm tra trắc nghiệm từ vựng: 17:00 Ngày mai.',
        en: 'Quiz deadline for vocabulary mastery: 17:00 Tomorrow.',
      },
    },
    {
      id: 'res-web-dw',
      title: {
        vi: 'Deutsche Welle (DW): B2 Umwelt & Nachhaltigkeit',
        en: 'Deutsche Welle (DW): B2 Environment & Sustainability',
      },
      sourceType: 'web',
      sourceTag: {
        vi: 'Ngữ liệu tiếng Đức chuẩn',
        en: 'Authentic German Media',
      },
      urlOrPath: 'https://learngerman.dw.com/de/b2-umwelt',
      description: {
        vi: 'Các bài báo ngắn song ngữ B2 kèm bài tập nghe hiểu câu hỏi trắc nghiệm.',
        en: 'B2 articles with synchronized audio and practical contextual exercises.',
      },
    },
  ],
};

export const INITIAL_POPUP_QUESTIONS: Record<
  string,
  { vi: string[]; en: string[] }
> = {
  PSYC101: {
    vi: [
      'Tóm tắt 3 ý cốt lõi của Chương 4 từ tài liệu Canvas LMS?',
      'Lý thuyết mã hóa kép (Dual-Coding) giải thích điều gì?',
      'Trong đề cương đính kèm, bài tập yêu cầu nộp lúc mấy giờ?',
      'Sự khác biệt giữa Phonological Loop và Visuo-Spatial Sketchpad?',
    ],
    en: [
      'Summarize 3 core points of Chapter 4 from Canvas LMS?',
      'What does Paivio’s Dual-Coding Theory explain?',
      'What is the submission deadline in the attached syllabus?',
      'Difference between Phonological Loop and Visuo-Spatial Sketchpad?',
    ],
  },
  UX_DESIGN: {
    vi: [
      'Từ ghi chép Brain Dump 08:30, cần lưu ý gì khi vẽ checkout?',
      'Nguyên tắc vàng của NN/g để giảm bỏ rơi giỏ hàng?',
      'Gợi ý cấu trúc 3 màn hình tối giản cho phiên 25 phút này?',
      'Cách lồng Apple Pay/Google Pay vào wireframe?',
    ],
    en: [
      'What key notes from the 08:30 Brain Dump apply to checkout?',
      'What is NN/g’s golden rule to reduce cart abandonment?',
      'Suggest a 3-screen minimalist wireflow for this 25m session?',
      'How to integrate Apple Pay/Google Pay into low-fidelity flow?',
    ],
  },
  GER101: {
    vi: [
      '18 từ vựng trong Canvas LMS xoay quanh chủ đề nào?',
      'Gợi ý 3 câu ví dụ thì Perfekt với từ Umweltschutz?',
      'Mẹo nhớ giống từ der/die/das cho các từ vựng này?',
    ],
    en: [
      'What environmental theme do the 18 Canvas LMS words cover?',
      'Give 3 sample sentences in Perfekt tense with Umweltschutz?',
      'Tips for remembering gender articles (der/die/das)?',
    ],
  },
};

export function getTaskKnowledgeKey(task?: Task): string {
  if (!task) return 'PSYC101';
  if (task.courseCode === 'PSYC101' || task.title.en.toLowerCase().includes('psych')) {
    return 'PSYC101';
  }
  if (task.courseCode === 'GER101' || task.title.en.toLowerCase().includes('german')) {
    return 'GER101';
  }
  if (
    task.source === 'brain_dump' ||
    task.title.en.toLowerCase().includes('wireframe') ||
    task.title.en.toLowerCase().includes('ux') ||
    task.title.vi.toLowerCase().includes('phác thảo')
  ) {
    return 'UX_DESIGN';
  }
  return 'default';
}

export function generateGroundedAnswer(
  query: string,
  task: Task | undefined,
  language: Language
): {
  text: string;
  source: { vi: string; en: string };
  followUps?: string[];
} {
  const q = query.toLowerCase();
  const key = getTaskKnowledgeKey(task);

  // PSYC101 queries
  if (key === 'PSYC101' || q.includes('chương 4') || q.includes('chapter 4') || q.includes('mã hóa kép') || q.includes('dual')) {
    if (q.includes('tóm tắt') || q.includes('summary') || q.includes('3 ý') || q.includes('cốt lõi')) {
      return {
        text:
          language === 'vi'
            ? 'Dựa trên Mô-đun Canvas LMS & Slide bài giảng PSYC101:\n1. Trí nhớ làm việc (Working Memory) có dung lượng giới hạn (khoảng 4-7 đơn vị thông tin).\n2. Lý thuyết mã hóa kép (Paivio): Con người xử lý thông tin qua 2 kênh độc lập: Kênh Ngôn ngữ (Verbal) và Kênh Thị giác (Visual).\n3. Tải nhận thức (Cognitive Load): Kết hợp hình vẽ sơ đồ với từ khóa ngắn giúp ghi nhớ sâu hơn mà không làm nghẽn bộ nhớ làm việc.'
            : 'Based on Canvas LMS Module & PSYC101 Slides:\n1. Working Memory has limited capacity (around 4-7 chunks of active data).\n2. Paivio’s Dual-Coding: Humans process knowledge across two distinct channels: Verbal and Visual.\n3. Cognitive Load: Pairing diagrams with concise keywords improves retention without saturating working memory bandwidth.',
        source: {
          vi: 'Canvas LMS [PSYC101] • Slide bài giảng 14-22',
          en: 'Canvas LMS [PSYC101] • Lecture Slides 14-22',
        },
        followUps:
          language === 'vi'
            ? ['Bài tập cần nộp lúc mấy giờ?', 'Cách áp dụng mã hóa kép vào bài tập hôm nay?']
            : ['When is the assignment due?', 'How to apply dual-coding to today’s task?'],
      };
    }

    if (q.includes('hạn') || q.includes('giờ') || q.includes('deadline') || q.includes('nộp') || q.includes('due')) {
      return {
        text:
          language === 'vi'
            ? 'Theo thông báo trên Canvas LMS và Đề cương đính kèm:\n• Hạn nộp bài tóm tắt: 23:59 Hôm nay.\n• Hình thức: Nộp đoạn văn tóm tắt 300 từ trực tiếp trên cổng Canvas Assignment.\n• Điểm số: Chiếm 5% điểm chuyên cần & hiểu bài.'
            : 'According to Canvas LMS portal and attached syllabus:\n• Submission Deadline: 23:59 Today.\n• Format: 300-word written summary submitted via Canvas Assignment portal.\n• Weight: 5% of midterm participation grade.',
        source: {
          vi: 'Canvas LMS & Tệp De_cuong_Tam_ly_hoc_Ch4.pdf',
          en: 'Canvas LMS & De_cuong_Tam_ly_hoc_Ch4.pdf',
        },
      };
    }

    if (q.includes('phonological') || q.includes('visuo') || q.includes('khác nhau') || q.includes('difference')) {
      return {
        text:
          language === 'vi'
            ? 'Trích xuất từ giáo trình PSYC101:\n• Phonological Loop (Vòng ngữ âm): Lưu trữ và nhắc lại âm thanh, ngôn ngữ nói (ví dụ nhẩm thầm số điện thoại trong đầu).\n• Visuo-Spatial Sketchpad (Bảng phác thị giác-không gian): Lưu hình dạng, màu sắc và vị trí trong không gian (ví dụ tưởng tượng đường về nhà).\n💡 Hai thành phần này do Central Executive điều phối.'
            : 'Extracted from PSYC101 textbook:\n• Phonological Loop: Retains speech-based sound and verbal rehearsal (e.g. whispering a phone number).\n• Visuo-Spatial Sketchpad: Retains visual objects, shapes, and spatial layout (e.g. mental map of a room).\n💡 Both modules are regulated by the Central Executive.',
        source: {
          vi: 'Giáo trình Baddeley (1974) • Slide 18 Canvas LMS',
          en: 'Baddeley Working Memory Model (1974) • Slide 18 Canvas',
        },
      };
    }
  }

  // UX Wireframing queries
  if (key === 'UX_DESIGN' || q.includes('wireframe') || q.includes('checkout') || q.includes('braindump')) {
    if (q.includes('braindump') || q.includes('ghi chép') || q.includes('08:30') || q.includes('note')) {
      return {
        text:
          language === 'vi'
            ? 'Ghi chép tự do Brain Dump lúc 08:30 của bạn ghi nhận 3 yêu cầu cốt lõi:\n1. Màn hình thanh toán phải triệt tiêu phân tâm, không có menu hay pop-up quảng cáo.\n2. Tích hợp thanh toán nhanh Apple Pay / Google Pay làm lựa chọn ưu tiên ở đầu.\n3. Form điền địa chỉ tối giản, tự động đề xuất theo định vị GPS để người dùng đỡ phải gõ phím.'
            : 'Your 08:30 Brain Dump notes highlight 3 core tenets:\n1. Distraction-free checkout tunnel devoid of external menus or promo banners.\n2. One-click Express Pay (Apple Pay / Google Pay) featured prominently at the top.\n3. Compact address field with GPS autocompletion to prevent redundant mobile typing.',
        source: {
          vi: 'Brain Dump • Dòng suy nghĩ tự do ghi lúc 08:30',
          en: 'Brain Dump • Mental stream recorded at 08:30',
        },
      };
    }

    if (q.includes('nn/g') || q.includes('nielsen') || q.includes('nguyên tắc') || q.includes('heuristic')) {
      return {
        text:
          language === 'vi'
            ? 'Theo nghiên cứu của Nielsen Norman Group (NN/g):\n• Cho phép thanh toán Khách (Guest Checkout) mà không bắt buộc tạo tài khoản.\n• Giữ toàn bộ tóm tắt đơn hàng (tổng tiền, phí ship) hiển thị cố định ở chân màn hình.\n• Giảm số bước điền thông tin xuống tối đa 2 bước trên thiết bị di động.'
            : 'According to Nielsen Norman Group (NN/g) benchmarks:\n• Never mandate account registration before purchasing (Enforce Guest Checkout).\n• Maintain sticky order summary showing total and shipping transparently.\n• Cap mobile checkout progression to at most 2 digestible steps.',
        source: {
          vi: 'Tài liệu chuẩn UX E-commerce • Nielsen Norman Group',
          en: 'E-commerce UX Guidelines • Nielsen Norman Group',
        },
      };
    }
  }

  // German GER101 queries
  if (key === 'GER101' || q.includes('german') || q.includes('đức') || q.includes('từ vựng')) {
    return {
      text:
        language === 'vi'
          ? 'Trích xuất từ Canvas LMS GER101:\n• 18 từ vựng tập trung vào "Umweltschutz & Nachhaltigkeit" (Bảo vệ môi trường & Phát triển bền vững).\n• Ví dụ trọng tâm: "die Mülltrennung" (phân loại rác), "die erneuerbaren Energien" (năng lượng tái tạo).\n• Hạn nộp bài kiểm tra: 17:00 Ngày mai.'
          : 'Extracted from Canvas LMS GER101:\n• 18 vocabulary cards focused on "Umweltschutz & Nachhaltigkeit" (Environment & Sustainability).\n• Core terms: "die Mülltrennung" (waste separation), "die erneuerbaren Energien" (renewables).\n• Quiz submission deadline: 17:00 Tomorrow.',
      source: {
        vi: 'Canvas LMS [GER101] • Danh mục từ vựng Unit 3',
        en: 'Canvas LMS [GER101] • Unit 3 Vocabulary Sheet',
      },
    };
  }

  // Generic fallback with grounded contextual response
  return {
    text:
      language === 'vi'
        ? `Mimi đã tra cứu tài nguyên từ Canvas LMS và Ghi chép Brain Dump:\nĐối với tác vụ này, hãy chia nhỏ mục tiêu thành từng chặng 10-15 phút. Bạn có thể mở mục "Tài nguyên học thuật" bên dưới để đọc tài liệu gốc, hoặc áp dụng phương pháp Pomodoro + Active Recall để tiếp thu nhanh nhất.`
        : `Mimi looked up your Canvas LMS and Brain Dump repositories:\nFor this task, break down milestones into 10-15m intervals. Review the curated academic resources below or apply the Pomodoro + Active Recall technique to absorb information deeply.`,
    source: {
      vi: 'Kho dữ liệu LMS & Ghi chép cá nhân',
      en: 'LMS Repository & Personal Brain Dump',
    },
    followUps:
      language === 'vi'
        ? ['Tóm tắt ngắn gọn phương pháp làm?', 'Các trang web hữu ích nhất?']
        : ['Quick summary of methodology?', 'Most useful curated websites?'],
  };
}
