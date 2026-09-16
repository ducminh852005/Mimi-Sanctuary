import { Task } from '../types';
import { createInitialWorkTreeDraft } from './workTreeGenerator';

export const IMAGES = {
  // Screen 1: Atmospheric botanical study room with leafy ferns & notebooks
  studyAtmosphere: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbGkXpcjXZGhc3sRlqT0bB0Omdypds-DofMDctj072qXzwUBTiOWORwmtw5_xN_yRJxq09qXj3gaPrbVatiGxC4KkEJT6z6L720Iu0c3HW5NnO38bQQMB5DTp1ceFxTW7TB25s9-YYHvFOJAVSyOzAl_WtltFGkbeKI2IOgur_sCaXVOYk-qPkWO5Ymo0WRd2oeWDVugOt31UXblIoYpAP3Ee5deqMDol52Fm3bWWdo1o-q4euZ_bv',
  // Screen 1b: Macro botanical photograph of freshly unfurled fern frond
  fernFrond: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH1qvPRJUwMFVfVkayQWgmPiYnOVkwGBq_UYaVSeSQc77fmTbPEcAdIUgkoEYzdORpXjdk8QDBO-Snt06lxJrREZ1Nwc_EB_qHr49AS7XbzqIysnVq2-InicrWVZebOl5X8aDIqGhrw6td-TMpgql24EfMO63KtLolopJoRks8sbx6EBlnDa7LkEbuvS7Bi8rC9FbuVaJMJkib-CwtO5qg96g5v9qtRAswFotsGsz7kwb0TbeLjuPa',
  // Screen 2: Warm sunlight vintage greenhouse glass windows onto study notebooks
  stillLibrary: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM1_bG0eRKJRWsD0zIc9nRk7-wT_pLEUGXZnQ2OfjPJez_RVBaISllP3dhrgHRmJzeTNQGfnZDIH-P1DEE8VZRyygJKKBIn4KzE2sfZEaNTrMZhP0DwRiFx2OsbGMcs__ocdEuEgGbZp3JBNOL44F6slB5r2bFwdPwOJmEo6oRVJpyi1_gzV4Bv6S_N4t5s5O4BOkn4FNkYD7mTg3--DREg3-oYkH4yXfWjZXJ5Szrnr1rHyriBuAd',
  // Screen 2: Macro sprout emerging in rich fertile soil
  sproutSoil: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6tWRPl6WBj1aoP1pdmdMI5SGRMLDOcWNjZct_rXryKqIUeRnVDT3E18LAtiTRZU-WfIBk_m7K0oTQhq5GxMorNoAMMOu5gywhD885NOzFc2TW1OxfSnYX2jOismpzCjUM5zom07jWObHmTQA2TEv-YpIn-MoNdnFxI5S_DOXYEz8z3bTYtAE3USNsHZO_mvSghz6K38WQzr965-WBrxt3Ug1o4-WhCCvfXRa09xCb0DzxApBmg3v6',
  // Screen 3: Close-up artistic botanical sketchpad on weathered oak desk with monstera
  oakDesk: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM7h33zm1ECB55nGXsVYcrLJc9wW9VD3jCh_64cJn7yO0ltwhu2n-WlBdCSizGRDFRLoQxThaOvf9NWhglM18NM0iYpWWnkYm17LhDIPKNX6e9e4tQWcbHhLN7OMbOz5SFM7EBtWMFou6VxY0EzvyceF9pSf5w3Q05oAJuPN-12jXXJbc3MLtckwRmzxn8nFaDXEb1hj8DGGTH-7MlZOETDmRsfLMCgo-FPrmG19Nx2T0aEPOZdBZK',
  // Screen 3b: Soft hazy sunlight canopy in slumber misty greenhouse
  canopySlumber: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSnMtW0-4nwkAT9jIBeZ3-6JrAhhaB-uW59owAlbRv7AjWzJw6PpZtmEa8pRw2kPdlqxyI_ceWedZUCvnpIMSTCKIeAEW8Wfv1GVB8IsXzk6GelCBL2nN5hxBrydwCg9BoaUp9fOq_Ixd5nEafUIHEZpYpSTTkawl-LT-SP-zgDcxHnh4b2GktmWwPlGeHSQJQEyb51qfF24L99Z0UQ-exS5Zk7sj0qe_WV_20ccecuIMndrJET8NQ',
};

