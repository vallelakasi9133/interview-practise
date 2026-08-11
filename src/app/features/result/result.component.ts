import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterviewService } from '../../core/services/interview.service';
import { InterviewResult, InterviewQuestion } from '../../core/models/interview-session.model';

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result.component.html',
  styleUrl: './result.component.sass'
})
export class ResultComponent implements OnInit {
  result: InterviewResult | null = null;
  skippedList: InterviewQuestion[] = [];
  expandedAnswers: Set<number> = new Set();

  constructor(
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.result = this.interviewService.getResult();
    if (!this.result) {
      this.router.navigate(['/']);
      return;
    }
    this.skippedList = this.result.questions.filter(q => q.isSkipped);
  }

  toggleAnswer(questionNumber: number): void {
    if (this.expandedAnswers.has(questionNumber)) {
      this.expandedAnswers.delete(questionNumber);
    } else {
      this.expandedAnswers.add(questionNumber);
    }
  }

  isAnswerVisible(questionNumber: number): boolean {
    return this.expandedAnswers.has(questionNumber);
  }

  restartInterview(): void {
    if (this.result) {
      const session = this.interviewService.currentSession();
      if (session) {
        const slug = this.getCategorySlug(session.categoryName);
        this.interviewService.resetSession();
        this.router.navigate(['/interview', slug]);
        return;
      }
    }
    this.interviewService.resetSession();
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.interviewService.resetSession();
    this.router.navigate(['/']);
  }

  private getCategorySlug(name: string): string {
    const slugMap: Record<string, string> = {
      'Angular': 'angular',
      'TypeScript': 'typescript',
      'JavaScript': 'javascript',
      'HTML': 'html',
      'CSS': 'css',
      '.NET': 'dotnet',
      'ASP.NET Core': 'aspnet-core',
      'Web API': 'web-api',
      'Entity Framework Core': 'ef-core',
      'C#': 'csharp',
      'SQL Server': 'sql-server',
      'Microservices': 'microservices',
      'Full Stack': 'full-stack',
      'Mixed Interview': 'mixed'
    };
    return slugMap[name] || 'angular';
  }
}
