import {
  CourseSection,
  Question,
  QuestionOption,
  QuestionTopic,
  quizQuestions,
} from '../data/questions';

export type QuizMode = 'full-mock' | 'topic' | 'quick-sprint' | 'missed-review';
export type MarkingMode = 'immediate' | 'end-of-exam';

export interface QuizConfig {
  mode: QuizMode;
  selectedSection: CourseSection | 'all';
  selectedTopic: QuestionTopic | 'all';
  randomiseQuestions: boolean;
  randomiseOptions: boolean;
  markingMode: MarkingMode;
  timed: boolean;
  includeSourceDuplicate: boolean;
  sprintCount: number;
}

export interface PreparedQuestion extends Question {
  /** Options in display order (canonical IDs preserved; UI renders A, B, C, D by index) */
  displayOptions: QuestionOption[];
}

export interface QuestionAnswerRecord {
  questionId: string;
  sourceNumber: number;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timedOut: boolean;
}

export interface TopicStat {
  topic: QuestionTopic;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizAttemptSummary {
  id: string;
  mode: QuizMode;
  label: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface StoredProgress {
  totalAttempts: number;
  bestMockPercentage: number | null;
  masteredQuestionIds: string[];
  topicBestPercentages: Partial<Record<QuestionTopic, number>>;
  recentAttempts: QuizAttemptSummary[];
}

const PROGRESS_STORAGE_KEY = 'prof_quarm_gender_african_studies_v2';

export function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getFilteredSourceQuestions(config: Pick<QuizConfig, 'mode' | 'selectedSection' | 'selectedTopic' | 'includeSourceDuplicate'>): Question[] {
  let pool = quizQuestions.filter((q) => {
    if (!config.includeSourceDuplicate && q.reviewFlag?.category === 'duplicate') {
      return false;
    }
    return true;
  });

  if (config.mode === 'topic') {
    if (config.selectedSection !== 'all') {
      pool = pool.filter((q) => q.section === config.selectedSection);
    }
    if (config.selectedTopic !== 'all') {
      pool = pool.filter((q) => q.topic === config.selectedTopic);
    }
  }

  return pool;
}

export function prepareQuizSession(
  config: QuizConfig,
  customQuestions?: Question[]
): PreparedQuestion[] {
  let basePool = customQuestions ? [...customQuestions] : getFilteredSourceQuestions(config);

  if (!customQuestions) {
    if (config.randomiseQuestions || config.mode === 'quick-sprint') {
      basePool = shuffleArray(basePool);
    }
    if (config.mode === 'quick-sprint') {
      basePool = basePool.slice(0, Math.min(config.sprintCount, basePool.length));
    }
  } else if (config.randomiseQuestions) {
    basePool = shuffleArray(basePool);
  }

  return basePool.map((q) => ({
    ...q,
    displayOptions: config.randomiseOptions ? shuffleArray(q.options) : [...q.options],
  }));
}

/**
 * Validates an answer using canonical option ID and double-checks against exact source answer text.
 */
export function validateAnswer(question: PreparedQuestion, selectedOptionId: string | null): boolean {
  if (!selectedOptionId) return false;
  const chosen = question.displayOptions.find((opt) => opt.id === selectedOptionId);
  if (!chosen) return false;
  return chosen.id === question.correctOptionId && chosen.text === question.correctAnswerText;
}

export function computeTopicBreakdown(
  questions: PreparedQuestion[],
  records: Record<string, QuestionAnswerRecord>
): TopicStat[] {
  const byTopic = new Map<QuestionTopic, { correct: number; total: number }>();

  for (const q of questions) {
    const prev = byTopic.get(q.topic) ?? { correct: 0, total: 0 };
    const rec = records[q.id];
    byTopic.set(q.topic, {
      total: prev.total + 1,
      correct: prev.correct + (rec?.isCorrect ? 1 : 0),
    });
  }

  return Array.from(byTopic.entries()).map(([topic, stat]) => ({
    topic,
    correct: stat.correct,
    total: stat.total,
    percentage: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
  }));
}

export function getDisplayLetter(index: number): 'A' | 'B' | 'C' | 'D' {
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  return letters[index] ?? 'A';
}

export function loadProgress(): StoredProgress {
  const empty: StoredProgress = {
    totalAttempts: 0,
    bestMockPercentage: null,
    masteredQuestionIds: [],
    topicBestPercentages: {},
    recentAttempts: [],
  };

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      totalAttempts: typeof parsed.totalAttempts === 'number' ? parsed.totalAttempts : 0,
      bestMockPercentage: typeof parsed.bestMockPercentage === 'number' ? parsed.bestMockPercentage : null,
      masteredQuestionIds: Array.isArray(parsed.masteredQuestionIds) ? parsed.masteredQuestionIds : [],
      topicBestPercentages: parsed.topicBestPercentages && typeof parsed.topicBestPercentages === 'object' ? parsed.topicBestPercentages : {},
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : [],
    };
  } catch {
    return empty;
  }
}

export function recordAttemptProgress(
  mode: QuizMode,
  label: string,
  questions: PreparedQuestion[],
  records: Record<string, QuestionAnswerRecord>
): StoredProgress {
  const current = loadProgress();
  const total = questions.length;
  const score = questions.reduce((acc, q) => acc + (records[q.id]?.isCorrect ? 1 : 0), 0);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const masteredSet = new Set(current.masteredQuestionIds);
  for (const q of questions) {
    if (records[q.id]?.isCorrect) {
      masteredSet.add(q.id);
    }
  }

  const nextTopicBest = { ...current.topicBestPercentages };
  const topicStats = computeTopicBreakdown(questions, records);
  if (mode === 'topic' && topicStats.length === 1) {
    const tStat = topicStats[0];
    const prevBest = nextTopicBest[tStat.topic] ?? 0;
    nextTopicBest[tStat.topic] = Math.max(prevBest, tStat.percentage);
  }

  const bestMockPercentage =
    mode === 'full-mock'
      ? current.bestMockPercentage === null
        ? percentage
        : Math.max(current.bestMockPercentage, percentage)
      : current.bestMockPercentage;

  const newEntry: QuizAttemptSummary = {
    id: `attempt-${Date.now()}`,
    mode,
    label,
    score,
    total,
    percentage,
    completedAt: new Date().toISOString(),
  };

  const next: StoredProgress = {
    totalAttempts: current.totalAttempts + 1,
    bestMockPercentage,
    masteredQuestionIds: Array.from(masteredSet),
    topicBestPercentages: nextTopicBest,
    recentAttempts: [newEntry, ...current.recentAttempts].slice(0, 8),
  };

  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors
  }

  return next;
}

export function clearProgress(): StoredProgress {
  const empty: StoredProgress = {
    totalAttempts: 0,
    bestMockPercentage: null,
    masteredQuestionIds: [],
    topicBestPercentages: {},
    recentAttempts: [],
  };
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  return empty;
}
