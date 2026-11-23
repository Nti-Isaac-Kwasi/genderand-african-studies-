import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  COURSE_SECTIONS,
  QUESTION_TOPICS,
  Question,
  QuestionTopic,
  SOURCE_DOCUMENT_META,
  quizQuestions,
} from '../data/questions';
import {
  GENDER_EXPLANATIONS,
  GENDER_EXPLANATION_SCOPE_NOTE,
  getIncorrectSelectionReason,
} from '../data/genderExplanations';
import {
  MarkingMode,
  PreparedQuestion,
  QuestionAnswerRecord,
  QuizConfig,
  QuizMode,
  StoredProgress,
  clearProgress,
  computeTopicBreakdown,
  getDisplayLetter,
  getFilteredSourceQuestions,
  loadProgress,
  prepareQuizSession,
  recordAttemptProgress,
  validateAnswer,
} from '../lib/quizEngine';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Download,
  Flag,
  HelpCircle,
  Layers,
  ListChecks,
  PlayCircle,
  RotateCcw,
  Shuffle,
  SkipForward,
  Timer,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/audio';

const MOTIVATIONS = [
  'KEEP GOING! SOLID PROGRESS.',
  'STRONG MOMENTUM — STAY SHARP!',
  'AFRICAN STUDIES & GENDER SCHOLAR IN THE MAKING.',
  'EXCELLENT FOCUS! KEEP BUILDING.',
  'GREAT EFFORT — REVIEW EVERY DETAIL.',
];

const INTRO_STEPS = [
  {
    icon: BookOpen,
    title: 'Sir Prince Trials',
    desc: 'Practice all 170 source-verified questions from Introduction to Gender & Introduction to African Studies.',
  },
  {
    icon: Layers,
    title: 'Topic Quizzes & Full Mocks',
    desc: 'Drill individual topics, take a 20-question sprint, or sit the complete Interim Assessment mock exam.',
  },
  {
    icon: Shuffle,
    title: 'Smart Randomisation',
    desc: 'Shuffle question sequences and answer option order while preserving exact source answer-key validation.',
  },
  {
    icon: Award,
    title: 'Instant Explanations & Reports',
    desc: 'Get immediate feedback with Gender lecture-slide explanations (Q1–158), review every response, and download your score report.',
  },
];

const DEFAULT_CONFIG: QuizConfig = {
  mode: 'full-mock',
  selectedSection: 'all',
  selectedTopic: 'all',
  randomiseQuestions: false,
  randomiseOptions: false,
  markingMode: 'immediate',
  timed: true,
  includeSourceDuplicate: false,
  sprintCount: 20,
};

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();
    const from = display;
    const delta = value - from;
    if (delta === 0) return;

    const duration = 550;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + delta * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function ScholarCrestSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      whileHover="hover"
      initial="rest"
    >
      <motion.rect
        x="3"
        y="3"
        width="30"
        height="30"
        stroke="currentColor"
        strokeWidth="2.5"
        variants={{
          rest: { rotate: 0 },
          hover: { rotate: 90, transition: { type: 'spring', stiffness: 260, damping: 18 } },
        }}
        style={{ originX: '18px', originY: '18px' }}
      />
      <motion.path
        d="M18 8L26 14V22L18 28L10 22V14L18 8Z"
        stroke="currentColor"
        strokeWidth="2.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      <motion.circle
        cx="18"
        cy="18"
        r="3"
        fill="currentColor"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.35 },
        }}
      />
    </motion.svg>
  );
}

function TimerRingSvg({
  current,
  total,
  urgent,
  warning,
}: {
  current: number;
  total: number;
  urgent: boolean;
  warning: boolean;
}) {
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? Math.max(0, Math.min(1, current / total)) : 0;
  const dashOffset = circumference * (1 - ratio);
  const strokeColor = urgent ? '#e11d48' : warning ? '#d97706' : '#2563eb';

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 shrink-0" aria-hidden="true">
      <circle
        cx="14"
        cy="14"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="3"
      />
      <motion.circle
        cx="14"
        cy="14"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="square"
        strokeDasharray={circumference}
        animate={{ strokeDashoffset: dashOffset, stroke: strokeColor }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
    </svg>
  );
}

function AnimatedCheckSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      />
    </svg>
  );
}

function AnimatedCrossSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <motion.path
        d="M6 6l12 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <motion.path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: 0.08, ease: 'easeOut' }}
      />
    </svg>
  );
}

function AccuracyRingSvg({ percentage }: { percentage: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const dashOffset = circumference * (1 - clamped / 100);
  const strokeColor = clamped >= 75 ? '#059669' : clamped >= 50 ? '#2563eb' : '#d97706';

  return (
    <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
        <rect
          x="6"
          y="6"
          width="108"
          height="108"
          fill="none"
          stroke="#111827"
          strokeWidth="3"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 leading-none">
          <AnimatedNumber value={clamped} suffix="%" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">
          Score
        </span>
      </div>
    </div>
  );
}

function TypewriterText({ text }: { text: string; key?: string }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!text) return;

    const intervalMs = Math.max(10, Math.min(24, Math.floor(1400 / text.length)));
    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= text.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [text]);

  const isTyping = visibleCount < text.length;

  return (
    <div className="mb-8">
      <h2
        aria-label={text}
        onClick={() => {
          if (isTyping) setVisibleCount(text.length);
        }}
        title={isTyping ? 'Click to reveal full question' : undefined}
        className={cn(
          'text-xl sm:text-2xl font-semibold leading-relaxed text-gray-900 min-h-[3.5rem] transition-colors',
          isTyping && 'cursor-pointer'
        )}
      >
        <span>{text.slice(0, visibleCount)}</span>
        {isTyping && (
          <motion.span
            aria-hidden="true"
            animate={{ opacity: [1, 0, 1], backgroundColor: ['#2563eb', '#111827', '#2563eb'] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="inline-block w-[3px] h-[1.1em] bg-blue-600 ml-1 align-text-bottom"
          />
        )}
      </h2>
      {isTyping && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          className="text-[11px] font-semibold text-gray-500 mt-1.5"
        >
          Tap question text to reveal immediately
        </motion.p>
      )}
    </div>
  );
}

