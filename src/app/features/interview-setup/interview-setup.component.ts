import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { InterviewService } from '../../core/services/interview.service';
import { QuestionService } from '../../core/services/question.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-interview-setup',
  standalone: true,
  templateUrl: './interview-setup.component.html',
  styleUrl: './interview-setup.component.sass'
})
export class InterviewSetupComponent implements OnInit {
  category: Category | undefined;
  questionCount = 0;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private interviewService: InterviewService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('category');
    if (slug) {
      this.category = this.categoryService.getBySlug(slug);
      if (this.category) {
        this.questionCount = this.questionService.getQuestionCountForCategory(this.category.id);
      } else {
        this.error = 'Category not found.';
      }
    }
  }

  startInterview(): void {
    if (!this.category) return;
    const totalQuestions = Math.min(this.questionCount, 20);
    this.interviewService.startInterview(this.category.id, totalQuestions);
    this.router.navigate(['/interview', this.category.slug, 'session']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
