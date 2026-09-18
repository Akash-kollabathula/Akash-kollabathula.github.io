import React, { useState, useEffect } from 'react';
import { CheckCircle2, Play, RefreshCw, Cpu, Check, Terminal, ExternalLink } from 'lucide-react';
import { terminalAudio } from '../utils/soundEffects';

interface TestCase {
  id: string;
  project: string;
  file: string;
  title: string;
  status: 'running' | 'passed' | 'pending';
  duration?: number;
  assertions: number;
}

const INITIAL_TESTS: TestCase[] = [
  {
    id: 't1',
    project: 'chromium',
    file: 'tests/e2e/auth/login-pom.spec.ts:14',
    title: 'Builder & Client Role-Based Authentication via Custom Fixtures',
    status: 'pending',
    assertions: 4,
  },
  {
    id: 't2',
    project: 'chromium',
    file: 'tests/e2e/plot/plot-management.spec.ts:28',
    title: 'Real-time Plot Search, Dynamic Availability Grid & Filters',
    status: 'pending',
    assertions: 6,
  },
  {
    id: 't3',
    project: 'firefox',
    file: 'tests/e2e/booking/reservation-workflow.spec.ts:45',
    title: 'End-to-End Client Plot Booking & Payment Agreement Flow',
    status: 'pending',
    assertions: 8,
  },
  {
    id: 't4',
    project: 'api',
    file: 'tests/api/rest/builder-contract.spec.ts:19',
    title: 'Playwright APIRequestContext 60+ REST Endpoints & JSON Schema',
    status: 'pending',
    assertions: 12,
  },
  {
    id: 't5',
    project: 'webkit',
    file: 'tests/e2e/workforce/allocation.spec.ts:52',
    title: 'Workforce Allocation, Job Scheduling & Status Real-time Sync',
    status: 'pending',
    assertions: 5,
  },
  {
    id: 't6',
    project: 'ci-gate',
    file: 'tests/gates/github-actions-pr.spec.ts:11',
    title: 'PR-Level CI/CD Quality Gate & Automated Allure Artifact Archival',
    status: 'pending',
    assertions: 3,
  },
];

export const InteractiveTestRunner: React.FC<{ onComplete?: () => void }> = () => {
  const [tests, setTests] = useState<TestCase[]>(INITIAL_TESTS);
  const [isRunning, setIsRunning] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < tests.length) {
      // Mark current as running
      setTests((prev) =>
        prev.map((t, idx) => (idx === currentIndex ? { ...t, status: 'running' } : t))
      );
      terminalAudio.playMechanicalClick('key', 0.2);

      const delay = Math.floor(Math.random() * 220) + 180;
      const timer = setTimeout(() => {
        setTests((prev) =>
          prev.map((t, idx) =>
            idx === currentIndex
              ? {
                  ...t,
                  status: 'passed',
                  duration: Math.floor(Math.random() * 110) + 130,
                }
              : t
          )
        );
        terminalAudio.playMechanicalClick('enter', 0.3);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (isRunning) {
      setIsRunning(false);
      terminalAudio.playSuccessChime();
    }
  }, [currentIndex, tests.length, isRunning]);

  const handleRerun = () => {
    terminalAudio.playButtonClick();
    setTests(INITIAL_TESTS.map((t) => ({ ...t, status: 'pending', duration: undefined })));
    setCurrentIndex(0);
    setIsRunning(true);
  };

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const totalDuration = tests.reduce((acc, t) => acc + (t.duration || 160), 0);

  return (
    <div className="p-4 bg-black/80 border border-emerald-500/40 rounded-lg font-mono text-xs space-y-3 shadow-lg select-text">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>$ npx playwright test --workers=4 --reporter=line,html</span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-yellow-400 text-[11px] font-semibold animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Executing 4 Parallel Workers...
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                All 6 Test Suites Passed!
              </span>
              <button
                onClick={handleRerun}
                className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded text-[10px] cursor-pointer"
                title="Rerun test suite"
              >
                ↻ Rerun
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-gray-400 text-[11px]">
        Running 6 tests using 4 workers • Page Object Model • Custom Fixtures • APIRequestContext
      </div>

      {/* Tests Execution List */}
      <div className="space-y-1.5 pt-1">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`flex items-start justify-between p-2 rounded border transition-all ${
              test.status === 'running'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : test.status === 'passed'
                ? 'bg-black/50 border-emerald-500/20 text-gray-300'
                : 'bg-black/20 border-gray-800 text-gray-500'
            }`}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="mt-0.5">
                {test.status === 'passed' && (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                )}
                {test.status === 'running' && (
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                )}
                {test.status === 'pending' && (
                  <div className="w-3 h-3 rounded-full border border-gray-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span
                    className={`px-1 rounded text-[10px] uppercase font-bold ${
                      test.project === 'chromium'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : test.project === 'firefox'
                        ? 'bg-orange-950 text-orange-300 border border-orange-800'
                        : test.project === 'api'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {test.project}
                  </span>
                  <span className="text-gray-200 text-[11px]">{test.title}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                  {test.file} • {test.assertions} assertions verified
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono">
              {test.status === 'passed' && (
                <span className="text-emerald-400 font-bold">{test.duration}ms</span>
              )}
              {test.status === 'running' && (
                <span className="text-cyan-400 animate-pulse">testing...</span>
              )}
              {test.status === 'pending' && <span className="text-gray-600">queued</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      {!isRunning && (
        <div className="mt-3 p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">
              ✓ {passedCount} passed ({((totalDuration / 1000) * 0.4).toFixed(2)}s)
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-cyan-300">Flakiness: 0.0%</span>
            <span className="text-gray-400">|</span>
            <span className="text-fuchsia-300">Coverage: 85%+</span>
          </div>
          <div className="text-[10px] text-gray-400">
            Artifacts: <span className="text-emerald-300">allure-report.html</span> • <span className="text-cyan-300">trace.zip</span>
          </div>
        </div>
      )}
    </div>
  );
};
