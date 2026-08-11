import { Injectable, signal, computed } from '@angular/core';
import { InterviewSession, InterviewQuestion, InterviewResult } from '../models/interview-session.model';
import { Question } from '../models/question.model';
import { QuestionService } from './question.service';
import { CategoryService } from './category.service';

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private session = signal<InterviewSession | null>(null);

  currentSession = computed(() => this.session());

  constructor(
    private questionService: QuestionService,
    private categoryService: CategoryService
  ) {}

  startInterview(categoryId: number, totalQuestions: number): InterviewSession {
    const category = this.categoryService.getById(categoryId);
    const newSession: InterviewSession = {
      sessionId: this.generateSessionId(),
      categoryId,
      categoryName: category?.name || 'Interview',
      totalQuestions,
      currentQuestionIndex: 0,
      attemptedQuestions: 0,
      timedOutQuestions: 0,
      skippedQuestions: 0,
      questionIds: [],
      questions: [],
      startedAt: new Date()
    };
    this.session.set(newSession);
    return newSession;
  }

  getNextQuestion(): Question | null {
    const s = this.session();
    if (!s) return null;
    if (s.currentQuestionIndex >= s.totalQuestions) return null;

    const question = this.questionService.getRandomQuestion(s.categoryId, s.questionIds);
    return question;
  }

  recordAttempted(questionId: number, questionText: string, answer?: string): void {
    const s = this.session();
    if (!s) return;

    const updatedSession: InterviewSession = {
      ...s,
      attemptedQuestions: s.attemptedQuestions + 1,
      questionIds: [...s.questionIds, questionId],
      questions: [...s.questions, {
        questionId,
        questionNumber: s.currentQuestionIndex + 1,
        questionText,
        answer,
        isAttempted: true,
        isTimedOut: false,
        isSkipped: false
      }],
      currentQuestionIndex: s.currentQuestionIndex + 1
    };
    this.session.set(updatedSession);
  }

  recordTimedOut(questionId: number, questionText: string, answer?: string): void {
    const s = this.session();
    if (!s) return;

    const updatedSession: InterviewSession = {
      ...s,
      timedOutQuestions: s.timedOutQuestions + 1,
      questionIds: [...s.questionIds, questionId],
      questions: [...s.questions, {
        questionId,
        questionNumber: s.currentQuestionIndex + 1,
        questionText,
        answer,
        isAttempted: false,
        isTimedOut: true,
        isSkipped: false
      }],
      currentQuestionIndex: s.currentQuestionIndex + 1
    };
    this.session.set(updatedSession);
  }

  recordSkipped(questionId: number, questionText: string, answer?: string): void {
    const s = this.session();
    if (!s) return;

    const updatedSession: InterviewSession = {
      ...s,
      skippedQuestions: s.skippedQuestions + 1,
      questionIds: [...s.questionIds, questionId],
      questions: [...s.questions, {
        questionId,
        questionNumber: s.currentQuestionIndex + 1,
        questionText,
        answer,
        isAttempted: false,
        isTimedOut: false,
        isSkipped: true
      }],
      currentQuestionIndex: s.currentQuestionIndex + 1
    };
    this.session.set(updatedSession);
  }

  completeInterview(): InterviewResult | null {
    const s = this.session();
    if (!s) return null;

    const result: InterviewResult = {
      sessionId: s.sessionId,
      categoryName: s.categoryName,
      totalQuestions: s.totalQuestions,
      attemptedQuestions: s.attemptedQuestions,
      timedOutQuestions: s.timedOutQuestions,
      skippedQuestions: s.skippedQuestions,
      completionRate: Math.round((s.attemptedQuestions / s.totalQuestions) * 100),
      questions: s.questions,
      startedAt: s.startedAt,
      completedAt: new Date()
    };

    return result;
  }

  getResult(): InterviewResult | null {
    return this.completeInterview();
  }

  resetSession(): void {
    this.session.set(null);
  }

  private generateSessionId(): string {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}