const RAW_TASKS: Task[] = [
  {
    id: 't1',
    title: {
      en: 'Cognitive Psych: Chapter 4 reading',
      vi: 'Tâm lý học nhận thức: Đọc chương 4',
    },
    durationMin: 25,
    category: {
      en: 'Deep reading',
      vi: 'Đọc sâu',
    },
    courseCode: 'PSYC101',
    source: 'lms',
    deadline: {
      en: '23:59 Today',
      vi: '23:59 Hôm nay',
    },
    description: {
      en: 'Dual-coding theory and working memory constraints summary',
      vi: 'Lý thuyết mã hóa kép & tóm tắt giới hạn bộ nhớ làm việc',
    },
    note: {
      en: 'Canvas LMS Assignment',
      vi: 'Bài tập Canvas LMS',
    },
    status: 'pending',
  },
  {
    id: 't2',
    title: {
      en: 'Wireframe checkout sanctuary (End-to-End)',
      vi: 'Phác thảo Wireframe checkout sanctuary (Toàn diện)',
    },
    durationMin: 80,
    category: {
      en: 'Creative flow',
      vi: 'Dòng chảy sáng tạo',
    },
    source: 'brain_dump',
    dumpOrigin: {
      en: 'Freeform notes (08:30)',
      vi: 'Ghi chép tự do (08:30)',
    },
    description: {
      en: 'Deep 80m project split into 3 calm 20-30m branches: Architecture (25m), Wireframing (30m), Heuristic Audit (25m)',
      vi: 'Tác vụ sâu 80 phút (1h20m) được chẻ thành 3 nhánh 20-30 phút: Kiến trúc luồng (25m), Vẽ Wireframe (30m), Đúc kết & Xuất file (25m)',
    },
    note: {
      en: 'Brain Dump • 80m branched into 20-30m sprints',
      vi: 'Ghi chép tự do • 1h20m tách 3 nhánh 20-30p',
    },
    status: 'pending',
  },
  {
    id: 't3',
    title: {
      en: 'German lexical review (B2)',
      vi: 'Ôn tập từ vựng tiếng Đức (B2)',
    },
    durationMin: 15,
    category: {
      en: 'Spaced interval',
      vi: 'Lặp lại ngắt quãng',
    },
    courseCode: 'GER101',
    source: 'lms',
    deadline: {
      en: '17:00 Tomorrow',
      vi: '17:00 Ngày mai',
    },
    description: {
      en: '18 spaced-repetition cards covering environmental phrases',
      vi: '18 thẻ lặp lại ngắt quãng về chủ đề cụm từ môi trường',
    },
    note: {
      en: 'Canvas LMS Assignment',
      vi: 'Bài tập Canvas LMS',
    },
    status: 'pending',
  },
  {
    id: 't4',
    title: {
      en: 'Conservatory botanical index mapping',
      vi: 'Phân loại danh mục thực vật vườn kính',
    },
    durationMin: 20,
    category: {
      en: 'Cataloging',
      vi: 'Phân loại ý tưởng',
    },
    source: 'brain_dump',
    dumpOrigin: {
      en: 'Voice recording memo',
      vi: 'Ghi âm giọng nói',
    },
    description: {
      en: 'Mapping botanical species categories for tranquil navigation',
      vi: 'Sơ đồ cây loài thảo mộc cho điều hướng thanh tịnh',
    },
    note: {
      en: 'Personal Brain Dump',
      vi: 'Từ Ghi chép tự do',
    },
    status: 'pending',
  },
];

export const INITIAL_TASKS: Task[] = RAW_TASKS.map((t) => {
  const tree = createInitialWorkTreeDraft(t);
  return {
    ...t,
    workTree: tree,
    currentBranchIndex: 0,
    completedBranchIndices: [],
  };
});

export const REFLECTION_QUOTES = {
  grounded: {
    en: '“You created space for visual clarity today without hurry.”',
    vi: '“Bạn đã tạo ra không gian cho sự sáng tỏ thị giác hôm nay mà không hề vội vã.”',
  },
  light: {
    en: '“Clear thoughts move softly like morning air through the conservatory leaves.”',
    vi: '“Những suy nghĩ trong trẻo chuyển động nhẹ nhàng tựa làn gió sớm qua tán lá vườn ươm.”',
  },
  tired: {
    en: '“Rest is an essential part of learning; your seeds will anchor peacefully tonight.”',
    vi: '“Nghỉ ngơi là một phần cốt lõi của học hỏi; những hạt giống của bạn sẽ bén rễ yên bình đêm nay.”',
  },
};