function IntroSequence({
  onComplete,
  soundEnabled,
}: {
  onComplete: () => void;
  soundEnabled: boolean;
  key?: string;
}) {
  const [step, setStep] = useState(0);

  const safePlay = (type: 'click' | 'correct' | 'incorrect' | 'timeout') => {
    if (soundEnabled) playSound(type);
  };

  const nextStep = () => {
    safePlay('click');
    if (step < INTRO_STEPS.length) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const skipIntro = () => {
    safePlay('click');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.03, y: -16 }}
      transition={{ type: 'spring', damping: 22, stiffness: 120 }}
      className="w-full max-w-2xl mx-auto bg-white border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] p-6 sm:p-12 relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={skipIntro}
          className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors flex items-center gap-1 cursor-pointer"
        >
          Skip <SkipForward className="w-4 h-4" />
        </button>
      </div>

      <div className="relative min-h-[290px] flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col items-center justify-center"
          >
            {step < INTRO_STEPS.length ? (
              <>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-none border-2 border-gray-900 flex items-center justify-center mb-6 shadow-[6px_6px_0_0_#111827]">
                  {(() => {
                    const Icon = INTRO_STEPS[step].icon;
                    return <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />;
                  })()}
                </div>
                <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
                  {INTRO_STEPS[step].title}
                </h2>
                <p className="text-base sm:text-lg font-medium text-gray-700 max-w-md">
                  {INTRO_STEPS[step].desc}
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-none border-2 border-gray-900 flex items-center justify-center mb-6 shadow-[6px_6px_0_0_#111827]">
                  <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
                  Ready for the Trials?
                </h2>
                <p className="text-base sm:text-lg font-medium text-gray-700 max-w-md">
                  Select a full mock exam, focus on a specific topic, or run a quick 20-question sprint.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-gray-100">
        <div className="flex gap-2">
          {[...Array(INTRO_STEPS.length + 1)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 border-2 border-gray-900 transition-all',
                step === i ? 'w-12 bg-blue-600 shadow-[2px_2px_0_0_#111827]' : 'w-3 bg-gray-200'
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={nextStep}
          className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold tracking-wide border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer"
        >
          {step < INTRO_STEPS.length ? (
            <>
              Next <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue to Dashboard <PlayCircle className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function formatSeconds(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function QuizApp() {
  const [gameState, setGameState] = useState<'home' | 'intro' | 'playing' | 'break' | 'finished'>('home');
  const [config, setConfig] = useState<QuizConfig>(DEFAULT_CONFIG);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progress, setProgress] = useState<StoredProgress>(() => loadProgress());
  const [confirmResetProgress, setConfirmResetProgress] = useState(false);

  // Active Session State
  const [sessionQuestions, setSessionQuestions] = useState<PreparedQuestion[]>([]);
  const [sessionLabel, setSessionLabel] = useState('Full Mock Examination');
  const [sessionMode, setSessionMode] = useState<QuizMode>('full-mock');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<Record<string, QuestionAnswerRecord>>({});
  const [examSelections, setExamSelections] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [streak, setStreak] = useState(0);
  const [justScored, setJustScored] = useState(false);

  // Timers
  const [timeLeft, setTimeLeft] = useState(30);
  const [examTimeLeft, setExamTimeLeft] = useState(0);
  const [breakTimeLeft, setBreakTimeLeft] = useState(300);

  // Review Filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'missed' | 'correct' | 'flagged'>('all');

  const safePlay = (type: 'click' | 'correct' | 'incorrect' | 'timeout') => {
    if (soundEnabled) playSound(type);
  };

  // Topic counts respecting duplicate toggle
  const topicCounts = useMemo(() => {
    const counts: Record<QuestionTopic, number> = {
      'Sex, Gender & Social Construction': 0,
      'Gender Equality, Equity & Stereotypes': 0,
      'Patriarchy & Masculinities': 0,
      'Affirmative Action & Agency': 0,
      'Legal, Policy & International Frameworks': 0,
      'African Geography & Heritage': 0,
    };
    for (const q of quizQuestions) {
      if (!config.includeSourceDuplicate && q.reviewFlag?.category === 'duplicate') continue;
      if (config.selectedSection !== 'all' && q.section !== config.selectedSection) continue;
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    }
    return counts;
  }, [config.includeSourceDuplicate, config.selectedSection]);

  const previewQuestionCount = useMemo(() => {
    const pool = getFilteredSourceQuestions(config);
    if (config.mode === 'quick-sprint') {
      return Math.min(config.sprintCount, pool.length);
    }
    return pool.length;
  }, [config]);

  const currentQuestion = sessionQuestions[currentQuestionIndex];

  // Immediate mode per-question timer
  useEffect(() => {
    if (gameState !== 'playing' || config.markingMode !== 'immediate' || !config.timed || showAnswer) {
      return;
    }
    if (timeLeft <= 0) {
      handleImmediateTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState, config.markingMode, config.timed, showAnswer, currentQuestionIndex]);

  // End-of-exam mode total exam timer
  useEffect(() => {
    if (gameState !== 'playing' || config.markingMode !== 'end-of-exam' || !config.timed) {
      return;
    }
    if (examTimeLeft <= 0) {
      submitFullExam();
      return;
    }
    const timer = setInterval(() => {
      setExamTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [examTimeLeft, gameState, config.markingMode, config.timed]);

  // Break timer
  useEffect(() => {
    if (gameState !== 'break') return;
    if (breakTimeLeft <= 0) {
      resumeFromBreak();
      return;
    }
    const timer = setInterval(() => {
      setBreakTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [breakTimeLeft, gameState]);

  const buildSessionLabel = (cfg: QuizConfig): string => {
    if (cfg.mode === 'full-mock') {
      return cfg.includeSourceDuplicate
        ? 'Full Source Mock (170 Items)'
        : 'Full Mock Examination (169 Unique)';
    }
    if (cfg.mode === 'quick-sprint') {
      return `Quick Sprint (${cfg.sprintCount} Questions)`;
    }
    if (cfg.selectedTopic !== 'all') {
      return cfg.selectedTopic;
    }
    if (cfg.selectedSection !== 'all') {
      return cfg.selectedSection;
    }
    return 'All Topics Quiz';
  };

  const launchQuiz = (overrideConfig?: QuizConfig, customQuestions?: Question[], customLabel?: string, customMode?: QuizMode) => {
    const activeCfg = overrideConfig ?? config;
    const prepared = prepareQuizSession(activeCfg, customQuestions);

    if (prepared.length === 0) {
      return;
    }

    safePlay('click');
    setSessionQuestions(prepared);
    setSessionLabel(customLabel ?? buildSessionLabel(activeCfg));
    setSessionMode(customMode ?? activeCfg.mode);
    setCurrentQuestionIndex(0);
    setAnswerRecords({});
    setExamSelections({});
    setSelectedOptionId(null);
    setShowAnswer(false);
    setShowNavigator(false);
    setConfirmExit(false);
    setStreak(0);
    setJustScored(false);
    setReviewFilter('all');
    setTimeLeft(30);
    setExamTimeLeft(prepared.length * 45);
    setGameState('playing');
  };

  const evaluateImmediateAnswer = (optionId: string) => {
    if (!currentQuestion || showAnswer || answerRecords[currentQuestion.id]) return;
    const isCorrect = validateAnswer(currentQuestion, optionId);
    safePlay(isCorrect ? 'correct' : 'incorrect');
    setSelectedOptionId(optionId);
    setShowAnswer(true);

    if (isCorrect) {
      setStreak((s) => s + 1);
      setJustScored(true);
      setTimeout(() => setJustScored(false), 900);
    } else {
      setStreak(0);
      setJustScored(false);
    }

    setAnswerRecords((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        sourceNumber: currentQuestion.sourceNumber,
        selectedOptionId: optionId,
        isCorrect,
        timedOut: false,
      },
    }));
  };

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;

    if (config.markingMode === 'immediate') {
      // Lock evaluation once answered or timed out so students cannot manipulate scores
      if (showAnswer || answerRecords[currentQuestion.id]) return;
      evaluateImmediateAnswer(optionId);
    } else {
      safePlay('click');
      setExamSelections((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    }
  };

  const handleImmediateTimeout = () => {
    if (!currentQuestion || showAnswer || answerRecords[currentQuestion.id]) return;
    safePlay('timeout');
    setShowAnswer(true);
    setStreak(0);
    setJustScored(false);
    setAnswerRecords((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        sourceNumber: currentQuestion.sourceNumber,
        selectedOptionId: null,
        isCorrect: false,
        timedOut: true,
      },
    }));
  };

  // Keyboard shortcuts during active quiz (A-D / 1-4 to select & immediately check, Enter to continue after explanation)
  useEffect(() => {
    if (gameState !== 'playing' || confirmExit || !currentQuestion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toUpperCase();
      const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };

      if (key in letterMap) {
        const idx = letterMap[key];
        const opt = currentQuestion.displayOptions[idx];
        const isLocked =
          config.markingMode === 'immediate' &&
          (showAnswer || Boolean(answerRecords[currentQuestion.id]));
        if (opt && !isLocked) {
          e.preventDefault();
          handleOptionSelect(opt.id);
        }
      } else if (e.key === 'Enter' && config.markingMode === 'immediate' && showAnswer) {
        e.preventDefault();
        nextImmediateQuestion();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, confirmExit, currentQuestion, config.markingMode, showAnswer, answerRecords]);

  const finishImmediateQuiz = () => {
    const updatedProgress = recordAttemptProgress(sessionMode, sessionLabel, sessionQuestions, answerRecords);
    setProgress(updatedProgress);
    setGameState('finished');
  };

  const nextImmediateQuestion = () => {
    safePlay('click');
    if (currentQuestionIndex < sessionQuestions.length - 1) {
      if (sessionQuestions.length > 20 && (currentQuestionIndex + 1) % 20 === 0) {
        setBreakTimeLeft(300);
        setGameState('break');
      } else {
        setCurrentQuestionIndex((i) => i + 1);
        setSelectedOptionId(null);
        setShowAnswer(false);
        setTimeLeft(30);
      }
    } else {
      finishImmediateQuiz();
    }
  };

  const resumeFromBreak = () => {
    safePlay('click');
    setCurrentQuestionIndex((i) => i + 1);
    setSelectedOptionId(null);
    setShowAnswer(false);
    setTimeLeft(30);
    setGameState('playing');
  };

  const submitFullExam = () => {
    const graded: Record<string, QuestionAnswerRecord> = {};
    for (const q of sessionQuestions) {
      const chosen = examSelections[q.id] ?? null;
      const isCorrect = validateAnswer(q, chosen);
      graded[q.id] = {
        questionId: q.id,
        sourceNumber: q.sourceNumber,
        selectedOptionId: chosen,
        isCorrect,
        timedOut: chosen === null,
      };
    }
    setAnswerRecords(graded);
    const updatedProgress = recordAttemptProgress(sessionMode, sessionLabel, sessionQuestions, graded);
    setProgress(updatedProgress);
    safePlay('click');
    setGameState('finished');
  };

  // Computed stats
  const immediateScore = useMemo(
    () =>
      (Object.values(answerRecords) as QuestionAnswerRecord[]).filter((r) => r.isCorrect).length,
    [answerRecords]
  );

  const resultStats = useMemo(() => {
    const total = sessionQuestions.length;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    for (const q of sessionQuestions) {
      const rec = answerRecords[q.id];
      if (!rec || rec.selectedOptionId === null) {
        unanswered++;
      } else if (rec.isCorrect) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, incorrect, unanswered, accuracy };
  }, [sessionQuestions, answerRecords]);

  const topicBreakdown = useMemo(
    () => computeTopicBreakdown(sessionQuestions, answerRecords),
    [sessionQuestions, answerRecords]
  );

  const missedQuestions = useMemo(() => {
    return sessionQuestions.filter((q) => !answerRecords[q.id]?.isCorrect);
  }, [sessionQuestions, answerRecords]);

  const filteredReviewQuestions = useMemo(() => {
    return sessionQuestions.filter((q) => {
      const rec = answerRecords[q.id];
      if (reviewFilter === 'correct') return Boolean(rec?.isCorrect);
      if (reviewFilter === 'missed') return !rec?.isCorrect;
      if (reviewFilter === 'flagged') return Boolean(q.reviewFlag);
      return true;
    });
  }, [sessionQuestions, answerRecords, reviewFilter]);

  const downloadReport = () => {
    safePlay('click');
    const lines: string[] = [
      'SIR PRINCE TRIALS — INTRODUCTION TO GENDER & AFRICAN STUDIES IA TRIALS REPORT',
      `Assessment: ${sessionLabel}`,
      `Date: ${new Date().toLocaleString()}`,
      `Marking Mode: ${config.markingMode === 'immediate' ? 'Immediate Feedback' : 'End-of-Exam'}`,
      `Credit: ${SOURCE_DOCUMENT_META.attribution}`,
      '',
      `Score: ${resultStats.correct} / ${resultStats.total} (${resultStats.accuracy}%)`,
      `Correct: ${resultStats.correct}`,
      `Incorrect: ${resultStats.incorrect}`,
      `Unanswered / Timed Out: ${resultStats.unanswered}`,
      '',
      'TOPIC BREAKDOWN:',
      ...topicBreakdown.map(
        (t) => `- ${t.topic}: ${t.correct}/${t.total} (${t.percentage}%)`
      ),
      '',
      'MISSED / INCORRECT QUESTIONS:',
    ];

    if (missedQuestions.length === 0) {
      lines.push('None — 100% accuracy achieved!');
    } else {
      for (const q of missedQuestions) {
        const rec = answerRecords[q.id];
        const chosenOpt = q.options.find((o) => o.id === rec?.selectedOptionId);
        const genderExp = GENDER_EXPLANATIONS[q.sourceNumber];
        lines.push(
          `[Source Q${q.sourceNumber}] (${q.topic}) ${q.text}`,
          `  Your Answer: ${chosenOpt ? `${chosenOpt.id}. ${chosenOpt.text}` : 'No answer'}`,
          `  Verified Answer: ${q.correctOptionId}. ${q.correctAnswerText}`
        );
        if (genderExp) {
          lines.push(
            `  Concept: ${genderExp.concept} (${genderExp.lectureReference})`,
            `  Explanation: ${genderExp.explanation}`
          );
        }
        lines.push('');
      }
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sir-prince-trials-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isMotivationTime =
    config.markingMode === 'immediate' &&
    showAnswer &&
    currentQuestionIndex > 0 &&
    (currentQuestionIndex + 1) % 5 === 0;
  const motivationMsg = MOTIVATIONS[currentQuestionIndex % MOTIVATIONS.length];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      <header className="fixed top-0 inset-x-0 h-16 border-b-2 border-gray-900 bg-white/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-50">
        <button
          type="button"
          onClick={() => {
            if (gameState === 'playing') {
              setConfirmExit(true);
            } else {
              safePlay('click');
              setGameState('home');
            }
          }}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 bg-blue-600 border-2 border-gray-900 flex items-center justify-center shadow-[3px_3px_0_0_#111827] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform">
            <ScholarCrestSvg className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-lg tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              Sir Prince Trials
            </h1>
            <p className="text-[11px] font-semibold text-gray-600 hidden sm:block">
              Introduction to Gender &amp; African Studies
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {gameState === 'home' && (
            <button
              type="button"
              onClick={() => {
                safePlay('click');
                setGameState('intro');
              }}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold border-2 border-gray-900 bg-white hover:bg-gray-100 shadow-[3px_3px_0_0_#111827] flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}

          {gameState === 'playing' && (
            <button
              type="button"
              onClick={() => setConfirmExit(true)}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold border-2 border-gray-900 bg-white hover:bg-gray-100 shadow-[3px_3px_0_0_#111827] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 border-2 border-gray-900 bg-white hover:bg-gray-100 shadow-[3px_3px_0_0_#111827] cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto min-h-screen flex flex-col justify-center overflow-x-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <IntroSequence
              key="intro"
              soundEnabled={soundEnabled}
              onComplete={() => setGameState('home')}
            />
          )}

          {gameState === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full space-y-8"
            >
              {/* Hero */}
              <div className="text-center pt-2 relative">
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider mb-5 border-2 border-gray-900 shadow-[3px_3px_0_0_#2563eb]"
                >
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 bg-blue-400 inline-block"
                  />
                  <span>{SOURCE_DOCUMENT_META.totalExtractedQuestions} Source Questions</span>
                  <span>·</span>
                  <span>{SOURCE_DOCUMENT_META.uniqueQuestionCount} Unique</span>
                  <span>·</span>
                  <span>{QUESTION_TOPICS.length} Topics</span>
                </motion.div>

                <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-5 text-gray-900">
                  Gender &amp; African Studies{' '}
                  <motion.span
                    whileHover={{ rotate: 0, scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                    className="bg-blue-600 text-white px-3 py-1 inline-block -rotate-1 border-2 border-gray-900 shadow-[4px_4px_0_0_#111827] cursor-default select-none"
                  >
                    IA Trials
                  </motion.span>
                </h2>

                <p className="text-gray-900 text-base sm:text-lg max-w-2xl mx-auto font-semibold border-2 border-gray-900 p-4 bg-white shadow-[6px_6px_0_0_#111827]">
                  Sir Prince Trials — Introduction to Gender &amp; Introduction to African Studies Interim Assessment (IA) Trial Questions &amp; Verified Answer Keys.
                </p>
              </div>

              {/* Progress Tracking Strip */}
              <div className="bg-gray-900/5 border-2 border-gray-900 p-4 sm:p-5 shadow-[6px_6px_0_0_#111827]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="grid grid-cols-3 gap-4 sm:gap-8 flex-1 min-w-[220px]">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Completed
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={progress.totalAttempts} />{' '}
                        {progress.totalAttempts === 1 ? 'Quiz' : 'Quizzes'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Mastered
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        <AnimatedNumber value={progress.masteredQuestionIds.length} /> /{' '}
                        {SOURCE_DOCUMENT_META.uniqueQuestionCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Best Full Mock
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {progress.bestMockPercentage !== null ? (
                          <AnimatedNumber value={progress.bestMockPercentage} suffix="%" />
                        ) : (
                          '—'
                        )}
                      </div>
                    </div>
                  </div>

                  {progress.totalAttempts > 0 && (
                    <div>
                      {confirmResetProgress ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setProgress(clearProgress());
                              setConfirmResetProgress(false);
                              safePlay('click');
                            }}
                            className="px-3 py-1.5 text-xs font-bold bg-gray-900 text-white border-2 border-gray-900 cursor-pointer"
                          >
                            Confirm Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmResetProgress(false)}
                            className="px-3 py-1.5 text-xs font-bold bg-white text-gray-900 border-2 border-gray-900 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmResetProgress(true)}
                          className="px-3 py-1.5 text-xs font-bold bg-white text-gray-700 hover:text-gray-900 border-2 border-gray-900 shadow-[2px_2px_0_0_#111827] cursor-pointer"
                        >
                          Reset Progress
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Assessment Builder Card */}
              <div className="bg-white border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] p-5 sm:p-8 space-y-6">
                {/* 1. Mode Selection */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                    1. Choose Assessment Mode
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'full-mock' as QuizMode,
                        title: 'Full Mock Exam',
                        sub: config.includeSourceDuplicate ? 'All 170 source items' : '169 unique questions',
                        icon: Award,
                      },
                      {
                        id: 'topic' as QuizMode,
                        title: 'Topic-Based Quiz',
                        sub: 'Drill by section or topic',
                        icon: Layers,
                      },
                      {
                        id: 'quick-sprint' as QuizMode,
                        title: 'Quick Sprint',
                        sub: '20 randomised questions',
                        icon: Zap,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = config.mode === item.id;
                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            safePlay('click');
                            setConfig((c) => ({ ...c, mode: item.id }));
                          }}
                          className={cn(
                            'relative p-4 text-left border-2 border-gray-900 transition-colors cursor-pointer flex items-start gap-3 overflow-hidden',
                            active
                              ? 'bg-blue-600 text-white shadow-[4px_4px_0_0_#111827]'
                              : 'bg-white text-gray-900 hover:bg-blue-50/60 shadow-[4px_4px_0_0_#111827]'
                          )}
                        >
                          <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold text-base">{item.title}</div>
                            <div className={cn('text-xs font-medium mt-0.5', active ? 'text-blue-100' : 'text-gray-600')}>
                              {item.sub}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Topic & Section Selector (shown when Topic mode is active) */}
                {config.mode === 'topic' && (
                  <div className="pt-4 border-t-2 border-gray-100 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                        Filter by Course Section
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            safePlay('click');
                            setConfig((c) => ({ ...c, selectedSection: 'all', selectedTopic: 'all' }));
                          }}
                          className={cn(
                            'px-3.5 py-2 text-xs sm:text-sm font-bold border-2 border-gray-900 cursor-pointer',
                            config.selectedSection === 'all'
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-gray-900 hover:bg-gray-100'
                          )}
                        >
                          All Sections ({config.includeSourceDuplicate ? 170 : 169})
                        </button>
                        {COURSE_SECTIONS.map((sec) => {
                          const count = quizQuestions.filter(
                            (q) =>
                              q.section === sec &&
                              (config.includeSourceDuplicate || q.reviewFlag?.category !== 'duplicate')
                          ).length;
                          const active = config.selectedSection === sec;
                          return (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => {
                                safePlay('click');
                                setConfig((c) => ({
                                  ...c,
                                  selectedSection: sec,
                                  selectedTopic: 'all',
                                }));
                              }}
                              className={cn(
                                'px-3.5 py-2 text-xs sm:text-sm font-bold border-2 border-gray-900 cursor-pointer',
                                active ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'
                              )}
                            >
                              {sec} ({count})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                        Select Topic
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            safePlay('click');
                            setConfig((c) => ({ ...c, selectedTopic: 'all' }));
                          }}
                          className={cn(
                            'p-3 text-left border-2 border-gray-900 flex items-center justify-between cursor-pointer',
                            config.selectedTopic === 'all'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 hover:bg-gray-50'
                          )}
                        >
                          <span className="font-bold text-sm">All Topics in Selection</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 border border-current">
                            {(Object.values(topicCounts) as number[]).reduce((a, b) => a + b, 0)} Qs
                          </span>
                        </button>

                        {QUESTION_TOPICS.map((topic) => {
                          const count = topicCounts[topic] || 0;
                          const disabled = count === 0;
                          const active = config.selectedTopic === topic;
                          const best = progress.topicBestPercentages[topic];

                          return (
                            <button
                              key={topic}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                safePlay('click');
                                setConfig((c) => ({ ...c, selectedTopic: topic }));
                              }}
                              className={cn(
                                'p-3 text-left border-2 border-gray-900 flex items-center justify-between gap-2 transition-colors',
                                disabled
                                  ? 'opacity-40 cursor-not-allowed bg-gray-100'
                                  : active
                                    ? 'bg-blue-600 text-white cursor-pointer'
                                    : 'bg-white text-gray-900 hover:bg-gray-50 cursor-pointer'
                              )}
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-sm truncate">{topic}</div>
                                {best !== undefined && (
                                  <div className={cn('text-[11px] font-semibold', active ? 'text-blue-100' : 'text-gray-500')}>
                                    Best: {best}%
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-mono font-bold px-2 py-0.5 border border-current shrink-0">
                                {count} {count === 1 ? 'Q' : 'Qs'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Quiz Options */}
                <div className="pt-4 border-t-2 border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                    2. Assessment Settings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Marking Mode */}
                    <div className="p-3.5 border-2 border-gray-900 bg-gray-900/5">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Marking &amp; Feedback
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { id: 'immediate', label: 'Immediate' },
                            { id: 'end-of-exam', label: 'End of Exam' },
                          ] as { id: MarkingMode; label: string }[]
                        ).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              safePlay('click');
                              setConfig((c) => ({ ...c, markingMode: m.id }));
                            }}
                            className={cn(
                              'py-2 px-3 text-xs sm:text-sm font-bold border-2 border-gray-900 cursor-pointer',
                              config.markingMode === m.id
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-900 hover:bg-gray-100'
                            )}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timer Toggle */}
                    <div className="p-3.5 border-2 border-gray-900 bg-gray-900/5">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Timer Mode
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            safePlay('click');
                            setConfig((c) => ({ ...c, timed: true }));
                          }}
                          className={cn(
                            'py-2 px-3 text-xs sm:text-sm font-bold border-2 border-gray-900 cursor-pointer flex items-center justify-center gap-1.5',
                            config.timed
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-gray-900 hover:bg-gray-100'
                          )}
                        >
                          <Timer className="w-4 h-4" />
                          Timed
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            safePlay('click');
                            setConfig((c) => ({ ...c, timed: false }));
                          }}
                          className={cn(
                            'py-2 px-3 text-xs sm:text-sm font-bold border-2 border-gray-900 cursor-pointer flex items-center justify-center gap-1.5',
                            !config.timed
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-gray-900 hover:bg-gray-100'
                          )}
                        >
                          <Clock className="w-4 h-4" />
                          Untimed
                        </button>
                      </div>
                    </div>

                    {/* Randomise Question Order */}
                    <button
                      type="button"
                      disabled={config.mode === 'quick-sprint'}
                      onClick={() => {
                        safePlay('click');
                        setConfig((c) => ({ ...c, randomiseQuestions: !c.randomiseQuestions }));
                      }}
                      className={cn(
                        'p-3.5 border-2 border-gray-900 flex items-center justify-between text-left transition-colors',
                        config.mode === 'quick-sprint'
                          ? 'bg-blue-50 opacity-80 cursor-not-allowed'
                          : 'bg-white hover:bg-gray-50 cursor-pointer'
                      )}
                    >
                      <div>
                        <div className="font-bold text-sm">Randomise Question Order</div>
                        <div className="text-xs text-gray-600">
                          {config.mode === 'quick-sprint'
                            ? 'Always randomised in Quick Sprint'
                            : 'Shuffle question sequence'}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'px-2.5 py-1 text-xs font-bold border-2 border-gray-900',
                          config.randomiseQuestions || config.mode === 'quick-sprint'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {config.randomiseQuestions || config.mode === 'quick-sprint' ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Randomise Option Order */}
                    <button
                      type="button"
                      onClick={() => {
                        safePlay('click');
                        setConfig((c) => ({ ...c, randomiseOptions: !c.randomiseOptions }));
                      }}
                      className="p-3.5 border-2 border-gray-900 bg-white hover:bg-gray-50 flex items-center justify-between text-left cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-sm">Randomise Answer Options</div>
                        <div className="text-xs text-gray-600">Shuffle A–D choices safely</div>
                      </div>
                      <span
                        className={cn(
                          'px-2.5 py-1 text-xs font-bold border-2 border-gray-900',
                          config.randomiseOptions
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {config.randomiseOptions ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>

                  {/* Source Duplicate Toggle */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-3 border-2 border-gray-900/30 bg-gray-50 text-xs">
                    <span className="font-semibold text-gray-700">
                      Source PDF contains an exact duplicate at Q163 (copy of Q162).
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        safePlay('click');
                        setConfig((c) => ({ ...c, includeSourceDuplicate: !c.includeSourceDuplicate }));
                      }}
                      className="px-2.5 py-1 font-bold border-2 border-gray-900 bg-white hover:bg-gray-100 cursor-pointer"
                    >
                      {config.includeSourceDuplicate
                        ? 'Showing 170 (Including Q163)'
                        : 'Deduplicated: 169 Unique'}
                    </button>
                  </div>
                </div>

                {/* Launch CTA or Empty State */}
                {previewQuestionCount === 0 ? (
                  <div className="p-6 border-2 border-gray-900 bg-amber-50 text-center space-y-3">
                    <p className="font-bold text-gray-900">
                      No questions match the current section and topic combination.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        safePlay('click');
                        setConfig((c) => ({ ...c, selectedSection: 'all', selectedTopic: 'all' }));
                      }}
                      className="px-5 py-2.5 bg-gray-900 text-white font-semibold border-2 border-gray-900 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-gray-700">
                      Ready: <span className="font-bold text-gray-900">{previewQuestionCount}</span>{' '}
                      {previewQuestionCount === 1 ? 'question' : 'questions'} ·{' '}
                      {config.markingMode === 'immediate'
                        ? config.timed
                          ? '30s per question'
                          : 'Untimed immediate review'
                        : config.timed
                          ? `${formatSeconds(previewQuestionCount * 45)} exam timer`
                          : 'Untimed full exam'}
                    </div>
                    <button
                      type="button"
                      onClick={() => launchQuiz()}
                      className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-none border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[4px] hover:translate-y-[4px] flex items-center justify-center gap-3 tracking-wide transition-all cursor-pointer"
                    >
                      <PlayCircle className="w-6 h-6" /> Start Assessment
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {gameState === 'break' && (
            <motion.div
              key="break"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-2xl mx-auto bg-white border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] p-8 sm:p-12 text-center"
            >
              <div className="w-20 h-20 bg-gray-900 rounded-none border-2 border-gray-900 flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0_0_#111827]">
                <Coffee className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                Take a Short Break
              </h2>
              <p className="text-base sm:text-lg font-bold text-gray-700 max-w-md mx-auto mb-8">
                You&apos;ve completed {currentQuestionIndex + 1} of {sessionQuestions.length} questions! Rest briefly before the next set.
              </p>

              <div className="text-5xl sm:text-6xl font-mono font-bold text-blue-600 mb-10">
                {formatSeconds(breakTimeLeft)}
              </div>

              <button
                type="button"
                onClick={resumeFromBreak}
                className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[4px] hover:translate-y-[4px] mx-auto transition-all cursor-pointer"
              >
                <SkipForward className="w-5 h-5" /> Resume Assessment
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && currentQuestion && (
            <motion.div
              key={`playing-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18 }}
              className="w-full bg-white rounded-none shadow-[6px_6px_0_0_#111827] border-2 border-gray-900 overflow-hidden relative"
            >
              {/* Exit Confirmation Overlay */}
              {confirmExit && (
                <div className="absolute inset-0 bg-white/95 z-40 flex items-center justify-center p-6">
                  <div className="max-w-md w-full border-2 border-gray-900 bg-white p-6 shadow-[6px_6px_0_0_#111827] text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Leave Current Assessment?</h3>
                    <p className="text-sm font-medium text-gray-700">
                      Your current in-progress answers will be lost unless you finish and submit.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setConfirmExit(false)}
                        className="flex-1 py-2.5 px-4 border-2 border-gray-900 bg-white font-bold cursor-pointer"
                      >
                        Continue Quiz
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          safePlay('click');
                          setConfirmExit(false);
                          setGameState('home');
                        }}
                        className="flex-1 py-2.5 px-4 border-2 border-gray-900 bg-gray-900 text-white font-bold cursor-pointer"
                      >
                        Exit to Home
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Quiz Bar */}
              <div className="p-5 sm:p-8 border-b-2 border-gray-900 bg-gray-900/5 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-gray-900 text-white border-2 border-gray-900">
                      Sir Prince Trials · Q{currentQuestion.sourceNumber}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-bold bg-white text-gray-900 border-2 border-gray-900">
                      {currentQuestion.topic}
                    </span>
                    {currentQuestion.reviewFlag && (
                      <span
                        title={currentQuestion.reviewFlag.reason}
                        className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 border-2 border-gray-900 inline-flex items-center gap-1"
                      >
                        <Flag className="w-3.5 h-3.5" /> Source Review Note
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Q {currentQuestionIndex + 1} / {sessionQuestions.length}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="text-sm sm:text-base font-bold text-gray-900 shrink-0 w-12">
                    {Math.round(((currentQuestionIndex + 1) / sessionQuestions.length) * 100)}%
                  </div>
                  <div className="h-5 w-full bg-white border-2 border-gray-900 relative overflow-hidden shadow-[4px_4px_0_0_#111827]">
                    <motion.div
                      className="h-full bg-blue-600 border-r-2 border-gray-900"
                      initial={false}
                      animate={{
                        width: `${((currentQuestionIndex + 1) / sessionQuestions.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Timer, Score / Navigator Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {config.timed ? (
                    <motion.div
                      animate={
                        (config.markingMode === 'immediate' && timeLeft <= 5 && !showAnswer) ||
                        (config.markingMode === 'end-of-exam' && examTimeLeft <= 60)
                          ? { scale: [1, 1.03, 1] }
                          : { scale: 1 }
                      }
                      transition={{ repeat: Infinity, duration: 0.9 }}
                      className={cn(
                        'flex items-center gap-2 font-mono font-bold bg-white border-2 border-gray-900 px-3 py-1.5 shadow-[4px_4px_0_0_#111827] text-base transition-colors',
                        (config.markingMode === 'immediate' && timeLeft <= 5 && !showAnswer) ||
                          (config.markingMode === 'end-of-exam' && examTimeLeft <= 60)
                          ? 'text-rose-600 bg-rose-50'
                          : config.markingMode === 'immediate' && timeLeft <= 10 && !showAnswer
                            ? 'text-amber-600 bg-amber-50'
                            : 'text-gray-900'
                      )}
                    >
                      <TimerRingSvg
                        current={config.markingMode === 'immediate' ? timeLeft : examTimeLeft}
                        total={config.markingMode === 'immediate' ? 30 : Math.max(1, sessionQuestions.length * 45)}
                        urgent={
                          (config.markingMode === 'immediate' && timeLeft <= 5 && !showAnswer) ||
                          (config.markingMode === 'end-of-exam' && examTimeLeft <= 60)
                        }
                        warning={config.markingMode === 'immediate' && timeLeft <= 10 && !showAnswer}
                      />
                      {config.markingMode === 'immediate'
                        ? formatSeconds(timeLeft)
                        : formatSeconds(examTimeLeft)}
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2 font-semibold bg-white border-2 border-gray-900 px-3.5 py-1.5 shadow-[4px_4px_0_0_#111827] text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-blue-600" /> Untimed Study Mode
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {config.markingMode === 'immediate' && streak >= 2 && (
                        <motion.div
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          className="text-xs font-bold bg-amber-400 text-gray-900 px-2.5 py-1.5 border-2 border-gray-900 shadow-[3px_3px_0_0_#111827] flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" /> {streak}x STREAK
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {config.markingMode === 'end-of-exam' && (
                      <button
                        type="button"
                        onClick={() => {
                          safePlay('click');
                          setShowNavigator((v) => !v);
                        }}
                        className="text-xs sm:text-sm font-bold bg-white text-gray-900 px-3 py-1.5 border-2 border-gray-900 shadow-[4px_4px_0_0_#111827] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ListChecks className="w-4 h-4" />
                        Navigator ({Object.keys(examSelections).length}/{sessionQuestions.length})
                      </button>
                    )}

                    <div className="relative">
                      <AnimatePresence>
                        {justScored && (
                          <motion.span
                            initial={{ opacity: 0, y: 4, scale: 0.8 }}
                            animate={{ opacity: 1, y: -22, scale: 1.05 }}
                            exit={{ opacity: 0, y: -32 }}
                            className="absolute -top-1 right-1 px-1.5 py-0.5 text-[11px] font-mono font-bold bg-emerald-500 text-white border border-gray-900 pointer-events-none"
                          >
                            +1
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <motion.div
                        animate={justScored ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                        className={cn(
                          'text-xs sm:text-sm font-bold text-white px-3.5 py-1.5 border-2 border-gray-900 tracking-wider shadow-[4px_4px_0_0_#111827] transition-colors',
                          justScored ? 'bg-emerald-600' : 'bg-blue-600'
                        )}
                      >
                        {config.markingMode === 'immediate'
                          ? `SCORE: ${immediateScore}`
                          : `ANSWERED: ${Object.keys(examSelections).length}/${sessionQuestions.length}`}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* End-of-Exam Question Navigator Grid */}
                {config.markingMode === 'end-of-exam' && showNavigator && (
                  <div className="p-3 bg-white border-2 border-gray-900 max-h-48 overflow-y-auto">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                      Jump to Question
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                      {sessionQuestions.map((q, idx) => {
                        const isAnswered = Boolean(examSelections[q.id]);
                        const isCurrent = idx === currentQuestionIndex;
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => {
                              safePlay('click');
                              setCurrentQuestionIndex(idx);
                            }}
                            className={cn(
                              'py-1.5 text-xs font-mono font-bold border-2 border-gray-900 cursor-pointer',
                              isCurrent
                                ? 'bg-blue-600 text-white'
                                : isAnswered
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-white text-gray-900 hover:bg-gray-100'
                            )}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Question Body */}
              <div className="p-6 sm:p-10">
                <TypewriterText key={currentQuestion.id} text={currentQuestion.text} />

                {/* Options */}
                <div className="space-y-3.5">
                  {currentQuestion.displayOptions.map((option, idx) => {
                    const displayLetter = getDisplayLetter(idx);
                    const activeSelection =
                      config.markingMode === 'immediate'
                        ? selectedOptionId
                        : examSelections[currentQuestion.id] ?? null;
                    const isSelected = activeSelection === option.id;
                    const isCorrect =
                      option.id === currentQuestion.correctOptionId &&
                      option.text === currentQuestion.correctAnswerText;
                    const isRevealed = config.markingMode === 'immediate' && showAnswer;

                    let stateClass =
                      'border-gray-900 bg-white hover:bg-blue-600 hover:text-white text-gray-900 shadow-[5px_5px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[3px] hover:translate-y-[3px]';

                    if (isRevealed) {
                      if (isCorrect) {
                        stateClass = 'border-gray-900 bg-emerald-600 text-white shadow-[5px_5px_0_0_#111827]';
                      } else if (isSelected && !isCorrect) {
                        stateClass = 'border-gray-900 bg-rose-600 text-white shadow-[5px_5px_0_0_#111827]';
                      } else {
                        stateClass = 'border-gray-900/20 text-gray-900/45 shadow-none';
                      }
                    } else if (isSelected) {
                      stateClass = 'border-gray-900 bg-gray-900 text-white shadow-[5px_5px_0_0_#2563eb]';
                    }

                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={
                          isRevealed && isSelected && !isCorrect
                            ? { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }
                            : isRevealed && isCorrect
                              ? { opacity: 1, y: 0, scale: [1, 1.015, 1] }
                              : { opacity: 1, y: 0, x: 0, scale: 1 }
                        }
                        transition={{
                          delay: isRevealed ? 0 : idx * 0.045,
                          duration: isRevealed ? 0.35 : 0.2,
                        }}
                        whileTap={!isRevealed ? { scale: 0.99 } : undefined}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={isRevealed}
                        className={cn(
                          'w-full text-left p-4 sm:p-5 rounded-none border-2 transition-colors flex items-center justify-between group cursor-pointer disabled:cursor-default',
                          stateClass
                        )}
                      >
                        <span className="font-semibold text-base sm:text-lg flex items-center">
                          <span
                            className={cn(
                              'w-9 h-9 rounded-none border-2 flex items-center justify-center mr-3.5 text-sm font-bold transition-transform duration-150 shrink-0 group-hover:scale-105',
                              isSelected && !isRevealed
                                ? 'bg-white border-white text-gray-900'
                                : isRevealed
                                  ? 'border-current bg-transparent'
                                  : 'border-gray-900 bg-white group-hover:bg-white group-hover:text-blue-600 text-gray-900'
                            )}
                          >
                            {displayLetter}
                          </span>
                          <span>{option.text}</span>
                        </span>

                        {isRevealed && isCorrect && (
                          <div className="bg-white border-2 border-gray-900 text-emerald-700 p-1.5 rounded-none shrink-0 ml-3 shadow-[3px_3px_0_0_#111827]">
                            <AnimatedCheckSvg className="w-5 h-5" />
                          </div>
                        )}
                        {isRevealed && isSelected && !isCorrect && (
                          <div className="bg-gray-900 border-2 border-white text-white p-1.5 rounded-none shrink-0 ml-3 shadow-[3px_3px_0_0_#111827]">
                            <AnimatedCrossSvg className="w-5 h-5" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Immediate Mode Instant Answer Feedback & Lecture-Slide Explanation (Shown ONLY after answering) */}
                <AnimatePresence>
                  {config.markingMode === 'immediate' && showAnswer && (() => {
                    const record = answerRecords[currentQuestion.id];
                    const isTimedOut = Boolean(record?.timedOut);
                    const isUserCorrect = Boolean(record?.isCorrect);
                    const chosenOpt = currentQuestion.displayOptions.find(
                      (o) => o.id === (record?.selectedOptionId ?? selectedOptionId)
                    );
                    const chosenIdx = chosenOpt
                      ? currentQuestion.displayOptions.findIndex((o) => o.id === chosenOpt.id)
                      : -1;
                    const correctIdx = currentQuestion.displayOptions.findIndex(
                      (o) =>
                        o.id === currentQuestion.correctOptionId &&
                        o.text === currentQuestion.correctAnswerText
                    );
                    const correctLetter =
                      correctIdx >= 0 ? getDisplayLetter(correctIdx) : currentQuestion.correctOptionId;
                    const chosenLetter =
                      chosenIdx >= 0 ? getDisplayLetter(chosenIdx) : chosenOpt?.id;
                    const genderExp = GENDER_EXPLANATIONS[currentQuestion.sourceNumber];
                    const incorrectReason =
                      !isUserCorrect && chosenOpt
                        ? getIncorrectSelectionReason(
                            currentQuestion.text,
                            chosenOpt.text,
                            currentQuestion.correctAnswerText,
                            genderExp
                          )
                        : null;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-7"
                      >
                        <div className="bg-white rounded-none border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] overflow-hidden">
                          {/* Green Correct / Red Incorrect Result Header */}
                          <div
                            className={cn(
                              'px-4 py-3 sm:px-5 sm:py-3.5 border-b-2 border-gray-900 flex flex-wrap items-center justify-between gap-2 text-white',
                              isUserCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-white border-2 border-gray-900 flex items-center justify-center shrink-0">
                                {isUserCorrect ? (
                                  <AnimatedCheckSvg className="w-4 h-4 text-emerald-700" />
                                ) : (
                                  <AnimatedCrossSvg className="w-4 h-4 text-rose-700" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-sm sm:text-base leading-tight">
                                  {isUserCorrect
                                    ? 'Correct!'
                                    : isTimedOut
                                      ? "Time's Up — Incorrect"
                                      : 'Incorrect'}
                                </div>
                                {!isUserCorrect && chosenOpt && (
                                  <div className="text-xs font-medium text-white/90">
                                    You selected: {chosenLetter}. {chosenOpt.text}
                                  </div>
                                )}
                              </div>
                            </div>

                            <span className="text-xs font-mono font-bold bg-gray-900/25 px-2.5 py-1 border border-white/40">
                              Q{currentQuestion.sourceNumber} · Sir Prince Trials
                            </span>
                          </div>

                          <div className="p-4 sm:p-6 space-y-4">
                            {/* Correct Answer */}
                            <div
                              className={cn(
                                'p-3.5 border-2 border-gray-900',
                                isUserCorrect ? 'bg-emerald-50' : 'bg-blue-50'
                              )}
                            >
                              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-0.5">
                                Correct Answer
                              </div>
                              <p className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                                {correctLetter}. {currentQuestion.correctAnswerText}
                              </p>
                            </div>

                            {genderExp ? (
                              <>
                                {/* Relevant Concept + Lecture Slide Reference */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-gray-900 text-white border-2 border-gray-900">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Concept: {genderExp.concept}
                                  </span>
                                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-gray-100 text-gray-800 border-2 border-gray-900">
                                    {genderExp.lectureReference}
                                  </span>
                                </div>

                                {/* Explanation */}
                                <div className="space-y-1.5">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                    {isUserCorrect
                                      ? 'Why Your Answer Is Correct'
                                      : 'Explanation'}
                                  </h4>
                                  <p className="text-sm sm:text-base font-medium text-gray-800 leading-relaxed">
                                    {genderExp.explanation}
                                  </p>
                                </div>

                                {/* Brief reason why selected option is incorrect */}
                                {incorrectReason && (
                                  <div className="p-3.5 bg-rose-50 border-2 border-gray-900 text-xs sm:text-sm text-rose-950 space-y-1">
                                    <div className="font-bold uppercase tracking-wider text-[11px] text-rose-800">
                                      Why Your Selected Answer Doesn&apos;t Fit
                                    </div>
                                    <p className="font-medium leading-relaxed">{incorrectReason}</p>
                                  </div>
                                )}

                                {/* Lecture Study Note (if provided in PDF) */}
                                {genderExp.studyNote && (
                                  <div className="p-3.5 bg-amber-50 border-2 border-gray-900 text-xs sm:text-sm font-medium text-amber-950 flex items-start gap-2.5">
                                    <Flag className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                                    <span>
                                      <strong>Lecture Study Note:</strong> {genderExp.studyNote}
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="p-3.5 bg-gray-50 border-2 border-gray-900 text-xs sm:text-sm text-gray-700 space-y-1">
                                <div className="font-bold uppercase tracking-wider text-[11px] text-gray-600">
                                  Verified Source Answer Key (Q{currentQuestion.sourceNumber})
                                </div>
                                <p className="font-medium leading-relaxed">
                                  {GENDER_EXPLANATION_SCOPE_NOTE}
                                </p>
                              </div>
                            )}

                            {currentQuestion.sourceExplanation && (
                              <p className="text-sm font-medium text-gray-700 border-t border-gray-200 pt-3">
                                {currentQuestion.sourceExplanation}
                              </p>
                            )}

                            {currentQuestion.reviewFlag && (
                              <div className="p-3 bg-amber-50 border-2 border-gray-900 text-xs sm:text-sm font-medium text-amber-950 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>
                                  <strong>Flagged for Review ({currentQuestion.reviewFlag.category}):</strong>{' '}
                                  {currentQuestion.reviewFlag.reason}
                                </span>
                              </div>
                            )}

                            {isMotivationTime && (
                              <div className="inline-block bg-gray-900 text-white px-3.5 py-1.5 border-2 border-gray-900 font-semibold text-xs tracking-wide shadow-[4px_4px_0_0_#2563eb]">
                                {motivationMsg}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Navigation / Submit Footer */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-between gap-4">
                  {config.markingMode === 'immediate' ? (
                    <>
                      <span className="text-xs font-mono font-semibold text-gray-500">
                        {!showAnswer
                          ? 'Select an option above for instant marking & explanation · Keys: A–D / 1–4'
                          : 'Read at your own pace · Press Enter or click Next Question'}
                      </span>
                      {showAnswer && (
                        <button
                          type="button"
                          onClick={nextImmediateQuestion}
                          className="w-full sm:w-auto sm:ml-auto px-8 py-4 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-none border-2 border-gray-900 hover:bg-blue-700 transition-all tracking-wide shadow-[6px_6px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
                        >
                          {currentQuestionIndex < sessionQuestions.length - 1
                            ? 'Next Question'
                            : 'View Results'}
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => {
                          safePlay('click');
                          setCurrentQuestionIndex((i) => Math.max(0, i - 1));
                        }}
                        className="px-5 py-3 bg-white text-gray-900 font-semibold border-2 border-gray-900 shadow-[4px_4px_0_0_#111827] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" /> Previous
                      </button>

                      <div className="flex items-center gap-3 ml-auto">
                        {currentQuestionIndex < sessionQuestions.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              safePlay('click');
                              setCurrentQuestionIndex((i) => i + 1);
                            }}
                            className="px-6 py-3 bg-gray-900 text-white font-semibold border-2 border-gray-900 shadow-[4px_4px_0_0_#111827] flex items-center gap-2 cursor-pointer"
                          >
                            Next <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={submitFullExam}
                          className="px-6 py-3 bg-blue-600 text-white font-semibold border-2 border-gray-900 shadow-[4px_4px_0_0_#111827] hover:bg-blue-700 cursor-pointer"
                        >
                          Submit Exam
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-8"
            >
              {/* Summary Card */}
              <div className="bg-white rounded-none shadow-[6px_6px_0_0_#111827] border-2 border-gray-900 p-6 sm:p-10 text-center">
                <AccuracyRingSvg percentage={resultStats.accuracy} />

                <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-3 text-gray-900">
                  {resultStats.accuracy >= 80
                    ? 'Outstanding Mastery!'
                    : resultStats.accuracy >= 50
                      ? 'Assessment Complete!'
                      : 'Keep Reviewing!'}
                </h2>
                <p className="text-gray-700 font-semibold text-base sm:text-lg mb-8">
                  {sessionLabel} — Sir Prince Trials
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-gray-900 text-white p-5 rounded-none border-2 border-gray-900 shadow-[4px_4px_0_0_#111827]"
                  >
                    <div className="text-3xl sm:text-4xl font-semibold mb-1">
                      <AnimatedNumber value={resultStats.correct} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Correct
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-5 rounded-none border-2 border-gray-900 shadow-[4px_4px_0_0_#111827]"
                  >
                    <div className="text-3xl sm:text-4xl font-semibold mb-1 text-rose-600">
                      <AnimatedNumber value={resultStats.incorrect} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Incorrect
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white p-5 rounded-none border-2 border-gray-900 shadow-[4px_4px_0_0_#111827]"
                  >
                    <div className="text-3xl sm:text-4xl font-semibold mb-1 text-gray-900">
                      <AnimatedNumber value={resultStats.unanswered} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Unanswered
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-600 text-white p-5 rounded-none border-2 border-gray-900 shadow-[4px_4px_0_0_#111827]"
                  >
                    <div className="text-3xl sm:text-4xl font-semibold mb-1">
                      <AnimatedNumber value={resultStats.accuracy} suffix="%" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white">
                      Accuracy
                    </div>
                  </motion.div>
                </div>

                {/* Topic Breakdown */}
                {topicBreakdown.length > 1 && (
                  <div className="text-left mb-8 border-2 border-gray-900 p-4 sm:p-5 bg-gray-900/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                      Performance by Topic
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {topicBreakdown.map((stat, i) => (
                        <div
                          key={stat.topic}
                          className="bg-white border-2 border-gray-900 p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-bold text-gray-900">{stat.topic}</span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-gray-900 text-white shrink-0">
                              {stat.correct}/{stat.total} ({stat.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 border border-gray-900 overflow-hidden">
                            <motion.div
                              className={cn(
                                'h-full',
                                stat.percentage >= 75
                                  ? 'bg-emerald-600'
                                  : stat.percentage >= 50
                                    ? 'bg-blue-600'
                                    : 'bg-amber-500'
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.percentage}%` }}
                              transition={{ duration: 0.65, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => launchQuiz()}
                    className="py-4 px-6 bg-blue-600 text-white font-semibold text-base rounded-none border-2 border-gray-900 hover:bg-blue-700 transition-all shadow-[5px_5px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" /> Retake Assessment
                  </button>

                  {missedQuestions.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        launchQuiz(
                          config,
                          missedQuestions,
                          `Missed Questions Drill (${missedQuestions.length})`,
                          'missed-review'
                        )
                      }
                      className="py-4 px-6 bg-gray-900 text-white font-semibold text-base rounded-none border-2 border-gray-900 hover:bg-gray-800 transition-all shadow-[5px_5px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-5 h-5" /> Retry Missed ({missedQuestions.length})
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={downloadReport}
                    className="py-4 px-6 bg-white flex items-center justify-center gap-2 text-gray-900 font-semibold text-base rounded-none border-2 border-gray-900 hover:bg-gray-50 transition-all shadow-[5px_5px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[3px] hover:translate-y-[3px] cursor-pointer"
                  >
                    <Download className="w-5 h-5" /> Download Report
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      safePlay('click');
                      setGameState('home');
                    }}
                    className="py-4 px-6 bg-white flex items-center justify-center gap-2 text-gray-900 font-semibold text-base rounded-none border-2 border-gray-900 hover:bg-gray-50 transition-all shadow-[5px_5px_0_0_#111827] hover:shadow-[2px_2px_0_0_#111827] hover:translate-x-[3px] hover:translate-y-[3px] cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" /> Return to Home
                  </button>
                </div>

                {/* End-of-Quiz Credit */}
                <div className="mt-6 pt-5 border-t-2 border-gray-900/15 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-gray-900 text-white">
                    Credit
                  </span>
                  <span>
                    Question Bank &amp; Source Material:{' '}
                    <strong className="text-gray-900">{SOURCE_DOCUMENT_META.attribution}</strong>
                  </span>
                </div>
              </div>

              {/* Detailed Answer Review */}
              <div className="bg-white rounded-none shadow-[6px_6px_0_0_#111827] border-2 border-gray-900 p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Answer Review</h3>
                    <p className="text-sm font-medium text-gray-600">
                      Trace every question back to its source PDF number and verified answer key · Credit:{' '}
                      <strong className="text-gray-900">{SOURCE_DOCUMENT_META.attribution}</strong>.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: 'all', label: `All (${sessionQuestions.length})` },
                        { id: 'missed', label: `Missed (${missedQuestions.length})` },
                        { id: 'correct', label: `Correct (${resultStats.correct})` },
                        {
                          id: 'flagged',
                          label: `Flagged (${sessionQuestions.filter((q) => q.reviewFlag).length})`,
                        },
                      ] as const
                    ).map((tab) => {
                      const isActive = reviewFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            safePlay('click');
                            setReviewFilter(tab.id);
                          }}
                          className={cn(
                            'relative px-3 py-1.5 text-xs font-bold border-2 border-gray-900 cursor-pointer transition-colors overflow-hidden',
                            isActive ? 'text-white' : 'bg-white text-gray-900 hover:bg-gray-100'
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="review-filter-bg"
                              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                              className="absolute inset-0 bg-blue-600"
                            />
                          )}
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {filteredReviewQuestions.length === 0 ? (
                  <div className="p-6 border-2 border-gray-900/20 text-center text-sm font-semibold text-gray-600">
                    No questions match this review filter.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReviewQuestions.map((q) => {
                      const rec = answerRecords[q.id];
                      const chosenOpt = q.options.find((o) => o.id === rec?.selectedOptionId);
                      const isCorrect = Boolean(rec?.isCorrect);
                      const genderExp = GENDER_EXPLANATIONS[q.sourceNumber];
                      const incorrectReason =
                        !isCorrect && chosenOpt
                          ? getIncorrectSelectionReason(
                              q.text,
                              chosenOpt.text,
                              q.correctAnswerText,
                              genderExp
                            )
                          : null;

                      return (
                        <div
                          key={q.id}
                          className="border-2 border-gray-900 p-4 sm:p-5 bg-white space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-gray-900 text-white">
                                Sir Prince Trials · Q{q.sourceNumber}
                              </span>
                              <span className="px-2 py-0.5 text-xs font-bold border border-gray-900 bg-gray-50">
                                {q.topic}
                              </span>
                            </div>
                            <span
                              className={cn(
                                'px-2.5 py-0.5 text-xs font-bold border-2 border-gray-900 inline-flex items-center gap-1',
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              )}
                            >
                              {isCorrect ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Correct
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5" />{' '}
                                  {rec?.selectedOptionId ? 'Incorrect' : 'Unanswered'}
                                </>
                              )}
                            </span>
                          </div>

                          <p className="font-semibold text-base text-gray-900">{q.text}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                            <div
                              className={cn(
                                'p-2.5 border-2',
                                isCorrect
                                  ? 'border-gray-900/20 bg-gray-50'
                                  : 'border-rose-300 bg-rose-50'
                              )}
                            >
                              <span className="text-xs font-bold uppercase text-gray-500 block">
                                Your Selection
                              </span>
                              <span className="font-bold text-gray-900">
                                {chosenOpt ? `${chosenOpt.id}. ${chosenOpt.text}` : 'No answer selected'}
                              </span>
                            </div>
                            <div className="p-2.5 border-2 border-gray-900 bg-emerald-50">
                              <span className="text-xs font-bold uppercase text-emerald-800 block">
                                Correct Answer
                              </span>
                              <span className="font-bold text-gray-900">
                                {q.correctOptionId}. {q.correctAnswerText}
                              </span>
                            </div>
                          </div>

                          {genderExp ? (
                            <div className="p-3 sm:p-3.5 bg-gray-50 border-2 border-gray-900/20 space-y-2 text-xs sm:text-sm">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 font-bold bg-gray-900 text-white text-xs">
                                  Concept: {genderExp.concept}
                                </span>
                                <span className="px-2 py-0.5 font-mono font-bold bg-white border border-gray-900 text-xs text-gray-700">
                                  {genderExp.lectureReference}
                                </span>
                              </div>
                              <p className="font-medium text-gray-800 leading-relaxed">
                                {genderExp.explanation}
                              </p>
                              {incorrectReason && (
                                <p className="font-medium text-rose-900 bg-rose-50 p-2 border border-rose-300">
                                  <strong>Why your selection is incorrect:</strong> {incorrectReason}
                                </p>
                              )}
                              {genderExp.studyNote && (
                                <p className="font-medium text-amber-950 bg-amber-50 p-2 border border-amber-300">
                                  <strong>Lecture Study Note:</strong> {genderExp.studyNote}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs font-medium text-gray-600 bg-gray-50 p-2.5 border border-gray-900/20">
                              {GENDER_EXPLANATION_SCOPE_NOTE}
                            </p>
                          )}

                          {q.reviewFlag && (
                            <div className="p-2.5 bg-amber-50 border-2 border-gray-900 text-xs font-medium text-amber-950 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>
                                <strong>Review Note ({q.reviewFlag.category}):</strong>{' '}
                                {q.reviewFlag.reason}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
