export interface InterviewSession {
  sessionId: string;
  categoryId: number;
  categoryName: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  attemptedQuestions: number;
  timedOutQuestions: number;
  skippedQuestions: number;
  questionIds: number[];
  questions: InterviewQuestion[];
  startedAt: Date;
  completedAt?: Date;
}

export interface InterviewQuestion {
  questionId: number;
  questionNumber: number;
  questionText: string;
  answer?: string;
  isAttempted: boolean;
  isTimedOut: boolean;
  isSkipped: boolean;
}

export interface InterviewResult {
  sessionId: string;
  categoryName: string;
  totalQuestions: number;
  attemptedQuestions: number;
  timedOutQuestions: number;
  skippedQuestions: number;
  completionRate: number;
  questions: InterviewQuestion[];
  startedAt: Date;
  completedAt: Date;
}
