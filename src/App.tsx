/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, Language, Task, SmartWatchBiometrics, WorkTreeDraft } from './types';
import { INITIAL_TASKS } from './data/content';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ScreenSwitcherBar } from './components/ScreenSwitcherBar';
import { DumpAmbientHomeScreen } from './components/DumpAmbientHomeScreen';
import { PersonaQnAScreen } from './components/PersonaQnAScreen';
import { WorkloadOverviewScreen } from './components/WorkloadOverviewScreen';
import { FocusTimerScreen } from './components/FocusTimerScreen';
import { BreakRestScreen } from './components/BreakRestScreen';
import { ReflectionMirrorScreen } from './components/ReflectionMirrorScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dump-ambient-home');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mimi_lang');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch {}
    return 'vi';
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('mimi_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    return INITIAL_TASKS[0]?.id || null;
  });

  const [workTreeDraft, setWorkTreeDraft] = useState<WorkTreeDraft | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mimi_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  const handleSaveWorkTreeDraft = (draft: WorkTreeDraft) => {
    setWorkTreeDraft(draft);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === draft.rootTaskId || t.id === activeTaskId) {
          const totalMin = draft.branches.reduce((sum, b) => sum + b.estimatedMin, 0);
          return {
            ...t,
            title: draft.rootTaskTitle,
            durationMin: totalMin,
            workTree: draft,
            currentBranchIndex: 0,
            completedBranchIndices: [],
            status: 'in_progress',
          };
        }
        return t;
      })
    );
  };

  const handleSelectTask = (task: Task) => {
    setActiveTaskId(task.id);
    if (task.workTree) {
      setWorkTreeDraft(task.workTree);
      handleNavigate('workload-overview');
    } else {
      handleNavigate('persona-qna');
    }
  };

  const handleCompleteBranch = (branchIndex: number) => {
    if (!activeTaskId) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === activeTaskId) {
          const currentCompleted = t.completedBranchIndices || [];
          const updatedCompleted = currentCompleted.includes(branchIndex)
            ? currentCompleted
            : [...currentCompleted, branchIndex];
          return {
            ...t,
            status: 'in_progress',
            completedBranchIndices: updatedCompleted,
          };
        }
        return t;
      })
    );
  };

  const handleAdvanceToNextBranch = () => {
    if (!activeTaskId) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === activeTaskId) {
          const nextIdx = (t.currentBranchIndex ?? 0) + 1;
          return {
            ...t,
            currentBranchIndex: nextIdx,
            status: 'in_progress',
          };
        }
        return t;
      })
    );
    handleNavigate('one-next-action-focus');
  };

  const handleCompleteAllBranches = () => {
    if (!activeTaskId) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === activeTaskId) {
          const totalBranches = t.workTree?.branches.length || 3;
          const allIndices = Array.from({ length: totalBranches }, (_, i) => i);
          return {
            ...t,
            status: 'completed',
            completedBranchIndices: allIndices,
          };
        }
        return t;
      })
    );
    handleNavigate('dump-ambient-home');
  };

  const handleSaveAndReturnHome = () => {
    if (activeTaskId) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === activeTaskId) {
            return {
              ...t,
              status: 'in_progress',
            };
          }
          return t;
        })
      );
    }
    handleNavigate('dump-ambient-home');
  };

  // Smart Watch live biometrics state
  const [biometrics, setBiometrics] = useState<SmartWatchBiometrics>({
    connected: true,
    deviceName: 'Apple Watch Series 9',
    heartRate: 72,
    stressScore: 28,
    stressLevel: 'low',
    battery: 88,
    lastSync: 'Vừa xong',
  });

  const handleUpdateBiometrics = (bio: Partial<SmartWatchBiometrics>) => {
    setBiometrics((prev) => ({ ...prev, ...bio }));
  };

  // Sync with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validScreens: ScreenId[] = [
        'dump-ambient-home',
        'persona-qna',
        'workload-overview',
        'one-next-action-focus',
        'break-soothing-rest',
        'reflection-study-mirror',
      ];
      if (validScreens.includes(hash as ScreenId)) {
        setCurrentScreen(hash as ScreenId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.location.hash = `#${screen}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('mimi_lang', lang);
    } catch {}
  };

  const handleAddTask = (
    text: string,
    attachmentName?: string,
    categoryText?: { en: string; vi: string }
  ) => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: { en: text, vi: text },
      durationMin: 25,
      category: categoryText || {
        en: attachmentName ? 'Document Study' : 'Brain Dump Idea',
        vi: attachmentName ? 'Tài liệu học tập' : 'Ý tưởng tự do',
      },
      description: {
        en: attachmentName
          ? `Extracted by AI from document: ${attachmentName}`
          : 'Extracted from mindful thoughts stream',
        vi: attachmentName
          ? `AI trích xuất từ tài liệu: ${attachmentName}`
          : 'Trích xuất từ dòng suy nghĩ tự do',
      },
      source: 'brain_dump',
      dumpOrigin: {
        en: attachmentName ? `Doc: ${attachmentName}` : 'Freeform notes (Just now)',
        vi: attachmentName ? `Tài liệu: ${attachmentName}` : 'Ghi chép tự do (Vừa xong)',
      },
      attachmentName,
      status: 'pending',
    };
    setTasks((prev) => [newTask, ...prev]);
    setActiveTaskId(newTask.id);
  };

  return (
    <div className="min-h-screen bg-[#fff9ed] text-[#1d1c14] flex flex-col items-center selection:bg-[#c6e8c9]">
      {/* Fixed Top Header */}
      <Header
        currentScreen={currentScreen}
        language={language}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
        biometrics={biometrics}
      />

      {/* Main Container */}
      <main className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 pb-24 flex flex-col flex-1">
        {/* Subtle Screen Selector Bar for fast navigation */}
        <div className="my-2">
          <ScreenSwitcherBar
            currentScreen={currentScreen}
            onSelectScreen={handleNavigate}
            language={language}
          />
        </div>

        {/* Dynamic Screen Renderer */}
        <div className="w-full flex-1">
          {currentScreen === 'dump-ambient-home' && (
            <DumpAmbientHomeScreen
              onNavigate={handleNavigate}
              language={language}
              tasks={tasks}
              onAddTask={handleAddTask}
              onSelectTask={handleSelectTask}
              activeTaskId={activeTaskId}
              biometrics={biometrics}
              onUpdateBiometrics={handleUpdateBiometrics}
            />
          )}

          {currentScreen === 'persona-qna' && (
            <PersonaQnAScreen
              onNavigate={handleNavigate}
              language={language}
              tasks={tasks}
              activeTask={activeTask || undefined}
              biometrics={biometrics}
              workTreeDraft={workTreeDraft || activeTask?.workTree || null}
              onSaveWorkTreeDraft={handleSaveWorkTreeDraft}
            />
          )}

          {currentScreen === 'workload-overview' && (
            <WorkloadOverviewScreen
              onNavigate={handleNavigate}
              language={language}
              biometrics={biometrics}
              workTreeDraft={workTreeDraft || activeTask?.workTree || null}
              activeTask={activeTask || undefined}
              tasks={tasks}
              onSelectTask={handleSelectTask}
              onSaveAndReturnHome={handleSaveAndReturnHome}
            />
          )}

          {currentScreen === 'one-next-action-focus' && (
            <FocusTimerScreen
              onNavigate={handleNavigate}
              language={language}
              biometrics={biometrics}
              tasks={tasks}
              activeTask={activeTask || undefined}
              onCompleteBranch={handleCompleteBranch}
              onSaveAndReturnHome={handleSaveAndReturnHome}
            />
          )}

          {currentScreen === 'break-soothing-rest' && (
            <BreakRestScreen
              onNavigate={handleNavigate}
              language={language}
              biometrics={biometrics}
              activeTask={activeTask || undefined}
              onSaveAndReturnHome={handleSaveAndReturnHome}
            />
          )}

          {currentScreen === 'reflection-study-mirror' && (
            <ReflectionMirrorScreen
              onNavigate={handleNavigate}
              language={language}
              activeTask={activeTask || undefined}
              onAdvanceToNextBranch={handleAdvanceToNextBranch}
              onCompleteAllBranches={handleCompleteAllBranches}
              onSaveAndReturnHome={handleSaveAndReturnHome}
            />
          )}
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        language={language}
      />
    </div>
  );
}
