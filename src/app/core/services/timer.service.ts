import { Injectable, signal, computed } from '@angular/core';
import { Subject, interval, takeUntil, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly INITIAL_TIME = 120;
  private destroy$ = new Subject<void>();
  private timeRemaining = signal(this.INITIAL_TIME);
  private isRunning = signal(false);
  private expired$ = new Subject<void>();

  remaining = computed(() => this.timeRemaining());
  running = computed(() => this.isRunning());
  onExpired = this.expired$.asObservable();

  formattedTime = computed(() => {
    const seconds = this.timeRemaining();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  isLow = computed(() => this.timeRemaining() <= 30);
  isCritical = computed(() => this.timeRemaining() <= 10);
  isExpired = computed(() => this.timeRemaining() === 0);

  start(): void {
    this.stop();
    this.timeRemaining.set(this.INITIAL_TIME);
    this.isRunning.set(true);

    interval(1000).pipe(
      takeUntil(this.destroy$),
      tap(() => {
        const current = this.timeRemaining();
        if (current > 0) {
          this.timeRemaining.set(current - 1);
        }
        if (current - 1 === 0) {
          this.isRunning.set(false);
          this.expired$.next();
        }
      })
    ).subscribe();
  }

  stop(): void {
    this.destroy$.next();
    this.destroy$ = new Subject<void>();
    this.isRunning.set(false);
  }

  reset(): void {
    this.stop();
    this.timeRemaining.set(this.INITIAL_TIME);
  }

  cleanup(): void {
    this.stop();
    this.timeRemaining.set(this.INITIAL_TIME);
  }
}
