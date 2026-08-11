import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InterviewService } from '../../core/services/interview.service';
import { TimerService } from '../../core/services/timer.service';
import { Question } from '../../core/models/question.model';

@Component({
  selector: 'app-interview-session',
  standalone: true,
  templateUrl: './interview-session.component.html',
  styleUrl: './interview-session.component.sass'
})
export class InterviewSessionComponent implements OnInit, OnDestroy {
  currentQuestion: Question | null = null;
  isLoading = false;
  isTimedOut = false;
  isCompleted = false;
  error = '';
  private expiredSub: Subscription | null = null;

  constructor(
    public interviewService: InterviewService,
    public timerService: TimerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const session = this.interviewService.currentSession();
    if (!session) {
      this.router.navigate(['/']);
      return;
    }

    this.expiredSub = this.timerService.onExpired.subscribe(() => {
      this.isTimedOut = true;
    });

    this.loadNextQuestion();
  }

  ngOnDestroy(): void {
    this.timerService.cleanup();
    this.expiredSub?.unsubscribe();
  }

  loadNextQuestion(): void {
    this.isLoading = true;
    this.isTimedOut = false;
    this.error = '';

    // Simulate a small delay for UX
    setTimeout(() => {
      const question = this.interviewService.getNextQuestion();
      if (question) {
        this.currentQuestion = question;
        this.isLoading = false;
        this.timerService.start();
      } else {
        this.error = 'Unable to load the next question. No more questions available.';
        this.isLoading = false;
      }
    }, 300);
  }

  nextQuestion(): void {
    if (this.isLoading) return;
    if (!this.currentQuestion) return;

    const session = this.interviewService.currentSession();
    if (!session) return;

    this.timerService.stop();

    // Record the current question
    if (this.isTimedOut) {
      this.interviewService.recordTimedOut(this.currentQuestion.id, this.currentQuestion.questionText, this.currentQuestion.answer);
    } else {
      this.interviewService.recordAttempted(this.currentQuestion.id, this.currentQuestion.questionText, this.currentQuestion.answer);
    }

    this.advanceOrComplete();
  }

  skipQuestion(): void {
    if (this.isLoading) return;
    if (!this.currentQuestion) return;

    const session = this.interviewService.currentSession();
    if (!session) return;

    this.timerService.stop();
    this.interviewService.recordSkipped(this.currentQuestion.id, this.currentQuestion.questionText, this.currentQuestion.answer);
    this.advanceOrComplete();
  }

  private advanceOrComplete(): void {
    const updatedSession = this.interviewService.currentSession();
    if (updatedSession && updatedSession.currentQuestionIndex >= updatedSession.totalQuestions) {
      this.isCompleted = true;
      this.router.navigate(['/result']);
      return;
    }

    this.loadNextQuestion();
  }

  get session() {
    return this.interviewService.currentSession();
  }

  get remainingQuestions(): number {
    const s = this.session;
    if (!s) return 0;
    return s.totalQuestions - s.currentQuestionIndex - 1;
  }

  get currentQuestionNumber(): number {
    const s = this.session;
    if (!s) return 0;
    return s.currentQuestionIndex + 1;
  }
}
